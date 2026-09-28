import { Header } from "@/components/Header";
import { HolderStrip } from "@/components/HolderStrip";
import { RecordCard } from "@/components/RecordCard";
import { TvCarousel } from "@/components/TvCarousel";
import { getHallData } from "@/lib/hall";

/** Mesmo conteúdo para as duas rotas: "/" (computador e celular) e "/tv" (TV 16:9 sem rolagem, recordes em carrossel). */
export async function Hall({ tv = false }: { tv?: boolean }) {
  const { recordes, recordistas } = await getHallData();

  return (
    <>
      <Header />

      <main className="wrap tv:fixed tv:inset-0 tv:m-auto tv:flex tv:h-[56.25rem] tv:w-[100rem] tv:max-w-none tv:flex-col tv:px-10 tv:py-8">
        <section className="pt-10 pb-8 sm:pt-12 sm:pb-10 tv:flex tv:shrink-0 tv:items-center tv:justify-between tv:gap-8 tv:p-0 tv:pb-6">
          <div className="tv:max-w-[22rem]">
          <p className="text-[0.8rem] font-semibold tracking-[0.2em] text-gold uppercase">Reconhecimento</p>
          <h1 className="mt-2 text-[clamp(2.2rem,6vw,2.9rem)] leading-[1.1] font-bold tracking-tight tv:text-[2.6rem]">
            Hall dos Recordes
          </h1>
          <p className="mt-3.5 max-w-[38rem] text-[1.1rem] text-muted tv:mt-2 tv:text-[0.95rem] tv:leading-snug">
            Quem quebrou recorde no comercial da Alpha. O próximo nome aqui pode ser o seu.
          </p>
          </div>
          <HolderStrip recordistas={recordistas} />
        </section>

        {tv ? (
          <TvCarousel recordes={recordes} recordistas={recordistas} />
        ) : (
          <section
            aria-label="Recordes"
            className="grid grid-cols-1 gap-5 pb-16 sm:grid-cols-2 lg:grid-cols-3 min-[120rem]:grid-cols-4"
          >
            {recordes.map((r) => (
              <RecordCard key={r.id} recorde={r} recordistas={recordistas} />
            ))}
          </section>
        )}
      </main>
    </>
  );
}
