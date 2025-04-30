import IORedis from "ioredis";

const getRedisConnection = () => {
  return new IORedis(process.env.REDIS_URL || "", {
    maxRetriesPerRequest: null,
  });
};

export const redisConnection = getRedisConnection();
