import { IsInt, Min } from 'class-validator';

export class UpdateQuantityDTO {
  @IsInt()
  @Min(1)
  quantity: number;
}
