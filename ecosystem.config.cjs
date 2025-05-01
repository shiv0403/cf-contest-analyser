module.exports = {
  apps: [
    {
      name: "nextjs-app",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: process.env.PORT || 3000,
      },
    },
    {
      name: "worker",
      script: "node_modules/tsx/dist/cli.js",
      args: "./src/lib/worker.ts",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
