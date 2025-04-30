module.exports = {
  apps: [
    {
      name: "cf-contest-analyser",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: process.env.PORT || 3000,
      },
    },
    {
      name: "worker",
      script: "src/lib/worker.ts",
      interpreter: "node",
      interpreter_args: "--require ts-node/register",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "256M",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
