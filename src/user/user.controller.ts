import {
  Controller,
  Post,
  Body,
  Param,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { signJWT, verifyJWT } from '../lib/jwt';
import { compileActivationTemplate, sendMail } from '../lib/mail';
import { verificationMethod } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signup(@Body() body: CreateUserDto) {
    const { email, name, password, image, shopLink, provider, language } = body;

    const existingUser = await this.userService.getUser(email);
    if (existingUser) {
      throw new BadRequestException('Such email already exists');
    }

    const hashedPassword =
      provider === 'Email' ? await bcrypt.hash(password, 10) : undefined;

    const user = await this.userService.createUser({
      email,
      name,
      password: hashedPassword || '',
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
      const token = signJWT({ id: user.id });
      const link = `${process.env.FRONTEND_URL}/${language}/auth/activation/${token}`;
      const body = compileActivationTemplate(user.name ?? '', link);

      await sendMail({
        to: user.email,
        subject: 'Activate Your Account',
        body,
      });
      return { id: user.id, email: user.email };
    }
    return {};
  }

  @Post('login')
  async login(@Body() body: LoginUserDto) {
    const { email, password, provider } = body;

    const user = await this.userService.getUser(email);
    if (!user) throw new BadRequestException('Email is not registered');

    if (provider !== 'google') {
      if (!password && !user.password)
        throw new BadRequestException('Invalid password');

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new BadRequestException('Invalid password');
    }

    const token = signJWT({ id: user.id });
    const { password: _, ...userInfo } = user;

    return { ...userInfo, token };
  }

  @Post('verify-email/:id')
  async verifyEmail(@Param('id') token: string) {
    const payload = verifyJWT(token);
    const userId = payload?.id;

    if (!userId) throw new BadRequestException('Invalid token');

    const user = await this.userService.getUserById(userId);
    if (!user) throw new BadRequestException('User not found');

    if (user.emailVerified) {
      throw new BadRequestException('User email already verified');
    }

    await this.userService.verifyUserEmail(userId);
    return { message: 'Email verified successfully' };
  }

  @Post('get-user')
  async getUser(@Body('email') email: string) {
    const user = await this.userService.getUser(email);
    return user || {};
  }
}
