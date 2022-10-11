import { Nested } from '@panenco/papi';
import { Exclude, Expose } from 'class-transformer';
import { BaseEntityView } from './baseEntity.view';
import { FridgeView } from './fridge.view';
import { ProductView } from './product.view';

@Exclude()
export class ContentView extends BaseEntityView{
  
  @Expose()
  @Nested(FridgeView)
  public fridge: FridgeView;
  
  @Expose()
  @Nested(ProductView)
  public product: ProductView;

}