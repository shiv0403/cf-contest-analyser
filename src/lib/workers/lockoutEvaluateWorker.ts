import { Worker } from "bullmq";

import { redisConnection } from "../redis";
import { evaluateLockoutWinner } from "../utils/lockout";

const worker = new Worker(
  "lockout-jobs",
  async (job) => {
    if (job.name === "evaluateWinner") {
      const { lockoutId } = job.data;
      console.log(`Evaluating winner for lockoutId: ${lockoutId}`);
      await evaluateLockoutWinner(lockoutId); // Your custom function
    }
  },
  { connection: redisConnection }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed with error:`, err);
});
