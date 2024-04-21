import { Injectable } from '@nestjs/common';
import { PrismaService } from '../src/common/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TestService {
  constructor(private prismaService: PrismaService) {}

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
}
