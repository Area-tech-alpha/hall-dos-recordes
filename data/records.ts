// Tipos da LP. Os dados vêm da API do ERP (Growth Academy → Gestão dos recordes), via lib/hall.ts.

export type Area = "SDR" | "CLOSER";
export type Cargo = "SDR" | "Closer";

export interface Recordista {
  id: string;
  nome: string;
  cargo: Cargo;
  /** URL da foto (storage do ERP) */
  foto: string;
  /** Quantos recordes a pessoa tem (calculado em lib/hall.ts a partir das participações). */
  qtdRecordes: number;
}

export interface Participacao {
  recordistaId: string;
  /** Área em que a pessoa atuou NESSE recorde. */
  area: Area;
}

/** Chamado de "Record" na especificação; renomeado para não colidir com o Record<K, V> do TypeScript. */
export interface Recorde {
  id: string;
  valor: string;
  titulo: string;
  descricao: string;
  /** Área do recordista principal. */
  area: Area;
  /** Recordista principal. */
  recordistaId: string;
  /** Capa do card. Se omitida, a capa é montada com as fotos dos participantes (1, 2, 3 ou 4). */
  imagem?: string;
  /** Recordes em dupla/equipe: demais participantes, na ordem em que aparecem no card. */
  coRecordistas?: Participacao[];
}
