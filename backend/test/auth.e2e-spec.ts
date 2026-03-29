import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  const testEmail = `test-${Date.now()}@e2e.com`;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /auth/register → 201 avec accessToken', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        firstName: 'Test',
        lastName: 'User',
        email: testEmail,
        password: 'password123',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.accessToken).toBeDefined();
        expect(res.body.user.email).toBe(testEmail);
      });
  });

  it('POST /auth/register même email → 409', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        firstName: 'Test',
        lastName: 'Doublon',
        email: testEmail,
        password: 'password123',
      })
      .expect(409);
  });

  it('POST /auth/login correct → 200 avec accessToken', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: testEmail, password: 'password123' })
      .expect(200)
      .expect((res) => {
        expect(res.body.accessToken).toBeDefined();
        expect(res.body.user.firstName).toBe('Test');
      });
  });

  it('POST /auth/login mauvais password → 401', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: testEmail, password: 'wrong' })
      .expect(401);
  });

  it('GET /task-lists sans token → 401', () => {
    return request(app.getHttpServer())
      .get('/task-lists')
      .expect(401);
  });
});
