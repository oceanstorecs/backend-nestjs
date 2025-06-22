import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { verificationMethod } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUser(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async getUserById(userId: string) {
    try {
      return await this.prisma.user.findUnique({
        where: { id: userId },
      });
    } catch (e) {
      console.error('userService -> getUserById', e);
      return null;
    }
  }

  async createUser(data: {
    email: string;
    name: string;
    password: string;
    image?: string;
    shopLink?: string;
    provider: verificationMethod;
  }) {
    return this.prisma.user.create({ data });
  }

  async verifyUserEmail(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { emailVerified: new Date() },
    });
  }
}
