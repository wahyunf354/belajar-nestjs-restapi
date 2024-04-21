import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('UserController', () => {
  let app: INestApplication;
  let logger: Logger;
  let testService: TestService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    logger = app.get(WINSTON_MODULE_PROVIDER);
    testService = app.get(TestService);

    await app.init();
  });

  afterAll(async () => {
    await testService.deleteUser();
  });

  describe('POST /api/users', () => {
    beforeEach(async () => {
      await testService.deleteUser();
    });

    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send({
          name: '',
          username: '',
          password: '',
        });

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
      expect(response.body.data.message).toBeDefined();
    });

    it('should be success create user', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send({
          name: 'test',
          username: 'test',
          password: 'test',
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.name).toBe('test');
      expect(response.body.data.username).toBe('test');
    });

    it('should be rejected if username is already axists', async () => {
      await testService.createUser();
      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send({
          name: 'test',
          username: 'test',
          password: 'test',
        });

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
    });
  });

  describe('POST /api/users/login', () => {
    beforeEach(async () => {
      await testService.deleteUser();
      await testService.createUser();
    });

    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          name: '',
          username: '',
        });

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
      expect(response.body.data.message).toBeDefined();
    });

    it('should be success create user', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          username: 'test',
          password: 'test',
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.name).toBe('test');
      expect(response.body.data.username).toBe('test');
      expect(response.body.data.token).toBeDefined();
    });
  });

  describe('GET /api/users/current', () => {
    beforeEach(async () => {
      await testService.deleteUser();
      await testService.createUser();
    });

    it('should be rejected if token is invalid', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/users/current')
        .set({
          authorization: '',
        });

      expect(response.status).toBe(401);
      expect(response.body.status).toBe('error');
      expect(response.body.data.message).toBeDefined();
    });

    it('should be success get current user', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/users/current')
        .set({
          authorization: 'test',
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.name).toBe('test');
      expect(response.body.data.username).toBe('test');
    });
  });

  describe('PATCH /api/users/current', () => {
    beforeEach(async () => {
      await testService.deleteUser();
      await testService.createUser();
    });

    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/users/current')
        .set('authorization', 'test')
        .send({
          name: '',
          password: '',
        });

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
      expect(response.body.data.message).toBeDefined();
    });

    it('should be able success update name', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/users/current')
        .set('authorization', 'test')
        .send({
          name: 'test updated',
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.name).toBe('test updated');
      expect(response.body.data.username).toBe('test');
    });

    it('should be able success update password', async () => {
      let response = await request(app.getHttpServer())
        .patch('/api/users/current')
        .set('Authorization', 'test')
        .send({
          password: 'updated',
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.name).toBe('test');
      expect(response.body.data.username).toBe('test');

      response = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          username: 'test',
          password: 'updated',
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.name).toBe('test');
      expect(response.body.data.username).toBe('test');
      expect(response.body.data.token).toBeDefined();
    });
  });

  describe('DELETE /api/users/current', () => {
    beforeEach(async () => {
      await testService.deleteUser();
      await testService.createUser();
    });

    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .delete('/api/users/current')
        .set({
          authorization: '',
        });

      expect(response.status).toBe(401);
      expect(response.body.status).toBe('error');
      expect(response.body.data.message).toBeDefined();
    });

    it('should be success logout user', async () => {
      const response = await request(app.getHttpServer())
        .delete('/api/users/current')
        .set({
          authorization: 'test',
        });

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toBe(true);

      const user = testService.getUser();
      expect((await user).token).toBeNull();
    });
  });
});
