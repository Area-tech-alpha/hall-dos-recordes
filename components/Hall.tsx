import { Header } from "@/components/Header";
import { HolderStrip } from "@/components/HolderStrip";
import { RecordCard } from "@/components/RecordCard";
import { SemRecordes } from "@/components/SemRecordes";
import { TvCarousel } from "@/components/TvCarousel";
import { getHallData } from "@/lib/hall";

/** Mesmo conteúdo para as duas rotas: "/" (computador e celular) e "/tv" (mesma estrutura, em quadro 16:9 com carrossel). */
export async function Hall({ tv = false }: { tv?: boolean }) {
  const { recordes, recordistas } = await getHallData();

  return (
    // TV: logo, título e recordistas como no computador, dentro de um quadro 16:9 fixo
    <div className="tv:fixed tv:inset-0 tv:m-auto tv:flex tv:h-[56.25rem] tv:w-[100rem] tv:flex-col">
      <Header />

      <main className="wrap tv:flex tv:min-h-0 tv:flex-1 tv:flex-col tv:pb-6">
        <section className="pt-10 pb-8 sm:pt-12 sm:pb-10 tv:shrink-0 tv:pt-6 tv:pb-6">
          <p className="text-[0.8rem] font-semibold tracking-[0.2em] text-gold uppercase">Reconhecimento</p>
          <h1 className="mt-2 text-[clamp(2.2rem,6vw,2.9rem)] leading-[1.1] font-bold tracking-tight">Hall dos Recordes</h1>
          <p className="mt-3.5 max-w-[38rem] text-[1.1rem] text-muted tv:mt-2">
            Quem quebrou recorde no comercial da Alpha. O próximo nome aqui pode ser o seu.
          </p>
          {recordistas.length > 0 && <HolderStrip recordistas={recordistas} />}
        </section>

        {recordes.length === 0 ? (
          <SemRecordes />
        ) : tv ? (
          <section aria-label="Recordes" className="flex min-h-0 flex-1 flex-col">
            <TvCarousel recordes={recordes} recordistas={recordistas} />
          </section>
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
    </div>
  );
}
