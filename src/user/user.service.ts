import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { verificationMethod } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  async createUser({
    email,
    name,
    password,
    image,
    shopLink,
    provider = verificationMethod.Email,
  }: {
    email: string;
    name: string;
    password: string;
    image: string;
    shopLink: string;
    provider: verificationMethod;
  }) {
    try {
      const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
      return await this.prisma.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
          image,
          shopLink,
          provider,
        },
      });
    } catch (e) {
      console.error('userService -> createUser', e);
      return null;
    }
  }

  async getUser(email: string) {
    try {
      return await this.prisma.user.findUnique({
        where: { email },
      });
    } catch (e) {
      console.error('userService -> getUser', e);
      return null;
    }
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

  async verifyUserEmail(userId: string) {
    try {
      return await this.prisma.user.update({
        where: { id: userId },
        data: { emailVerified: new Date() },
      });
    } catch (e) {
      console.error('userService -> verifyUserEmail', e);
      return null;
    }
  }
}
