module.exports = {
  apps: [
    // Next.js app
    {
      name: "nextjs-app",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      cwd: ".", // Set to your Next.js app root if needed
      env: {
        NODE_ENV: "production",
        PORT: process.env.PORT || 3000,
      },
    },

    // TypeScript worker using ts-node with ESM loader
    {
      name: "worker",
      script: "./src/lib/worker.ts",
      interpreter: "node",
      interpreter_args: "--loader ts-node/esm --require tsconfig-paths/register --project tsconfig.worker.json",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
