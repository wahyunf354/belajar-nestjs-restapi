import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { Auth } from '../common/auth.decorator';
import {
  ContactResponse,
  CreateContactRequest,
  SearchContactRequest,
  UpdateContactRequest,
} from '../model/contact.model';
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

  @Get('/:contactId')
  @HttpCode(200)
  async get(
    @Auth() user: User,
    @Param('contactId', ParseIntPipe) contactId: number,
  ) {
    const result = await this.contactService.get(user, contactId);

    return {
      code: 200,
      status: 'success',
      data: result,
    };
  }

  @Put('/:contactId')
  @HttpCode(200)
  async update(
    @Auth() user: User,
    @Param('contactId', ParseIntPipe) contactId: number,
    @Body() request: UpdateContactRequest,
  ): Promise<WebResponse<ContactResponse>> {
    request.id = contactId;

    const result = await this.contactService.update(user, request);

    return {
      code: 200,
      status: 'success',
      data: result,
    };
  }

  @Delete('/:contactId')
  @HttpCode(200)
  async remove(
    @Auth() user: User,
    @Param('contactId', ParseIntPipe) contactId: number,
  ): Promise<WebResponse<boolean>> {
    await this.contactService.remove(user, contactId);

    return {
      code: 200,
      status: 'success',
      data: true,
    };
  }

  @Get()
  @HttpCode(200)
  async search(
    @Auth() user: User,
    @Query('name') name: string,
    @Query('email') email: string,
    @Query('phone') phone: string,
    @Query('size', new ParseIntPipe({ optional: true })) size: number,
    @Query('page', new ParseIntPipe({ optional: true })) page: number,
  ) {
    const requestSearch: SearchContactRequest = {
      name: name,
      email: email,
      phone: phone,
      size: size || 10,
      page: page || 1,
    };
    return this.contactService.search(user, requestSearch);
  }
}
