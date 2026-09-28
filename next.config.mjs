/**
 * Storage de imagens do ERP (fotos e capas). ERP_IMAGES_HOST aceita:
 *   "storage.exemplo.com", "*.exemplo.com" ou uma URL completa ("https://storage.exemplo.com").
 * Sem protocolo, assume https.
 */
function padraoImagensErp() {
  const valor = process.env.ERP_IMAGES_HOST?.trim();
  if (!valor) return null;
  if (valor.includes("://")) {
    const url = new URL(valor);
    return { protocol: url.protocol.replace(":", ""), hostname: url.hostname, port: url.port, pathname: "/**" };
  }
  return { protocol: "https", hostname: valor, pathname: "/**" };
}

const erp = padraoImagensErp();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: erp ? [erp] : [],
    // Só para testar com um ERP rodando na própria máquina; em produção o host é público e isto fica false.
    dangerouslyAllowLocalIP: erp ? ["localhost", "127.0.0.1"].includes(erp.hostname) : false,
  },
};
export default nextConfig;
