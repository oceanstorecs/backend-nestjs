import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/user.dto';
// import { hash } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const customer = await this.prisma.customer.findUnique({
      where: { email: dto.email },
    });

    if (customer)
      throw new ConflictException('User with this email already exists');

    // const newCustomer = await this.prisma.customer.create({
    //   data: {
    //     ...dto,

    //   }
    // })
  }
}
