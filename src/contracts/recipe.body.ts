import { Exclude, Expose } from 'class-transformer';
import { IsArray, IsEmail, IsString, Length } from 'class-validator';

// For safety we'll exclude everything from being transformed by placing a @Exclude() decorator on the class declaration
@Exclude()
export class RecipeBody {
  // We can expose the properties we want included one by one
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