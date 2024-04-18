import { INestApplication } from '@nestjs/common';
import { Logger } from 'winston';
import { TestService } from './test.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { TestModule } from './test.module';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import * as request from 'supertest';

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

  describe('POST /api/contacts', () => {
    beforeEach(async () => {
      await testService.deleteContact();
      await testService.deleteUser();
    });

    it('should be rejected if request invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/contacts')
        .set('Authorization', 'test')
        .send({
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
        });

      logger.info(response.body);
      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
      expect(response.body.data.message).toBeDefined();
    });
  });
});
