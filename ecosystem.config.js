const config = {
  apps: [
    {
      name: "cf-contest-analyser",
      script: "node_modules/next/dist/bin/next",
      args: "start -p $PORT",
      env: {
        NODE_ENV: "production",
        PORT: process.env.PORT || 3000,
      },
    },
    {
      name: "worker",
      script: "src/lib/worker.ts",
      interpreter: "node",
      interpreter_args: "--loader tsx",
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

export default config;
