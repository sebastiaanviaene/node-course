//user.body.ts

import { Exclude, Expose } from 'class-transformer';
import { IsNumber, IsOptional, IsString} from 'class-validator';

// For safety we'll exclude everything from being transformed by placing a @Exclude() decorator on the class declaration
@Exclude()
export class ProductBody {
  @Expose()
  @IsString()
  public name: string;

  @Expose()
  @IsNumber()
  public size: number;

  @Expose()
  @IsString()
  @IsOptional()
  public owner: string;
}