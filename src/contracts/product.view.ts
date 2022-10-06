import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsNumber, IsString } from 'class-validator';
import v4 from 'uuid';

@Exclude()
export class ProductView {
  // If we want to exclude this id property for example we can just omit it from the class or explicitly place a @Exclude() decorator on the property.
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