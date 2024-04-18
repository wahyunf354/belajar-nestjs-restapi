import { Inject, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../common/prisma.service';
import { ContactResponse, CreateContactRequest } from '../model/contact.model';
import { ContactValidation } from './contact.validation';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ValidationService } from '../common/validation.service';

@Injectable()
export class ContactService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) {}

  async create(
    user: User,
    request: CreateContactRequest,
  ): Promise<ContactResponse> {
    const contactRequest = await this.validationService.validate(
      ContactValidation.CREATE,
      request,
    );

    contactRequest.username = user.username;

    const result = await this.prismaService.contact.create({
      data: contactRequest,
    });

    return {
      id: result.id,
      first_name: result.first_name,
      last_name: result.last_name,
      email: result.email,
      phone: result.phone,
    };
  }
}
