/**
 * Fotos do ERP: o next/image busca `${ERP_API_URL}/public/hall-of-fame/members/:id/photo?v=...`, que responde
 * 302 para uma URL assinada do S3. O otimizador segue o redirecionamento sozinho (images.maximumRedirects,
 * padrão 3); o host do S3 (ERP_IMAGES_HOST) também fica liberado.
 */
function padraoApiErp() {
  const valor = process.env.ERP_API_URL?.trim();
  if (!valor || !URL.canParse(valor)) return null; // valor inválido não quebra o build (a LP usa a reserva local)
  const url = new URL(valor);
  const prefixo = url.pathname.replace(/\/+$/, "");
  return {
    protocol: url.protocol.replace(":", ""),
    hostname: url.hostname,
    port: url.port,
    pathname: `${prefixo}/public/hall-of-fame/**`,
  };
}

/** ERP_IMAGES_HOST: "bucket.s3.amazonaws.com", "*.s3.amazonaws.com" ou URL completa. Sem protocolo, assume https. */
function padraoS3() {
  const valor = process.env.ERP_IMAGES_HOST?.trim();
  if (!valor) return null;
  if (valor.includes("://")) {
    if (!URL.canParse(valor)) return null;
    const url = new URL(valor);
    return { protocol: url.protocol.replace(":", ""), hostname: url.hostname, port: url.port, pathname: "/**" };
  }
  return { protocol: "https", hostname: valor, pathname: "/**" };
}

const padroes = [padraoApiErp(), padraoS3()].filter(Boolean);

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: padroes,
    // Só para testar com um ERP rodando na própria máquina; em produção os hosts são públicos e isto fica false.
    dangerouslyAllowLocalIP: padroes.some((p) => ["localhost", "127.0.0.1"].includes(p.hostname)),
  },
};
export default nextConfig;
