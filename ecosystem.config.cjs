// PM2 프로세스 정의. OCI 인스턴스에서 `pm2 start ecosystem.config.cjs`로 띄운다.
module.exports = {
  apps: [
    {
      name: "collect",
      script: "dist/index.js",
      cwd: __dirname,
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 8086,
        STORAGE_DIR: "/home/potados/collected",
        PUBLIC_BASE_URL: "https://collect.potados.com",
        TRUST_PROXY: "loopback",
      },
      max_memory_restart: "256M",
      error_file: "logs/collect.err.log",
      out_file: "logs/collect.out.log",
      time: true,
    },
  ],
};
