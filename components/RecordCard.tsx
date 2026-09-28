import Image from "next/image";
import { participantes, type Recorde, type Recordista } from "@/data/records";

// Layout da capa conforme o nº de fotos (igual aos prints: 1, 2 lado a lado, 4 em grade).
const COVER_GRID: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-2 grid-rows-2",
};

// Largura de cada foto da capa: largura do card (4/3/2/1 colunas) dividida pelas colunas da capa.
const coverSizes = (cols: number) =>
  [
    `(min-width: 1600px) and (min-height: 800px) ${Math.ceil(15 / cols)}vw`,
    `(min-width: 1024px) ${Math.ceil(34 / cols)}vw`,
    `(min-width: 640px) ${Math.ceil(50 / cols)}vw`,
    `${Math.ceil(100 / cols)}vw`,
  ].join(", ");

export function RecordCard({ recorde, recordistas }: { recorde: Recorde; recordistas: Recordista[] }) {
  const pessoas = participantes(recorde).flatMap((part) => {
    const pessoa = recordistas.find((r) => r.id === part.recordistaId);
    return pessoa ? [{ ...pessoa, area: part.area }] : [];
  });
  const capas = (recorde.imagem ? [recorde.imagem] : pessoas.map((p) => p.foto)).slice(0, 4);
  const alt = pessoas.map((p) => p.nome).join(", ");

  return (
    <article className="@container flex flex-col overflow-hidden rounded-[1.15rem] border border-line bg-card tv:min-h-0 tv:rounded-[0.9rem]">
      {/* No modo TV a foto ocupa o espaço que sobrar no card (altura fixa da grade) */}
      <div className={`relative grid aspect-[16/11] bg-[#0b0906] tv:aspect-auto tv:min-h-0 tv:flex-1 ${COVER_GRID[capas.length] ?? ""}`}>
        {capas.map((src, i) => (
          <div key={src + i} className="relative overflow-hidden">
            <Image
              src={src}
              alt={i === 0 ? alt : ""}
              fill
              sizes={coverSizes(capas.length === 3 ? 3 : capas.length > 1 ? 2 : 1)}
              className="object-cover object-[center_30%]"
            />
          </div>
        ))}
        {/* Escurece a base da foto para o número entrar por cima */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_45%,rgb(21_17_11/0.55)_72%,var(--color-card)_100%)]" />
        <span className="absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-gold py-1 pr-3 pl-2.5 text-[0.72rem] font-bold tracking-[0.12em] text-gold-ink uppercase tv:top-2 tv:left-2 tv:gap-1 tv:py-0.5 tv:pr-2.5 tv:pl-2 tv:text-[0.68rem]">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="size-3 fill-current">
            <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" />
          </svg>
          Recorde
        </span>
      </div>

      <div className="relative z-10 -mt-14 flex flex-1 flex-col px-[1.4rem] pb-[1.6rem] tv:-mt-8 tv:flex-none tv:px-3.5 tv:pb-3">
        {/* cqi: o valor acompanha a largura do card (3 ou 4 colunas, TV ou notebook) */}
        {/* TV: 2.2rem, encolhendo só se o texto não couber numa linha (~0.54em por caractere) */}
        <p
          style={{ "--chars": recorde.valor.length } as React.CSSProperties}
          className="text-[clamp(2.25rem,12.5cqi,4.5rem)] leading-[1.05] font-bold tracking-tight text-gold [text-shadow:0_0.2rem_1.2rem_rgb(0_0_0/0.55)] tv:text-[min(2.2rem,calc((100cqi-1.75rem)/(var(--chars)*0.54)))] tv:whitespace-nowrap"
        >
          {recorde.valor}
        </p>
        <h3 className="mt-2 text-[1.35rem] leading-tight font-bold tv:mt-1 tv:line-clamp-3 tv:text-[1.02rem]">{recorde.titulo}</h3>
        <p className="mt-2.5 text-[0.95rem] text-muted tv:hidden">{recorde.descricao}</p>
        <ul className="mt-4 flex flex-wrap gap-2 tv:mt-2 tv:gap-1.5">
          {pessoas.map((p) => (
            <li
              key={p.id}
              className="inline-flex items-center gap-2 rounded-full bg-pill py-1 pr-3 pl-1.5 text-[0.9rem] font-medium tv:gap-1.5 tv:py-0.5 tv:pr-2.5 tv:pl-1 tv:text-[0.8rem]"
            >
              <span className="rounded-full bg-gold px-2 py-0.5 text-[0.68rem] font-bold tracking-[0.08em] text-gold-ink tv:px-1.5 tv:text-[0.62rem]">
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
