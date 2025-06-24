import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Response } from 'express';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getProducts(@Res() res: Response) {
    const products = await this.productsService.getProducts();

    if (!products) {
      return res.status(HttpStatus.BAD_REQUEST).send('No products found');
    }
    return res.status(HttpStatus.OK).json(products);
  }

  @Get(':id')
  async getProduct(@Param('id') id: string, @Res() res: Response) {
    const product = await this.productsService.getProduct(id);

    if (!product) {
      return res.status(HttpStatus.BAD_REQUEST).send('No product found');
    }
    return res.status(HttpStatus.OK).json(product);
  }

  @Post('division')
  async getProductDivision(@Res() res: Response) {
    const products = await this.productsService.getProductDivision();

    if (!products) {
      return res.status(HttpStatus.BAD_REQUEST).send('No products found');
    }
    return res.status(HttpStatus.OK).json('products');
  }

  @Post('search')
  async searchProduct(@Body('name') name: string, @Res() res: Response) {
    const products = await this.productsService.searchProduct(name);

    if (!products) {
      return res.status(HttpStatus.BAD_REQUEST).send('No products found');
    }
    return res.status(HttpStatus.OK).json('products');
  }
}
