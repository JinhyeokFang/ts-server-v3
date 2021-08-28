import request from 'supertest';

import DB from '../src/db';
import JWT from '../src/modules/JWT';
import Crypto from '../src/modules/Crypto';
import Server from '../src/server';

const server = new Server(8080).rawServer;

describe('GET /', () => {
  beforeAll(() => {
    console.log(`
MongoDB를 켜주어야 서버가 동작합니다.
테스트 할 때는 반드시 로컬에 27017포트로 MongoDB 서버를 열어주세요.
    `);

    Crypto.setKey('dev');
    JWT.setKey('dev');
    DB.initialize('dev', 27017);
  });

  it('WRONG', async () => {
    const result = await request(server).get('/');
    expect(result.statusCode).toEqual(200);
  });

  it('RIGHT', async () => {
    const result = await request(server).get('/');
    expect(result.statusCode).toEqual(404);
  });
});
