import "server-only";
import type { Recorde, Recordista } from "@/data/records";
import { recordesLocais, recordistasLocais } from "@/data/records-local";
import { converterHallErp } from "@/lib/hall-erp";

export type HallData = {
  recordes: Recorde[];
  /** Só quem tem recorde, ordenados por qtdRecordes (desc), mantendo a ordem da fonte no empate. */
  recordistas: Recordista[];
};

/** Tag do cache do fetch; POST /api/revalidate invalida na hora. */
export const HALL_TAG = "hall";

// Recordes e fotos locais (public/images): usados sem o ERP configurado e como reserva se ele falhar.
const LOCAL: HallData = montar({ recordes: recordesLocais, recordistas: recordistasLocais });

// Último retorno válido do ERP nesta instância: se ele cair por um instante, a LP e a TV
// continuam com os dados dele em vez de voltar para os locais.
let ultimoValido: HallData | null = null;

/**
 * Único ponto de leitura de dados da LP (/ e /tv): busca no ERP e devolve o mesmo formato de sempre,
 * então páginas e componentes não mudam. Nunca lança erro. Prioridade:
 *   1. ERP (ERP_API_URL definida e resposta válida em GET /public/hall-of-fame)
 *   2. último retorno válido do ERP nesta instância
 *   3. recordes locais (data/records-local.ts + public/images)
 */
export async function getHallData(): Promise<HallData> {
  const base = process.env.ERP_API_URL?.trim().replace(/\/+$/, "");
  if (!base) return LOCAL; // ERP não configurado: recordes locais

  try {
    const res = await fetch(`${base}/public/hall-of-fame`, {
      headers: { accept: "application/json" },
      next: { revalidate: 60, tags: [HALL_TAG] },
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) throw new Error(`ERP respondeu ${res.status} ${res.statusText}`);

    const conv = converterHallErp(await res.json(), base);
    if (!conv.ok) throw new Error(conv.erro);
    for (const aviso of conv.avisos) console.warn("[hall]", aviso);

    ultimoValido = montar(conv);
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
