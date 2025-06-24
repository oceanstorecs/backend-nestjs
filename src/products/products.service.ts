import { Injectable } from '@nestjs/common';
import { gender } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async getProducts() {
    try {
      return await this.prisma.products.findMany();
    } catch (e) {
      console.error('getProductsService', e);
      return null;
    }
  }

  async getProduct(productId: string) {
    try {
      return await this.prisma.products.findUnique({
        where: { id: productId },
        include: {
          stockInfo: {
            select: {
              hexColor: true,
              quantity: true,
              colorName: true,
              productSize: true,
            },
          },
        },
      });
    } catch (e) {
      console.error('getProductService', e);
      return null;
    }
  }

  async getProductDivision() {
    try {
      const womanProducts = await this.prisma.products.findMany({
        where: { division: gender.Women },
        take: 100,
      });

      const menProducts = await this.prisma.products.findMany({
        where: { division: gender.Men },
        take: 100,
      });

      const women = womanProducts.sort(() => Math.random() - 0.5)[0];
      const men = menProducts.sort(() => Math.random() - 0.5)[0];

      return { women, men };
    } catch (e) {
      console.error('getDivisionProductService', e);
      return null;
    }
  }

  async searchProduct(productName: string) {
    try {
      return await this.prisma.products.findMany({
        where: {
          product_name: {
            contains: productName,
            mode: 'insensitive',
          },
        },
        include: {
          stockInfo: {
            select: {
              hexColor: true,
              quantity: true,
              colorName: true,
              productSize: true,
            },
          },
        },
      });
    } catch (e) {
      console.error('getSearchProductService', e);
      return null;
    }
  }
}
