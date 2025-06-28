import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@Req() req) {
    return this.cartService.getCartWithProducts(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async addCartItem(@Req() req, @Body() dto: AddToCartDto) {
    return this.cartService.addItemToCart(req.user.id, dto);
  }
}
