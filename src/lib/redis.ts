import IORedis from "ioredis";

const getRedisConnection = () => {
  let redisUrl = process.env.REDIS_URL || "";
  redisUrl += "?family=0";
  return new IORedis(redisUrl, {
    maxRetriesPerRequest: null,
  });
};

export const redisConnection = getRedisConnection();
