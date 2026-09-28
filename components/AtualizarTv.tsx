"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const INTERVALO_MS = 5 * 60 * 1000;

/** A TV fica horas com a página aberta: a cada 5 min busca os recordes de novo, sem recarregar a página. */
export function AtualizarTv() {
  const router = useRouter();
  useEffect(() => {
    const id = setInterval(() => router.refresh(), INTERVALO_MS);
    return () => clearInterval(id);
  }, [router]);
  return null;
}
