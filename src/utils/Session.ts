import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { Application } from 'express';

const RedisStore = connectRedis(session);

// 반드시 세션으로 로그인 구현시 유저 정보에 ip를 함께 저장할 것.
export default function initialize(app: Application,
  port: number, host: string, secret: string): void {
  app.use(session({
    secret,
    httpOnly: true,
    secure: true,
    store: new RedisStore({
      client: redis.createClient(port, host),
      ttl: 200,
    }),
    saveUninitialized: false,
    resave: false,
    cookie: {
      httpOnly: true,
      secure: true,
    },
  }));
}
