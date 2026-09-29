import Image from "next/image";
import type { Participacao, Recorde, Recordista } from "@/data/records";

/** Recordista principal + coRecordistas, na ordem do card. */
const participantes = (r: Recorde): Participacao[] => [
  { recordistaId: r.recordistaId, area: r.area },
  ...(r.coRecordistas ?? []),
];

// Layout da capa conforme o nº de fotos (igual aos prints: 1, 2 lado a lado, 4 em grade).
const COVER_GRID: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-2 grid-rows-2",
};

// Largura de cada foto da capa: largura do card dividida pelas colunas da capa.
// TV: 3 cards no carrossel. Computador/celular: 4/3/2/1 colunas conforme a largura.
const coverSizes = (cols: number, tv: boolean) =>
  tv
    ? `${Math.ceil(33 / cols)}vw`
    : [
        `(min-width: 1920px) ${Math.ceil(25 / cols)}vw`,
        `(min-width: 1024px) ${Math.ceil(34 / cols)}vw`,
        `(min-width: 640px) ${Math.ceil(50 / cols)}vw`,
        `${Math.ceil(100 / cols)}vw`,
      ].join(", ");

export function RecordCard({
  recorde,
  recordistas,
  tv = false,
}: {
  recorde: Recorde;
  recordistas: Recordista[];
  tv?: boolean;
}) {
  const pessoas = participantes(recorde).flatMap((part) => {
    const pessoa = recordistas.find((r) => r.id === part.recordistaId);
    return pessoa ? [{ ...pessoa, area: part.area }] : [];
  });
  const capas = (recorde.imagem ? [recorde.imagem] : pessoas.map((p) => p.foto)).slice(0, 4);
  const alt = pessoas.map((p) => p.nome).join(", ");

  return (
    <article className="@container flex flex-col overflow-hidden rounded-[1.15rem] border border-line bg-card max-sm:snap-start max-sm:scroll-mt-5 tv:h-full">
      {/* Na TV a foto ocupa a altura que sobrar no card (altura fixa do carrossel) */}
      <div className={`relative grid aspect-[16/11] bg-[#0b0906] tv:aspect-auto tv:min-h-0 tv:flex-1 ${COVER_GRID[capas.length] ?? ""}`}>
        {capas.map((src, i) => (
          <div key={src + i} className="relative overflow-hidden">
            <Image
              src={src}
              alt={i === 0 ? alt : ""}
              fill
              sizes={coverSizes(capas.length === 3 ? 3 : capas.length > 1 ? 2 : 1, tv)}
              className="object-cover object-[center_30%]"
            />
          </div>
        ))}
        {/* Escurece a base da foto para o número entrar por cima */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_45%,rgb(21_17_11/0.55)_72%,var(--color-card)_100%)]" />
        <span className="absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-gold py-1 pr-3 pl-2.5 text-[0.72rem] font-bold tracking-[0.12em] text-gold-ink uppercase">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="size-3 fill-current">
            <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" />
          </svg>
          Recorde
        </span>
      </div>

      <div className="relative z-10 -mt-14 flex flex-1 flex-col px-[1.4rem] pb-[1.6rem] tv:flex-none">
        {/* cqi: o valor acompanha a largura do card (3 ou 4 colunas, TV ou notebook) */}
        <p className="overflow-hidden text-[clamp(2.25rem,12.5cqi,4.5rem)] leading-[1.05] font-bold tracking-tight text-ellipsis whitespace-nowrap text-gold [text-shadow:0_0.2rem_1.2rem_rgb(0_0_0/0.55)]">
          {recorde.valor}
        </p>
        <h3 className="mt-2 line-clamp-2 text-[1.35rem] leading-tight font-bold">{recorde.titulo}</h3>
        <p className="mt-2.5 line-clamp-2 text-[0.95rem] text-muted">{recorde.descricao}</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {pessoas.map((p) => (
            <li
              key={p.id}
              className="inline-flex items-center gap-2 rounded-full bg-pill py-1 pr-3 pl-1.5 text-[0.9rem] font-medium"
            >
              <span className="rounded-full bg-gold px-2 py-0.5 text-[0.68rem] font-bold tracking-[0.08em] text-gold-ink">
                {p.area}
              </span>
              {p.nome}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
