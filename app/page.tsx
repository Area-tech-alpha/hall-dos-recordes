import { Header } from "@/components/Header";
import { HolderStrip } from "@/components/HolderStrip";
import { RecordCard } from "@/components/RecordCard";
import { TvMode } from "@/components/TvMode";
import { getHallData } from "@/lib/hall";

export default async function Page() {
  const { recordes, recordistas } = await getHallData();

  return (
    <>
      <Header />

      <main className="wrap">
        <section className="pt-12 pb-10">
          <p className="text-[0.8rem] font-semibold tracking-[0.2em] text-gold uppercase">Reconhecimento</p>
          <h1 className="mt-2 text-[clamp(2.2rem,6vw,2.9rem)] leading-[1.1] font-bold tracking-tight">
            Hall dos Recordes
          </h1>
          <p className="mt-3.5 max-w-[38rem] text-[1.1rem] text-muted">
            Quem quebrou recorde no comercial da Alpha. O próximo nome aqui pode ser o seu.
          </p>
          <HolderStrip recordistas={recordistas} />
        </section>

        <section
          aria-label="Recordes"
          className="grid grid-cols-1 gap-5 pb-16 sm:grid-cols-2 lg:grid-cols-3 tv:grid-cols-4"
        >
          {recordes.map((r) => (
            <RecordCard key={r.id} recorde={r} recordistas={recordistas} />
          ))}
        </section>
      </main>

      <TvMode />
    </>
  );
}
