import { Exclude, Expose } from 'class-transformer';
import { IsNumber, IsOptional, IsString} from 'class-validator';
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