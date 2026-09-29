// Contrato do ERP (GET /public/hall-of-fame) → formato interno da LP (tipos em data/records.ts).
// Função pura, sem fetch: usada por lib/hall.ts e pelo teste scripts/test-hall-erp.ts.
import { z } from "zod";
import type { Recorde, Recordista } from "@/data/records";

export const SEM_FOTO = "/images/sem-foto.svg";

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
 * - recordes sem participantes são descartados (com aviso).
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

  // Membros na ordem do ERP; quem aparece num recorde mas não na lista de membros entra no fim.
  const recordistas = new Map<string, Omit<Recordista, "qtdRecordes">>();
  const adicionar = (m: z.output<typeof Membro>) => {
    if (!recordistas.has(m.id)) {
      recordistas.set(m.id, { id: m.id, nome: m.name, cargo: m.track === "SDR" ? "SDR" : "Closer", foto: foto(m.photoUrl) });
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
    recordes.push({
      id: r.id,
      valor: r.value,
      titulo: r.title,
      descricao: r.description ?? "",
      recordistaId: principal.id,
      area: principal.track,
      coRecordistas: outros.length ? outros.map((m) => ({ recordistaId: m.id, area: m.track })) : undefined,
      imagem: undefined,
    });
  }

  return { ok: true, recordes, recordistas: [...recordistas.values()], avisos };
}
