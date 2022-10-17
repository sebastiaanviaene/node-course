import { RequestContext } from '@mikro-orm/core';
import { ProductBody } from '../../../contracts/product.body';
import { Product } from '../../../entities/product.entity';

export const updateProduct = async (productId: string, body: ProductBody) => {

  const em = RequestContext.getEntityManager();
  const product = await em.findOneOrFail(Product,{id: productId});
  product.assign(body);
  await em.flush();
  return product; 
};