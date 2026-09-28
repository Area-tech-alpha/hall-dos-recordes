// Fonte única dos dados da LP (Fase 1). Na Fase 2 os arrays daqui saem e
// lib/hall.ts passa a buscar na API; os tipos continuam valendo.

export type Area = "SDR" | "CLOSER";
export type Cargo = "SDR" | "Closer";

export interface Recordista {
  id: string;
  nome: string;
  cargo: Cargo;
  /** Caminho em /public, ex.: "/images/italo-silva.jpg" */
  foto: string;
  /** Calculado a partir de `recordes` (não digite). */
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

const baseRecordistas: Omit<Recordista, "qtdRecordes">[] = [
  { id: "micael", nome: "Micael Growth", cargo: "SDR", foto: "/images/micael-growth.jpg" },
  { id: "gabriel", nome: "Gabriel Silva", cargo: "Closer", foto: "/images/gabriel-silva.jpg" },
  { id: "italo", nome: "Italo Silva", cargo: "SDR", foto: "/images/italo-silva.jpg" },
  { id: "rafael", nome: "Rafael Gomes", cargo: "Closer", foto: "/images/rafael-gomes.jpg" },
  { id: "adriel", nome: "Adriel Abreu", cargo: "Closer", foto: "/images/adriel-abreu.jpg" },
  { id: "guilherme", nome: "Guilherme Moura", cargo: "SDR", foto: "/images/guilherme-moura.jpg" },
  { id: "yoshio", nome: "Yoshio Aragão", cargo: "SDR", foto: "/images/yoshio-aragao.jpg" },
  { id: "icaro", nome: "Icaro Patriota", cargo: "Closer", foto: "/images/icaro-patriota.jpg" },
  { id: "isaias", nome: "Isaías Silva", cargo: "SDR", foto: "/images/isaias-silva.jpg" },
  { id: "joao", nome: "João Paulo", cargo: "Closer", foto: "/images/joao-paulo.jpg" },
];

export const recordes: Recorde[] = [
  {
    id: "no-show",
    valor: "09,01%",
    titulo: "Menor no-show do mês",
    descricao: "Recorde de no-show mais baixo de um SDR em um mês.",
    area: "SDR",
    recordistaId: "italo",
  },
  {
    id: "unidades-reuniao",
    valor: "7 unidades",
    titulo: "Vendidas na mesma reunião",
    descricao: "Maior número de unidades fechadas em uma única reunião.",
    area: "SDR",
    recordistaId: "micael",
    coRecordistas: [{ recordistaId: "gabriel", area: "CLOSER" }],
  },
  {
    id: "food-reuniao",
    valor: "R$ 62.000",
    titulo: "Venda mais alta do nicho food em 1 reunião",
    descricao: "A maior venda já feita em uma única reunião no nicho food.",
    area: "CLOSER",
    recordistaId: "rafael",
    coRecordistas: [{ recordistaId: "yoshio", area: "SDR" }],
  },
  {
    id: "reunioes-dia",
    valor: "35 reuniões",
    titulo: "Marcadas em um único dia",
    descricao: "Mais reuniões marcadas por um SDR em um só dia.",
    area: "SDR",
    recordistaId: "italo",
  },
  {
    id: "vendas-gerenciadas",
    valor: "R$ 15M+",
    titulo: "Em vendas gerenciadas na Alpha",
    descricao: "Mais de R$ 15 milhões em vendas gerenciadas na Alpha.",
    area: "SDR",
    recordistaId: "micael",
    coRecordistas: [{ recordistaId: "gabriel", area: "CLOSER" }],
  },
  {
    id: "conversao-mes",
    valor: "43%",
    titulo: "Maior taxa de conversão em 1 mês",
    descricao: "A maior taxa de conversão registrada em um mês.",
    area: "CLOSER",
    recordistaId: "adriel",
  },
  {
    id: "sdr-mes",
    valor: "R$ 615 mil",
    titulo: "SDR que mais vendeu em 1 mês",
    descricao: "Maior volume vendido por um SDR em um único mês: R$ 615 mil em franquias.",
    area: "SDR",
    recordistaId: "isaias",
  },
  {
    id: "franquias-dia",
    valor: "R$ 180 mil",
    titulo: "Vendidos em franquias em 1 dia",
    descricao: "Maior volume de vendas de franquias em um único dia.",
    area: "CLOSER",
    recordistaId: "icaro",
  },
  {
    id: "closer-500",
    valor: "R$ 500 mil",
    titulo: "Primeiro closer a bater R$ 500 mil em vendas no mês",
    descricao: "Marco histórico do time de closers.",
    area: "CLOSER",
    recordistaId: "rafael",
  },
  {
    id: "8-de-8",
    valor: "8 de 8",
    titulo: "8 reuniões feitas, 8 vendas, tudo em seguida",
    descricao: "Sequência perfeita: 100% de conversão em 8 reuniões seguidas.",
    area: "CLOSER",
    recordistaId: "adriel",
  },
  {
    id: "vendas-dia",
    valor: "R$ 215 mil",
    titulo: "Vendidos em 1 dia",
    descricao: "R$ 215 mil vendidos em um único dia.",
    area: "SDR",
    recordistaId: "micael",
    coRecordistas: [
      { recordistaId: "rafael", area: "CLOSER" },
      { recordistaId: "italo", area: "SDR" },
      { recordistaId: "guilherme", area: "SDR" },
    ],
  },
  {
    id: "calls-mes",
    valor: "49 calls",
    titulo: "Calls qualificadas entregues em 1 mês",
    descricao: "Maior número de calls qualificadas entregues por um SDR em um único mês.",
    area: "SDR",
    recordistaId: "guilherme",
  },
  {
    id: "food-dia-sdr",
    valor: "R$ 92 mil",
    titulo: "Vendidos em 1 dia no nicho food como SDR",
    descricao: "Maior valor vendido em um único dia no nicho food por um SDR.",
    area: "SDR",
    recordistaId: "micael",
  },
  {
    id: "follow-up",
    valor: "196 dias",
    titulo: "Para fechar uma venda com o mesmo lead",
    descricao: "O follow-up mais longo que virou venda: 196 dias sem desistir do lead até o fechamento.",
    area: "SDR",
    recordistaId: "italo",
  },
  {
    id: "duas-pontas",
    valor: "R$ 180 mil",
    titulo: "Vendidos em 1 mês atuando como SDR e closer",
    descricao: "R$ 180 mil vendidos em um único mês fazendo as duas pontas: prospectou, agendou e fechou.",
    area: "CLOSER",
    recordistaId: "gabriel",
  },
  {
    id: "marcacao-mes",
    valor: "72%",
    titulo: "Maior taxa de marcação no mês",
    descricao: "Maior taxa de marcação de reuniões de um SDR em um único mês.",
    area: "SDR",
    recordistaId: "yoshio",
  },
  {
    id: "top-sdr",
    valor: "8x",
    titulo: "Vezes seguidas como Top SDR",
    descricao: "Mais vezes Top SDR da Alpha: 8 vezes seguidas no topo do ranking.",
    area: "SDR",
    recordistaId: "micael",
  },
  {
    id: "contratos-mes",
    valor: "56 contratos",
    titulo: "Contratos vendidos em 1 mês",
    descricao: "Maior número de contratos fechados por um closer em um único mês.",
    area: "CLOSER",
    recordistaId: "joao",
  },
  {
    // TODO(confirmar com o comercial): o texto deste card não aparece nos prints
    // (só a foto do Gabriel, que precisa de um 4º recorde para fechar o ×4).
    id: "franquia-internacional",
    valor: "1 franquia",
    titulo: "Mais franquias internacionais vendidas",
    descricao: "Recorde de franquias Alpha vendidas fora do Brasil.",
    area: "CLOSER",
    recordistaId: "gabriel",
  },
];

/** Recordista principal + coRecordistas, na ordem do card. */
export function participantes(r: Recorde): Participacao[] {
  return [{ recordistaId: r.recordistaId, area: r.area }, ...(r.coRecordistas ?? [])];
}

function contarRecordes(): Map<string, number> {
  const ids = new Set(baseRecordistas.map((p) => p.id));
  const count = new Map<string, number>();
  for (const r of recordes)
    for (const { recordistaId } of participantes(r)) {
      if (!ids.has(recordistaId)) throw new Error(`Recorde "${r.id}": recordista "${recordistaId}" não existe.`);
      count.set(recordistaId, (count.get(recordistaId) ?? 0) + 1);
    }
  return count;
}

const qtd = contarRecordes();

export const recordistas: Recordista[] = baseRecordistas.map((p) => ({ ...p, qtdRecordes: qtd.get(p.id) ?? 0 }));
