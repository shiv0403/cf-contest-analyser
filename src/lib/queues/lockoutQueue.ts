import { Queue } from "bullmq";
import { getLockout } from "../utils/lockout";
import { defaultQueueConfig } from "./defaultQueueConfig";

const redisURL = new URL(process.env.REDIS_URL || "");

const lockoutQueue = new Queue("lockout-jobs", {
  connection: {
    family: 0,
    host: redisURL.hostname,
    port: parseInt(redisURL.port),
    username: redisURL.username,
    password: redisURL.password,
  },
  defaultJobOptions: defaultQueueConfig,
});

export const enqueueLockoutWinnerEval = async (lockoutId: number) => {
  const lockout = await getLockout(lockoutId);
  const runAt = lockout.endTime;
  const queueName = "evaluateWinner";

  if (!runAt) {
    throw new Error("End time of lockout is not defined");
  }

  await lockoutQueue.add(
    queueName,
    { lockoutId },
    {
      delay: runAt.getTime() - Date.now(),
      attempts: 3,
      removeOnComplete: true,
      removeOnFail: false,
    }
  );
};
