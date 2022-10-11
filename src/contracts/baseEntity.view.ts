import { Exclude, Expose } from "class-transformer";
import { IsDate, IsString } from "class-validator";

@Exclude()
export class BaseEntityView {
  @Expose()
  @IsString()
  public id: string;
  
  @Expose()
  @IsDate()
  public createdAt: Date
  
  @Expose()
  @IsDate()
  public updatedAt: Date

}