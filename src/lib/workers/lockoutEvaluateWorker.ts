import { Worker } from "bullmq";

import { evaluateLockoutWinner } from "../utils/lockout";

const redisURL = new URL(process.env.REDIS_URL || "");

const worker = new Worker(
  "lockout-jobs",
  async (job) => {
    if (job.name === "evaluateWinner") {
      const { lockoutId } = job.data;
      console.log(`Evaluating winner for lockoutId: ${lockoutId}`);
      await evaluateLockoutWinner(lockoutId); // Your custom function
    }
  },
  {
    connection: {
      family: 0,
      host: redisURL.hostname,
      port: parseInt(redisURL.port),
      username: redisURL.username,
      password: redisURL.password,
    },
  }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed with error:`, err);
});
