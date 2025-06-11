import { rateLimit } from "express-rate-limit";

// By default, It will use the IP address of the request as the key for rate limiting.
export const shortenLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
import dotenv from "dotenv";
import { createClient } from "redis";
dotenv.config();

class RedisClient {
  constructor(HOST, PORT, PASSWORD) {
    this.client = createClient({
      username: "default",
      password: PASSWORD,
      socket: {
        host: HOST,
        port: PORT,
      },
    });
    this.client.on("connect", () => {
      console.log("Connected to Redis");
    });
    this.client.on("ready", () => {
      console.log("Redis is ready");
    });
    this.client.on("end", () => {
      console.log("Redis connection closed");
    });
    this.client.on("error", (err) => {
      console.log("Redis Client Error", err);
    });
  }
}

// await client.set('foo', 'bar');
// const result = await client.get('foo');
// console.log(result)  // >>> bar
const redisA = new RedisClient(
  process.env.REDIS_HOST1,
  process.env.REDIS_PORT1,
  process.env.REDIS_PASSWORD1
).client;

const redisB = new RedisClient(
  process.env.REDIS_HOST2,
  process.env.REDIS_PORT2,
  process.env.REDIS_PASSWORD2
).client;

export { redisA, redisB };