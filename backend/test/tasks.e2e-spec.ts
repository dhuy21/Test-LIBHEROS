import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Tasks (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let listId: number;
  let taskId: number;
  const testEmail = `tasks-${Date.now()}@e2e.com`;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    await app.init();

    // Créer un user et une liste pour les tests
    const userRes = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        firstName: 'Task',
        lastName: 'Tester',
        email: testEmail,
        password: 'password123',
      });
    token = userRes.body.accessToken;

    const listRes = await request(app.getHttpServer())
      .post('/task-lists')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Test List' });
    listId = listRes.body.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /task-lists/:id/tasks → 201', () => {
    return request(app.getHttpServer())
      .post(`/task-lists/${listId}/tasks`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        shortDescription: 'Acheter du pain',
        dueDate: '2026-04-01',
        longDescription: 'Baguette tradition',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.shortDescription).toBe('Acheter du pain');
        taskId = res.body.id;
      });
  });

  it('GET /task-lists/:id/tasks → retourne les tâches', () => {
    return request(app.getHttpServer())
      .get(`/task-lists/${listId}/tasks`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.length).toBe(1);
        expect(res.body[0].shortDescription).toBe('Acheter du pain');
      });
  });

  it('GET /tasks/:id → détail avec createdAt', () => {
    return request(app.getHttpServer())
      .get(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.createdAt).toBeDefined();
        expect(res.body.longDescription).toBe('Baguette tradition');
      });
  });

  it('PATCH /tasks/:id → toggle completed', () => {
    return request(app.getHttpServer())
      .patch(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ isCompleted: true })
      .expect(200)
      .expect((res) => {
        expect(res.body.isCompleted).toBe(true);
      });
  });

  it('PATCH /tasks/:id → toggle back to active', () => {
    return request(app.getHttpServer())
      .patch(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ isCompleted: false })
      .expect(200)
      .expect((res) => {
        expect(res.body.isCompleted).toBe(false);
      });
  });

  it('DELETE /tasks/:id → supprimé', () => {
    return request(app.getHttpServer())
      .delete(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('DELETE /task-lists/:id → cascade supprime les tâches', async () => {
    // Créer une tâche dans la liste
    await request(app.getHttpServer())
      .post(`/task-lists/${listId}/tasks`)
      .set('Authorization', `Bearer ${token}`)
      .send({ shortDescription: 'Tâche temp', dueDate: '2026-04-05' });

    // Supprimer la liste
    await request(app.getHttpServer())
      .delete(`/task-lists/${listId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    // Vérifier que la liste n'existe plus
    return request(app.getHttpServer())
      .get(`/task-lists/${listId}/tasks`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404);
  });
});
