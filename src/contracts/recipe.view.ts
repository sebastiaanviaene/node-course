import { Exclude, Expose } from 'class-transformer';
import { IsArray, IsNumber, IsString } from 'class-validator';

@Exclude()
export class RecipeView {
  // If we want to exclude this id property for example we can just omit it from the class or explicitly place a @Exclude() decorator on the property.
  @Expose()
  @IsNumber()
  public id: number;

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