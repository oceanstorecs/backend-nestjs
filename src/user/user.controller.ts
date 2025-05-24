import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  Param,
  HttpStatus,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { signJWT, verifyJWT } from '../lib/jwt';
import { compileActivationTemplate, sendMail } from '../lib/mail';
import { verificationMethod } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signup(@Body() body: any, @Res() res: Response) {
    const { email, name, password, image, shopLink, provider, language } = body;

    const existingUser = await this.userService.getUser(email);
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }
    const user = await this.userService.createUser({
      email,
      name,
      password,
      image,
      shopLink,
      provider:
        provider === 'google'
          ? verificationMethod.Google
          : provider === 'apple'
            ? verificationMethod.Apple
            : verificationMethod.Email,
    });

    if (!user) {
      throw new InternalServerErrorException('User creation failed');
    }

    if (user.provider === verificationMethod.Email) {
      const jwtUserId = signJWT({ id: user.id });
      const activationLink = `${process.env.FRONTEND_URL}/activate/${jwtUserId}`;
      const emailContent = compileActivationTemplate(
        user.name ?? '',
        activationLink,
      );

      await sendMail({
        to: user.email,
        subject: 'Activate your account',
        body: emailContent,
      });
      return res.status(HttpStatus.OK).json({ id: user.id, email: user.email });
    }
    return res.status(HttpStatus.OK).json({});
  }
}
