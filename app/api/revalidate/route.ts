import { timingSafeEqual } from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { HALL_TAG } from "@/lib/hall";

/** Comparação em tempo constante, para não vazar o secret por tempo de resposta. */
function secretConfere(recebido: string | null): boolean {
  const esperado = process.env.HALL_REVALIDATE_SECRET;
  if (!esperado || !recebido) return false;
  const a = Buffer.from(recebido);
  const b = Buffer.from(esperado);
  return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * O ERP chama isto depois de salvar um recorde:
 *   POST /api/revalidate   header x-revalidate-secret: HALL_REVALIDATE_SECRET
 * A próxima visita a / e /tv já busca os dados novos (sem esperar os 60s do cache).
 */
export async function POST(request: Request) {
  if (!secretConfere(request.headers.get("x-revalidate-secret"))) {
    return NextResponse.json({ ok: false, erro: "Não autorizado" }, { status: 401 });
  }
  // expire: 0 → nada de conteúdo antigo depois da chamada; a próxima requisição já busca no ERP
  revalidateTag(HALL_TAG, { expire: 0 });
  // Também as páginas renderizadas, para / e /tv não servirem HTML antigo
  revalidatePath("/");
  revalidatePath("/tv");
  return NextResponse.json({ ok: true, revalidado: HALL_TAG });
}
