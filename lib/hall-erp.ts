// Contrato do ERP (GET /public/hall-of-fame) → formato interno da LP (tipos em data/records.ts).
// Função pura, sem fetch: usada por lib/hall.ts e pelo teste scripts/test-hall-erp.ts.
import { z } from "zod";
import type { Recorde, Recordista } from "@/data/records";

export const SEM_FOTO = "/images/sem-foto.svg";

/** Limites de texto (caracteres). Acima disso o texto é cortado com "…" e o corte vai para os avisos. */
export const LIMITES = { valor: 14, titulo: 60, descricao: 110, nome: 22 } as const;

/**
 * Corta em no máximo `max` caracteres (contando o "…"), sem partir emoji/acentos compostos
 * e sem deixar pontuação solta antes das reticências ("R$ 1.234.567.…" vira "R$ 1.234.567…").
 */
export function limitar(texto: string, max: number): string {
  const chars = Array.from(texto.trim());
  if (chars.length <= max) return chars.join("");
  return chars.slice(0, max - 1).join("").replace(/[\s.,;:!?·\-–—]+$/u, "") + "…";
}

const Track = z.enum(["SDR", "CLOSER"]);

const Membro = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  track: Track,
  photoUrl: z.string().min(1).nullable(),
});

export const RespostaHallErp = z.object({
  success: z.literal(true),
  data: z.object({
    members: z.array(Membro.extend({ recordCount: z.number().int().nonnegative() })),
    records: z.array(
      z.object({
        id: z.string().min(1),
        value: z.string(),
        title: z.string(),
        description: z.string().nullable(),
        // Capa opcional, relativa à base da API (como photoUrl). Ausente = sem capa.
        coverUrl: z.string().min(1).nullish(),
        members: z.array(Membro),
      }),
    ),
  }),
});

export type ResultadoConversao =
  | { ok: true; recordes: Recorde[]; recordistas: Omit<Recordista, "qtdRecordes">[]; avisos: string[] }
  | { ok: false; erro: string };

/**
 * Valida e converte a resposta do ERP.
 * - foto: photoUrl é relativo à base da API (responde 302 para o S3); sem foto → /images/sem-foto.svg.
 * - área de cada participante: o track que vem DENTRO do recorde (cargo na época), não o atual do membro.
 * - capa: coverUrl relativo à base da API; sem capa, o card usa as fotos dos participantes (até 4).
 * - recordes sem participantes são descartados (com aviso).
 * - textos acima de LIMITES são cortados com "…" (com aviso), para dado fora do padrão não quebrar o card.
 */
export function converterHallErp(json: unknown, baseApi: string): ResultadoConversao {
  const envelope = z.object({ success: z.boolean() }).safeParse(json);
  if (envelope.success && envelope.data.success !== true) return { ok: false, erro: "ERP respondeu success: false" };

  const parsed = RespostaHallErp.safeParse(json);
  if (!parsed.success) return { ok: false, erro: `resposta fora do formato esperado: ${z.prettifyError(parsed.error)}` };

  const base = baseApi.replace(/\/+$/, "");
  const foto = (photoUrl: string | null) => (photoUrl ? `${base}${photoUrl}` : SEM_FOTO);
  const { members, records } = parsed.data.data;
  const avisos: string[] = [];
  const cortar = (campo: keyof typeof LIMITES, texto: string, onde: string) => {
    const curto = limitar(texto, LIMITES[campo]);
    if (curto !== texto.trim()) avisos.push(`${onde}: ${campo} com ${Array.from(texto.trim()).length} caracteres cortado para ${LIMITES[campo]}`);
    return curto;
  };

  // Membros na ordem do ERP; quem aparece num recorde mas não na lista de membros entra no fim.
  const recordistas = new Map<string, Omit<Recordista, "qtdRecordes">>();
  const adicionar = (m: z.output<typeof Membro>) => {
    if (!recordistas.has(m.id)) {
      recordistas.set(m.id, {
        id: m.id,
        nome: cortar("nome", m.name, `membro "${m.id}"`),
        cargo: m.track === "SDR" ? "SDR" : "Closer",
        foto: foto(m.photoUrl),
      });
    }
  };
  members.forEach(adicionar);

  const recordes: Recorde[] = [];
  for (const r of records) {
    const [principal, ...outros] = r.members;
    if (!principal) {
      avisos.push(`recorde "${r.id}" (${r.title}) descartado: sem participantes`);
      continue;
    }
    r.members.forEach(adicionar);
    const onde = `recorde "${r.id}"`;
    recordes.push({
      id: r.id,
      valor: cortar("valor", r.value, onde),
      titulo: cortar("titulo", r.title, onde),
      descricao: cortar("descricao", r.description ?? "", onde),
      recordistaId: principal.id,
      area: principal.track,
      coRecordistas: outros.length ? outros.map((m) => ({ recordistaId: m.id, area: m.track })) : undefined,
      imagem: r.coverUrl ? `${base}${r.coverUrl}` : undefined,
    });
  }

  return { ok: true, recordes, recordistas: [...recordistas.values()], avisos };
}
