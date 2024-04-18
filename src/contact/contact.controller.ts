import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { User } from '@prisma/client';
import { Auth } from '../common/auth.decorator';
import { ContactResponse, CreateContactRequest } from '../model/contact.model';
import { ContactService } from './contact.service';
import { WebResponse } from '../model/web.model';

@Controller('/api/contacts')
export class ContactController {
  constructor(private contactService: ContactService) {}

  @Post()
  @HttpCode(200)
  async create(
    @Auth() user: User,
    @Body() request: CreateContactRequest,
  ): Promise<WebResponse<ContactResponse>> {
    const result = await this.contactService.create(user, request);

    return {
      code: 200,
      status: 'success',
      data: result,
    };
  }
}
