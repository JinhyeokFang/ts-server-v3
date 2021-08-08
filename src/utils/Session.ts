import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { Application } from 'express';

const RedisStore = connectRedis(session);

export default function initialize(app: Application,
  port: number, host: string, secret: string): void {
  app.use(session({
    secret,
    store: new RedisStore({
      client: redis.createClient(port, host),
      ttl: 200,
    }),
    saveUninitialized: false,
    resave: false,
  }));
}
