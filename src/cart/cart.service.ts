import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getOrCreateCart(userId: string): Promise<string> {
    try {
      const existing = await this.prisma.cart.findFirst({
        where: { userId },
      });

      if (existing) {
        return existing.id;
      }

      const created = await this.prisma.cart.create({
        data: { userId },
      });

      return created.id;
    } catch (e) {
      console.error('getOrCreateCart', e);
      return null;
    }
  }

  async getCartWithProducts(userId: string) {
    try {
      const cart = await this.prisma.cart.findUnique({
        where: { userId },
        include: {
          product: {
            select: {
              quantity: true,
              product: {
                select: {
                  id: true,
                  product: true,
                  image_url: true,
                  productSize: true,
                },
              },
            },
          },
        },
      });
      return cart;
    } catch (e) {
      console.error('getCartWithProducts', e);
      return null;
    }
  }

  async addItemToCart(userId: string, dto: AddToCartDto) {
    try {
      const cartId = await this.getOrCreateCart(userId);

      const existingItem = await this.prisma.cartToProducts.findUnique({
        where: {
          cartId_productStockInfoId: {
            cartId,
            productStockInfoId: dto.productStockInfoId,
          },
        },
      });

      if (existingItem) {
        return this.prisma.cartToProducts.update({
          where: {
            cartId_productStockInfoId: {
              cartId,
              productStockInfoId: dto.productStockInfoId,
            },
          },
          data: {
            quantity: existingItem.quantity + dto.quantity,
          },
        });
      }
      return this.prisma.cartToProducts.create({
        data: {
          cartId,
          productStockInfoId: dto.productStockInfoId,
          quantity: dto.quantity,
        },
      });
    } catch (e) {
      console.error('addItemToCart:', e);
      return null;
    }
  }
}
