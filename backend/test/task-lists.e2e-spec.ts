import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('TaskLists (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let listId: number;
  const testEmail = `lists-${Date.now()}@e2e.com`;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    await app.init();

    // Créer un user et récupérer le token
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        firstName: 'List',
        lastName: 'Tester',
        email: testEmail,
        password: 'password123',
      });
    token = res.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /task-lists → 201', () => {
    return request(app.getHttpServer())
      .post('/task-lists')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Courses' })
      .expect(201)
      .expect((res) => {
        expect(res.body.name).toBe('Courses');
        listId = res.body.id;
      });
  });

  it('POST /task-lists même nom → 409', () => {
    return request(app.getHttpServer())
      .post('/task-lists')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Courses' })
      .expect(409);
  });

  it('GET /task-lists → retourne les listes', () => {
    return request(app.getHttpServer())
      .get('/task-lists')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.length).toBeGreaterThanOrEqual(1);
        expect(res.body[0].name).toBe('Courses');
      });
  });

  it('DELETE /task-lists/:id → supprimé', () => {
    return request(app.getHttpServer())
      .delete(`/task-lists/${listId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('GET /task-lists après delete → liste vide', () => {
    return request(app.getHttpServer())
      .get('/task-lists')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.length).toBe(0);
      });
  });
});
