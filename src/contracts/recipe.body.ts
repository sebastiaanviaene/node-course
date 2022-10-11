import { Exclude, Expose } from 'class-transformer';
import { IsString } from 'class-validator';
@Exclude()
export class RecipeBody {
  @Expose()
  @IsString()
  public name: string;

  @Expose()
  @IsString()
  public description: string;

  @Expose()
  @IsString()
  public ingredients: string;
}