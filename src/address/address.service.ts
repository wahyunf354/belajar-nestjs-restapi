import { HttpException, Inject, Injectable } from '@nestjs/common';
import { Address, User } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import {
  AddressResponse,
  CreateAddressRequest,
  GetAddressRequest,
  RemoveAddressRequest,
  UpdateAddressRequest,
} from '../model/address.model';
import { Logger } from 'winston';
import { AddressValidation } from './address.validation';
import { ContactService } from '../contact/contact.service';

@Injectable()
export class AddressService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) logger: Logger,
    private validationService: ValidationService,
    private prismaService: PrismaService,
    private contactService: ContactService,
  ) {}

  async toAddressResponse(address: Address): Promise<AddressResponse> {
    return {
      id: address.id,
      contact_id: address.contact_id,
      country: address.country,
      street: address.street,
      city: address.city,
      province: address.province,
      postal_code: address.postal_code,
    };
  }

  async chectAddressMustBeAxist(
    addressId: number,
    contactId: number,
  ): Promise<Address> {
    const address = await this.prismaService.address.findFirst({
      where: {
        id: addressId,
        contact_id: contactId,
      },
    });

    if (!address) {
      throw new HttpException('Address is not found', 404);
    }

    return address;
  }

  async create(
    user: User,
    request: CreateAddressRequest,
  ): Promise<AddressResponse> {
    const createAddressRequest = await this.validationService.validate(
      AddressValidation.CREATE,
      request,
    );

    await this.contactService.checkContactIsAxist(
      createAddressRequest.contact_id,
      user.username,
    );

    const address = await this.prismaService.address.create({
      data: createAddressRequest,
    });

    return this.toAddressResponse(address);
  }

  async get(user: User, request: GetAddressRequest): Promise<AddressResponse> {
    const getRequest = await this.validationService.validate(
      AddressValidation.GET,
      request,
    );

    await this.contactService.checkContactIsAxist(
      getRequest.contact_id,
      user.username,
    );

    const address = await this.chectAddressMustBeAxist(
      getRequest.address_id,
      getRequest.contact_id,
    );

    return this.toAddressResponse(address);
  }

  async update(
    user: User,
    request: UpdateAddressRequest,
  ): Promise<AddressResponse> {
    const updateAddressRequest = await this.validationService.validate(
      AddressValidation.UPDATE,
      request,
    );

    await this.contactService.checkContactIsAxist(
      updateAddressRequest.contact_id,
      user.username,
    );

    await this.chectAddressMustBeAxist(
      updateAddressRequest.id,
      updateAddressRequest.contact_id,
    );

    const address: Address = await this.prismaService.address.update({
      where: {
        contact_id: updateAddressRequest.contact_id,
        id: updateAddressRequest.id,
      },
      data: updateAddressRequest,
    });

    return this.toAddressResponse(address);
  }

  async remove(
    user: User,
    request: RemoveAddressRequest,
  ): Promise<AddressResponse> {
    const removeReq = await this.validationService.validate(
      AddressValidation.REMOVE,
      request,
    );

    await this.contactService.checkContactIsAxist(
      removeReq.contact_id,
      user.username,
    );

    await this.chectAddressMustBeAxist(
      removeReq.address_id,
      removeReq.contact_id,
    );

    const result = await this.prismaService.address.delete({
      where: {
        id: removeReq.address_id,
        contact_id: removeReq.contact_id,
      },
    });

    return result;
  }

  async list(user: User, contactId: number): Promise<AddressResponse[]> {
    await this.contactService.checkContactIsAxist(contactId, user.username);

    const listAddress = await this.prismaService.address.findMany({
      where: {
        contact_id: contactId,
      },
    });

    return listAddress;
  }
}
