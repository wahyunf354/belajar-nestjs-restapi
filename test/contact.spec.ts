import { INestApplication } from '@nestjs/common';
import { Logger } from 'winston';
import { TestService } from './test.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { TestModule } from './test.module';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import * as request from 'supertest';

describe('ContactController', () => {
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

  describe('POST /api/contacts', () => {
    beforeEach(async () => {
      await testService.deleteAll();
      await testService.createUserContact();
    });

    it('should be rejected if request invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/contacts')
        .set('Authorization', 'test-contact')
        .send({
          first_name: '',
          last_name: '',
          email: 'salah',
          phone: '',
        });

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
      expect(response.body.data.message).toBeDefined();
    });

    it('should be able create contact', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/contacts')
        .set('Authorization', 'test-contact')
        .send({
          first_name: 'test',
          last_name: 'test',
          email: 'test@test.com',
          phone: '99999999',
        });

      expect(response.status).toBe(200);
      expect(response.body.code).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.first_name).toBe('test');
      expect(response.body.data.last_name).toBe('test');
      expect(response.body.data.email).toBe('test@test.com');
      expect(response.body.data.phone).toBe('99999999');
    });
  });

  describe('GET /api/contacts/:contactId', () => {
    beforeEach(async () => {
      await testService.deleteAll();

      await testService.createUserContact();
      await testService.createContact();
    });

    it('should be rejected if request invalid', async () => {
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .post(`/api/contacts/${contact.id + 2}`)
        .set('Authorization', 'test-contact');

      expect(response.status).toBe(404);
      expect(response.body.status).toBe('error');
      expect(response.body.data.message).toBeDefined();
    });

    it('should be able get contact', async () => {
      const contact = await testService.getContact();
      console.log(contact);
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${contact.id}`)
        .set('Authorization', 'test-contact');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.code).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.id).toBe(contact.id);
      expect(response.body.data.first_name).toBe('test');
      expect(response.body.data.last_name).toBe('test');
      expect(response.body.data.email).toBe('test@test.com');
      expect(response.body.data.phone).toBe('99999999');
      expect(response.body.data.username).toBe(contact.username);
    });
  });

  describe('PUT /api/contacts/:contactId', () => {
    beforeEach(async () => {
      await testService.deleteAll();

      await testService.createUserContact();
      await testService.createContact();
    });

    it('should be rejected if request invalid', async () => {
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact.id}`)
        .set('Authorization', 'test-contact')
        .send({
          first_name: '',
          last_name: '',
          email: 'salah',
          phone: '',
        });

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
      expect(response.body.data.message).toBeDefined();
    });

    it('should be rejected if contact not found', async () => {
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact.id + 2}`)
        .set('Authorization', 'test-contact')
        .send({
          first_name: 'test',
          last_name: 'test',
          email: 'test@example.com',
          phone: '99999',
        });

      logger.info(response);

      expect(response.status).toBe(404);
      expect(response.body.status).toBe('error');
      expect(response.body.data.message).toBeDefined();
    });

    it('should be able update contact', async () => {
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact.id}`)
        .set('Authorization', 'test-contact')
        .send({
          first_name: 'test updated',
          last_name: 'test updated',
          email: 'testupdated@example.com',
          phone: '888888',
        });

      expect(response.status).toBe(200);
      expect(response.body.code).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.first_name).toBe('test updated');
      expect(response.body.data.last_name).toBe('test updated');
      expect(response.body.data.email).toBe('testupdated@example.com');
      expect(response.body.data.phone).toBe('888888');
      expect(response.body.data.username).toBe(contact.username);
    });
  });

  describe('DELETE /api/contacts/:contactId', () => {
    beforeEach(async () => {
      await testService.deleteContact();
      await testService.deleteUserContact();

      await testService.createUserContact();
      await testService.createContact();
    });

    it('should be rejected if request invalid', async () => {
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .delete(`/api/contacts/${contact.id + 1}`)
        .set('Authorization', 'test-contact');

      expect(response.status).toBe(404);
      expect(response.body.status).toBe('error');
      expect(response.body.data.message).toBeDefined();
    });

    it('should be able delete contact', async () => {
      const contact = await testService.getContact();
      console.log(contact);
      const response = await request(app.getHttpServer())
        .delete(`/api/contacts/${contact.id}`)
        .set('Authorization', 'test-contact');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.code).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toBe(true);
    });
  });

  describe('GET /api/contacts', () => {
    beforeEach(async () => {
      await testService.deleteAll();
      await testService.createUserContact();
      await testService.createContact();
    });

    it('should be able get contacts', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/contacts`)
        .set('Authorization', 'test-contact');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.code).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.length).toBe(1);
    });

    it('should be able get contacts with filter name', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/contacts`)
        .query({ name: 'es' })
        .set('Authorization', 'test-contact');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.code).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.length).toBe(1);
    });

    it('should be able get nothing contacts with filter name', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/contacts`)
        .query({ name: 'wrong' })
        .set('Authorization', 'test-contact');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.code).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.length).toBe(0);
    });

    it('should be able get contacts with filter email', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/contacts`)
        .query({ email: 'es' })
        .set('Authorization', 'test-contact');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.code).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.length).toBe(1);
    });

    it('should be able get nothing contacts with filter email', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/contacts`)
        .query({ email: 'wrong' })
        .set('Authorization', 'test-contact');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.code).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.length).toBe(0);
    });

    it('should be able get contacts with filter phone', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/contacts`)
        .query({ phone: '99' })
        .set('Authorization', 'test-contact');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.code).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.length).toBe(1);
    });

    it('should be able get nothing contacts with filter phone', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/contacts`)
        .query({ phone: '88' })
        .set('Authorization', 'test-contact');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.code).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.length).toBe(0);
    });

    it('should be able to search contacts with page', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/contacts`)
        .query({ size: 1, page: 2 })
        .set('Authorization', 'test-contact');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.code).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.length).toBe(0);
      expect(response.body.paging.size).toBe(1);
      expect(response.body.paging.total_page).toBe(1);
      expect(response.body.paging.current_page).toBe(2);
    });
  });
});
