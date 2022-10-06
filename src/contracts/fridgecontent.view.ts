import { Nested } from '@panenco/papi';
import { Exclude, Expose } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { FridgeView } from './fridge.view';
import { ProductView } from './product.view';

@Exclude()
export class FridgecontentView {
  
  @Expose()
  @Nested(FridgeView)
  public fridge: FridgeView;
  
  @Expose()
  @Nested(ProductView)
  public product: ProductView;

}