//user.body.ts

import { Exclude, Expose } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

// For safety we'll exclude everything from being transformed by placing a @Exclude() decorator on the class declaration
@Exclude()
export class FridgeBody {

  @Expose()
  @IsString()
  public location: string;

  @Expose()
  @IsNumber()
  public capacity: number;

}