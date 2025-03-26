import Redis from "ioredis";
import { REDIS_PORT, REDIS_TLS } from "../utitls/constant";
let redis;
// if (typeof window === "undefined") {
redis = new Redis({
  host: process.env.REDIS_HOST, // Redis host
  port: REDIS_PORT, // Redis port
  tls: REDIS_TLS === "true" ? {} : null, // Optional, for secure connections
});
// }

redis.on("connect", () => {
  console.log("connected to Redis");
});

export async function setItem(key, value, expiry) {
  try {
    if (expiry) {
      await redis.setItem(key, value, "EX", expiry);
    } else {
      await redis.setItem(key, value);
    }
    console.log(`Item set in Redis: ${key}`);
  } catch (err) {
    console.error("Error setting item in Redis:", err);
  }
}

export async function getItem(key) {
  try {
    const value = await redis.get(key);
    console.log(`Value retrieved for ${key}: ${value}`);
    return value;
  } catch (err) {
    console.error("Error getting item from Redis:", err);
    return null;
  }
}

export async function deleteItem(key) {
  try {
    await redis.del(key);
    console.log(`Item deleted from Redis: ${key}`);
  } catch (err) {
    console.error("Error deleting item from Redis:", err);
  }
}

export default redis;
