import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsNumber, IsString } from 'class-validator';

@Exclude()
export class ProductView {
  @Expose()
  @IsString()
  public id: string;

  @Expose()
  @IsString()
  public name: string;

  @Expose()
  @IsString()
  public owner: string;

  @Expose()
  @IsNumber()
  public size: number;
}