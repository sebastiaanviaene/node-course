import { Exclude, Expose } from 'class-transformer';
import { IsArray, IsNumber, IsString } from 'class-validator';
import v4 from 'uuid';
import { Product } from '../entities/product.entity';

@Exclude()
export class FridgeView {
  @Expose()
  @IsString()
  public id: string;
  
  @Expose()
  @IsString()
  public location: string;
  
  @Expose()
  @IsNumber()
  public capacity: number;

}