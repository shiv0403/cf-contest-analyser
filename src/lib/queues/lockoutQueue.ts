// lib/queue.js
import { Queue } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis(process.env.REDIS_URL || "");

export const lockoutQueue = new Queue("lockout-jobs", { connection });
