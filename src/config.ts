// 환경 변수로 모든 운영값을 주입받는다. 기본값은 OCI 인스턴스 표준 경로.
export default {
  storageDir: process.env.STORAGE_DIR ?? "/home/potados/collected",
  port: Number(process.env.PORT ?? 8086),
  // Express는 reverse proxy(Caddy) 뒤에 있으므로 X-Forwarded-* 신뢰
  trustProxy: process.env.TRUST_PROXY ?? "loopback",
  publicBaseUrl: process.env.PUBLIC_BASE_URL ?? "https://collect.potados.com",
};
