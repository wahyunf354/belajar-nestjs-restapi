import { INestApplication } from '@nestjs/common';
import { Logger } from 'winston';
import { TestService } from './test.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { TestModule } from './test.module';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import * as request from 'supertest';

describe('AddressController', () => {
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

  describe('POST /api/contacts/:contactId/addresses', () => {
    beforeEach(async () => {
      await testService.deleteAll();

      await testService.createUserContact();
      await testService.createContact();
    });

    it('should be rejected if request invalid', async () => {
      const contact = await testService.getContact();

      const response = await request(app.getHttpServer())
        .post(`/api/contacts/${contact.id}/addresses`)
        .set('Authorization', 'test-contact')
        .send({
          country: '',
          street: '',
          city: '',
          province: '',
          postal_code: '',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
      expect(response.body.data.message).toBeDefined();
    });

    it('should be rejected if request contact id', async () => {
      const contact = await testService.getContact();

      const response = await request(app.getHttpServer())
        .post(`/api/contacts/${contact.id + 1}/addresses`)
        .set('Authorization', 'test-contact')
        .send({
          country: 'negara test',
          street: 'jalan test',
          city: 'kota test',
          province: 'provinsi test',
          postal_code: '1111',
        });

      expect(response.status).toBe(404);
      expect(response.body.status).toBe('error');
      expect(response.body.data.message).toBeDefined();
    });

    it('should be able create address', async () => {
      const contact = await testService.getContact();

      const response = await request(app.getHttpServer())
        .post(`/api/contacts/${contact.id}/addresses`)
        .set('Authorization', 'test-contact')
        .send({
          country: 'negara test',
          street: 'jalan test',
          city: 'kota test',
          province: 'provinsi test',
          postal_code: '1111',
        });

      expect(response.status).toBe(200);
      expect(response.body.code).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.country).toBe('negara test');
      expect(response.body.data.street).toBe('jalan test');
      expect(response.body.data.city).toBe('kota test');
      expect(response.body.data.province).toBe('provinsi test');
      expect(response.body.data.postal_code).toBe('1111');
    });
  });

  describe('GET /api/contacts/:contactId/addresses/:addressId', () => {
    beforeEach(async () => {
      await testService.deleteAll();

      await testService.createUserContact();
      await testService.createContact();
      await testService.createAddress();
    });

    it('should be rejected if contact not found', async () => {
      const contact = await testService.getContact();
      const address = await testService.getAddress();

      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${contact.id + 1}/addresses/${address.id}`)
        .set('Authorization', 'test-contact');

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.status).toBe('error');
      expect(response.body.data.message).toBeDefined();
    });

    it('should be able get address', async () => {
      // const contact = await testService.getContact();
      const address = await testService.getAddress();

      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${address.contact_id}/addresses/${address.id}`)
        .set('Authorization', 'test-contact');

      expect(response.status).toBe(200);
      expect(response.body.code).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.country).toBe('negara test');
      expect(response.body.data.street).toBe('jalan test');
      expect(response.body.data.city).toBe('kota test');
      expect(response.body.data.province).toBe('provinsi test');
      expect(response.body.data.postal_code).toBe('1111');
    });
  });

  describe('PUT /api/contacts/:contactId/addresses/:addressId', () => {
    beforeEach(async () => {
      await testService.deleteAll();

      await testService.createUserContact();
      await testService.createContact();
      await testService.createAddress();
    });

    it('should be rejected if request invalid', async () => {
      const contact = await testService.getContact();
      const address = await testService.getAddress();

      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact.id}/addresses/${address.id}`)
        .set('Authorization', 'test-contact')
        .send({
          country: '',
          street: '',
          city: '',
          province: '',
          postal_code: '',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
      expect(response.body.data.message).toBeDefined();
    });

    it('should be rejected if contact not found', async () => {
      const contact = await testService.getContact();
      const address = await testService.getAddress();

      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact.id + 1}/addresses/${address.id}`)
        .set('Authorization', 'test-contact')
        .send({
          country: 'negara test',
          street: 'jalan test',
          city: 'kota test',
          province: 'provinsi test',
          postal_code: '1111',
        });

      expect(response.status).toBe(404);
      expect(response.body.status).toBe('error');
      expect(response.body.data.message).toBeDefined();
    });

    it('should be rejected if address not found', async () => {
      const contact = await testService.getContact();
      const address = await testService.getAddress();

      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact.id}/addresses/${address.id + 1}`)
        .set('Authorization', 'test-contact')
        .send({
          country: 'negara test',
          street: 'jalan test',
          city: 'kota test',
          province: 'provinsi test',
          postal_code: '1111',
        });

      expect(response.status).toBe(404);
      expect(response.body.status).toBe('error');
      expect(response.body.data.message).toBeDefined();
    });

    it('should be able update address', async () => {
      const contact = await testService.getContact();
      const address = await testService.getAddress();

      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact.id}/addresses/${address.id}`)
        .set('Authorization', 'test-contact')
        .send({
          country: 'negara test updated',
          street: 'jalan test updated',
          city: 'kota test updated',
          province: 'provinsi test updated',
          postal_code: '2222',
        });

      expect(response.status).toBe(200);
      expect(response.body.code).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.country).toBe('negara test updated');
      expect(response.body.data.street).toBe('jalan test updated');
      expect(response.body.data.city).toBe('kota test updated');
      expect(response.body.data.province).toBe('provinsi test updated');
      expect(response.body.data.postal_code).toBe('2222');
    });
  });

  // TODO: API Remove Address
  describe('DELETE /api/contacts/:contactId/addresses', () => {
    beforeEach(async () => {
      await testService.deleteAll();

      await testService.createUserContact();
      await testService.createContact();
      await testService.createAddress();
    });

    it('should be rejected if contact not found', async () => {
      const contact = await testService.getContact();
      const address = await testService.getAddress();

      const response = await request(app.getHttpServer())
        .delete(`/api/contacts/${contact.id + 1}/addresses/${address.id}`)
        .set('Authorization', 'test-contact');

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.status).toBe('error');
      expect(response.body.data.message).toBeDefined();
    });

    it('should be rejected if address not found', async () => {
      const contact = await testService.getContact();
      const address = await testService.getAddress();

      const response = await request(app.getHttpServer())
        .delete(`/api/contacts/${contact.id}/addresses/${address.id + 1}`)
        .set('Authorization', 'test-contact');

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.status).toBe('error');
      expect(response.body.data.message).toBeDefined();
    });

    it('should be able remove address', async () => {
      const contact = await testService.getContact();
      const address = await testService.getAddress();

      const response = await request(app.getHttpServer())
        .delete(`/api/contacts/${contact.id}/addresses/${address.id}`)
        .set('Authorization', 'test-contact');

      expect(response.status).toBe(200);
      expect(response.body.code).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toBe(true);
    });
  });

  describe('GET /api/contacts/:contactId/addresses', () => {
    beforeEach(async () => {
      await testService.deleteAll();

      await testService.createUserContact();
      await testService.createContact();
      await testService.createAddress();
    });

    it('should be rejected if contact not found', async () => {
      const contact = await testService.getContact();

      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${contact.id + 1}/addresses`)
        .set('Authorization', 'test-contact');

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.status).toBe('error');
      expect(response.body.data.message).toBeDefined();
    });

    it('should be able get address with contact id', async () => {
      // const contact = await testService.getContact();
      const address = await testService.getAddress();

      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${address.contact_id}/addresses`)
        .set('Authorization', 'test-contact');

      expect(response.status).toBe(200);
      expect(response.body.code).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].country).toBe('negara test');
      expect(response.body.data[0].street).toBe('jalan test');
      expect(response.body.data[0].city).toBe('kota test');
      expect(response.body.data[0].province).toBe('provinsi test');
      expect(response.body.data[0].postal_code).toBe('1111');
    });
  });
});
