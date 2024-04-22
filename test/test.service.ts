import { Injectable } from '@nestjs/common';
import { PrismaService } from '../src/common/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TestService {
  constructor(private prismaService: PrismaService) {}

  async createAddress() {
    const contact = await this.getContact();

    await this.prismaService.address.create({
      data: {
        contact_id: contact.id,
        street: 'jalan test',
        city: 'kota test',
        province: 'provinsi test',
        country: 'negara test',
        postal_code: '1111',
      },
    });
  }

  async getAddress() {
    return await this.prismaService.address.findFirst({
      where: {
        contact: {
          username: 'test-contact',
        },
      },
    });
  }

  async deleteAll() {
    await this.deleteAddress();
    await this.deleteContact();
    await this.deleteUserContact();
    await this.deleteUser();
  }

  async deleteUser() {
    await this.prismaService.user.deleteMany({
      where: {
        username: 'test',
      },
    });
  }

  async getUser() {
    return await this.prismaService.user.findUnique({
      where: {
        username: 'test',
      },
    });
  }

  async createUser() {
    await this.prismaService.user.create({
      data: {
        username: 'test',
        name: 'test',
        password: await bcrypt.hash('test', 10),
        token: 'test',
      },
    });
  }

  async createUserContact() {
    await this.prismaService.user.create({
      data: {
        username: 'test-contact',
        name: 'test',
        password: await bcrypt.hash('test', 10),
        token: 'test-contact',
      },
    });
  }

  async deleteUserContact() {
    await this.prismaService.user.deleteMany({
      where: {
        username: 'test-contact',
      },
    });
  }

  async deleteContact() {
    await this.prismaService.contact.deleteMany({
      where: {
        username: 'test-contact',
      },
    });
    await this.prismaService.contact.deleteMany({
      where: {
        username: 'test',
      },
    });
  }

  async createContact() {
    await this.prismaService.contact.create({
      data: {
        first_name: 'test',
        last_name: 'test',
        email: 'test@test.com',
        phone: '99999999',
        username: 'test-contact',
      },
    });
  }

  async getContact() {
    return await this.prismaService.contact.findFirst({
      where: {
        username: 'test-contact',
      },
    });
  }

  async deleteAddress() {
    await this.prismaService.address.deleteMany({
      where: {
        contact: {
          username: 'test-contact',
        },
      },
    });
  }
}
