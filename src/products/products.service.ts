import { Injectable } from '@nestjs/common';
// import { CreateProductDto } from './dto/create-product.dto';
// import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  // create(createProductDto: CreateProductDto) {
  //   return 'This action adds a new product';
  // }

  findAll() {
    return this.prisma.product.findMany();
  }

  async getProductById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        image: true,
        product_variant: {
          include: {
            product_variant_option: true,
          },
        },
        product_option: true,
        product_tags: true,
      },
    });

    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }

    return product;
  }

  // update(id: number, updateProductDto: UpdateProductDto) {
  //   return `This action updates a #${id} product`;
  // }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
