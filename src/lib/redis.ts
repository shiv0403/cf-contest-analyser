import IORedis from "ioredis";

const getRedisConnection = () => {
  if (process.env.NODE_ENV === "production") {
    // Production (Upstash)
    return new IORedis(process.env.UPSTASH_REDIS_REST_URL || "", {
      maxRetriesPerRequest: null,
    });
  }

  // Development (Local Redis)
  return new IORedis(process.env.REDIS_URL || "redis://localhost:6379", {
    maxRetriesPerRequest: null,
  });
};

export const redisConnection = getRedisConnection();
