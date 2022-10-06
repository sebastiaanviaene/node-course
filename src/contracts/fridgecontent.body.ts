//user.body.ts

import { Nested } from '@panenco/papi';
import { Exclude, Expose } from 'class-transformer';
import { IsNumber, IsString, ValidateNested } from 'class-validator';
import { Fridge } from '../entities/fridge.entity';
import { Product } from '../entities/product.entity';
import { FridgeBody } from './fridge.body';
import { FridgeView } from './fridge.view';
import { ProductBody } from './product.body';
import { ProductView } from './product.view';

// For safety we'll exclude everything from being transformed by placing a @Exclude() decorator on the class declaration
@Exclude()
export class FridgecontentBody {

  @Expose()
  @Nested(FridgeView)
  public fridge: FridgeView;

  @Expose()
  @Nested(ProductView)
  public product: ProductView;

}