import { Queue } from "bullmq";
import { getLockout } from "../utils/lockout";
import { defaultQueueConfig } from "./defaultQueueConfig";
import { redisConnection } from "../redis";

const lockoutQueue = new Queue("lockout-jobs", {
  connection: redisConnection,
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
      // delay: runAt.getTime() - Date.now(),
      attempts: 3,
      removeOnComplete: true,
      removeOnFail: false,
    }
  );
};
