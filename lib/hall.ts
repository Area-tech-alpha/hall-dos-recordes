import "server-only";
import { z } from "zod";
import type { Recorde, Recordista } from "@/data/records";
import { recordesLocais, recordistasLocais } from "@/data/records-local";

export type HallData = {
  recordes: Recorde[];
  /** Só quem tem recorde, ordenados por qtdRecordes (desc), mantendo a ordem da API no empate. */
  recordistas: Recordista[];
};

/** Tag do cache do fetch; POST /api/revalidate invalida na hora. */
export const HALL_TAG = "hall";

const Area = z.enum(["SDR", "CLOSER"]);

const RespostaHall = z.object({
  recordes: z.array(
    z.object({
      id: z.string().min(1),
      valor: z.string(),
      titulo: z.string(),
      descricao: z.string(),
      area: Area,
      recordistaId: z.string().min(1),
      // O ERP pode mandar null quando não há capa
      imagem: z
        .string()
        .min(1)
        .nullish()
        .transform((v) => v ?? undefined),
      coRecordistas: z
        .array(z.object({ recordistaId: z.string().min(1), area: Area }))
        .nullish()
        .transform((v) => (v?.length ? v : undefined)),
    }),
  ),
  recordistas: z.array(
    z.object({
      id: z.string().min(1),
      nome: z.string().min(1),
      cargo: z.enum(["SDR", "Closer"]),
      foto: z.string().min(1),
    }),
  ),
});

// Recordes e fotos locais (public/images): usados sem o ERP configurado e como reserva se ele falhar.
const LOCAL: HallData = montar({ recordes: recordesLocais, recordistas: recordistasLocais });

// Último retorno válido do ERP nesta instância: se ele cair por um instante, a LP e a TV
// continuam com os dados dele em vez de voltar para os locais.
let ultimoValido: HallData | null = null;

/**
 * Único ponto de leitura de dados da LP (/ e /tv): busca no ERP e devolve o mesmo formato de sempre,
 * então páginas e componentes não mudam. Nunca lança erro. Prioridade:
 *   1. ERP (ERP_API_URL + HALL_API_KEY configuradas e resposta válida)
 *   2. último retorno válido do ERP nesta instância
 *   3. recordes locais (data/records-local.ts + public/images)
 * Só mostra "Recordes indisponíveis" se nenhum dos três tiver recordes.
 */
export async function getHallData(): Promise<HallData> {
  const base = process.env.ERP_API_URL;
  const chave = process.env.HALL_API_KEY;
  if (!base || !chave) return LOCAL; // ERP ainda não configurado: recordes locais

  try {
    const res = await fetch(`${base.replace(/\/+$/, "")}/public/growth-academy/hall`, {
      headers: { "x-api-key": chave, accept: "application/json" },
      next: { revalidate: 60, tags: [HALL_TAG] },
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) throw new Error(`ERP respondeu ${res.status} ${res.statusText}`);

    const parsed = RespostaHall.safeParse(await res.json());
    if (!parsed.success) {
      throw new Error(`resposta fora do formato esperado: ${z.prettifyError(parsed.error)}`);
    }

    ultimoValido = montar(parsed.data);
    return ultimoValido;
  } catch (e) {
    console.error("[hall] Falha ao buscar recordes no ERP:", e instanceof Error ? e.message : e);
    return ultimoValido ?? LOCAL;
  }
}

/** ×N calculado pelas participações; só entra na faixa quem tem recorde. */
function montar({ recordes, recordistas }: { recordes: Recorde[]; recordistas: Omit<Recordista, "qtdRecordes">[] }): HallData {
  const qtd = new Map<string, number>();
  for (const r of recordes) {
    for (const id of [r.recordistaId, ...(r.coRecordistas ?? []).map((c) => c.recordistaId)]) {
      qtd.set(id, (qtd.get(id) ?? 0) + 1);
    }
  }

  return {
    recordes,
    recordistas: recordistas
      .map((p, i) => ({ p: { ...p, qtdRecordes: qtd.get(p.id) ?? 0 }, i }))
      .filter(({ p }) => p.qtdRecordes > 0)
      .sort((a, b) => b.p.qtdRecordes - a.p.qtdRecordes || a.i - b.i)
      .map(({ p }) => p),
  };
}
