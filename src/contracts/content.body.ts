import { Exclude, Expose } from 'class-transformer';
import { IsString} from 'class-validator';

@Exclude()
export class ContentBody {

  @Expose()
  @IsString()
  public fridgeId: string;

  @Expose()
  @IsString()
  public productId: string;

}