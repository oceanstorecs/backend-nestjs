import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { CartModule } from './cart/cart.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [UserModule, CartModule, ProductsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
