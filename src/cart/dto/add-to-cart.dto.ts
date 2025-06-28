import { IsInt, IsString, Min } from 'class-validator';

export class AddToCartDto {
  @IsString()
  productStockInfoId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}
