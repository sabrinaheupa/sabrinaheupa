// PM2 — App de Hipnose Coletiva. Em dev: `node server.js`.
module.exports = {
  apps: [
    {
      name: "audio-motivacao-webapp",
      script: "server.js",
      cwd: __dirname,
      instances: 1,
      autorestart: true,
      max_memory_restart: "600M",
      env: { NODE_ENV: "production", PORT: "7791" },
      out_file: "./logs/pm2-out.log",
      error_file: "./logs/pm2-err.log",
      time: true,
    },
  ],
};
