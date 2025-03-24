module.exports = {
  apps: [
    {
      name: "app",
      script: "./www/app.js",
      instances: 3, // 3 instances en parallèle
      exec_mode: "cluster",
      max_memory_restart: "200M",
      error_file: "./logs/err.log", // logs d'erreur
      out_file: "./logs/out.log", // logs de sortie standard
      log_file: "./logs/combined.log",
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
