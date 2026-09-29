import Image from "next/image";
import type { Recordista } from "@/data/records";

export function HolderStrip({ recordistas }: { recordistas: Recordista[] }) {
  return (
    <ul className="-mx-5 mt-7 flex snap-x gap-x-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:mx-0 sm:mt-8 sm:flex-wrap sm:gap-x-1.5 sm:gap-y-6 sm:overflow-visible sm:px-0 sm:pb-0 tv:mt-5 tv:flex-nowrap">
      {recordistas.map((p) => (
        <li key={p.id} className="flex w-[5.1rem] shrink-0 snap-start flex-col items-center text-center sm:w-[7.5rem] tv:w-[7.2rem]">
          <div className="relative size-[4.3rem] rounded-full bg-bg p-[0.3rem] shadow-[0_0_0_0.16rem_var(--color-gold),0_0_1.4rem_rgb(247_181_43/0.18)] sm:size-[5.6rem] tv:size-[4.4rem]">
            <div className="relative size-full overflow-hidden rounded-full">
              <Image src={p.foto} alt={p.nome} fill sizes="8rem" className="object-cover" />
            </div>
            {p.qtdRecordes > 1 && (
              <span className="absolute -top-0.5 -right-2 grid h-7 min-w-7 place-items-center rounded-full bg-gold px-1.5 text-[0.78rem] font-extrabold text-gold-ink shadow-[0_0_0_0.18rem_var(--color-bg)]">
                ×{p.qtdRecordes}
              </span>
            )}
          </div>
          <span className="mt-3 line-clamp-2 w-full text-[0.85rem] leading-tight font-semibold [overflow-wrap:anywhere] sm:text-[0.95rem] tv:mt-2 tv:line-clamp-1 tv:text-[0.85rem]">{p.nome}</span>
          <span className="mt-1 text-[0.8rem] text-muted tv:mt-0.5 tv:text-[0.72rem]">{p.cargo}</span>
        </li>
      ))}
    </ul>
  );
}
