import { Exclude, Expose } from "class-transformer";
import { IsNumber, IsString} from "class-validator";


@Exclude()
export class AccessTokenView{
  // If we want to exclude this id property for example we can just omit it from the class or explicitly place a @Exclude() decorator on the property.
  @Expose()
  @IsString()
  public token: string;

  @Expose()
  @IsNumber()
  public expiresIn: number;

}