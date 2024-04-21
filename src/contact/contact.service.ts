import { HttpException, Inject, Injectable } from '@nestjs/common';
import { Contact, User } from '@prisma/client';
import { PrismaService } from '../common/prisma.service';
import {
  ContactResponse,
  CreateContactRequest,
  SearchContactRequest,
  UpdateContactRequest,
} from '../model/contact.model';
import { ContactValidation } from './contact.validation';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ValidationService } from '../common/validation.service';
import { WebResponse } from 'src/model/web.model';

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

    return this.toContactResponse(result);
  }

  toContactResponse(contact: Contact): ContactResponse {
    return {
      id: contact.id,
      first_name: contact.first_name,
      last_name: contact.last_name,
      email: contact.email,
      phone: contact.phone,
      username: contact.username,
    };
  }

  async checkContactIsAxist(
    contactId: number,
    username: string,
  ): Promise<Contact> {
    const result = await this.prismaService.contact.findFirst({
      where: {
        id: contactId,
        username: username,
      },
    });

    if (!result) {
      throw new HttpException('Contact is not found', 404);
    }
    return result;
  }

  async get(user: User, contactId: number): Promise<ContactResponse> {
    const result = await this.checkContactIsAxist(contactId, user.username);

    return this.toContactResponse(result);
  }

  async update(
    user: User,
    request: UpdateContactRequest,
  ): Promise<ContactResponse> {
    const updateContactRequest = this.validationService.validate(
      ContactValidation.UPDATE,
      request,
    );

    let result = await this.checkContactIsAxist(
      updateContactRequest.id,
      user.username,
    );

    result = await this.prismaService.contact.update({
      where: {
        id: updateContactRequest.id,
        username: user.username,
      },
      data: updateContactRequest,
    });

    return result;
  }

  async remove(user: User, contactId: number): Promise<ContactResponse> {
    await this.checkContactIsAxist(contactId, user.username);

    const result = await this.prismaService.contact.delete({
      where: {
        id: contactId,
        username: user.username,
      },
    });

    return this.toContactResponse(result);
  }

  async search(
    user: User,
    request: SearchContactRequest,
  ): Promise<WebResponse<ContactResponse[]>> {
    const contactRequest = this.validationService.validate(
      ContactValidation.SEARCH,
      request,
    );

    const filters = [];

    if (contactRequest.name) {
      filters.push({
        OR: [
          {
            first_name: {
              contains: contactRequest.name,
            },
          },
          {
            last_name: {
              contains: contactRequest.name,
            },
          },
        ],
      });
    }

    if (contactRequest.email) {
      filters.push({
        OR: [
          {
            email: {
              contains: contactRequest.email,
            },
          },
        ],
      });
    }

    if (contactRequest.phone) {
      filters.push({
        OR: [
          {
            phone: {
              contains: contactRequest.phone,
            },
          },
        ],
      });
    }

    console.info(contactRequest);

    const skip = (request.page - 1) * request.size;

    const contacts = await this.prismaService.contact.findMany({
      where: {
        username: user.username,
        AND: filters,
      },
      take: request.size,
      skip: skip,
    });

    const total = await this.prismaService.contact.count({
      where: {
        username: user.username,
        AND: filters,
      },
    });

    return {
      code: 200,
      status: 'success',
      data: contacts.map((contact) => this.toContactResponse(contact)),
      paging: {
        size: request.size,
        current_page: request.page,
        total_page: total,
      },
    };
  }
}
