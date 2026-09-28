import { recordes, recordistas, type Recorde, type Recordista } from "@/data/records";

export type HallData = {
  recordes: Recorde[];
  /** Ordenados por qtdRecordes (desc), mantendo a ordem original no empate. */
  recordistas: Recordista[];
};

/**
 * Único ponto de leitura de dados da página.
 * Fase 1: lê data/records.ts. Fase 2: troque o corpo por um fetch na API
 * que devolva o mesmo formato; página e componentes não mudam.
 */
export async function getHallData(): Promise<HallData> {
  return {
    recordes,
    recordistas: recordistas
      .filter((p) => p.qtdRecordes > 0)
      .map((p, i) => ({ p, i }))
      .sort((a, b) => b.p.qtdRecordes - a.p.qtdRecordes || a.i - b.i)
      .map(({ p }) => p),
  };
}
