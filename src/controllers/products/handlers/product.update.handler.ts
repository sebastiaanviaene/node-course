import { RequestContext } from '@mikro-orm/core';
import { Forbidden, getAccessTokenData, NotFound, Unauthorized } from '@panenco/papi';
import { Request } from 'express';
import { ProductBody } from '../../../contracts/product.body';
import { Product } from '../../../entities/product.entity';

export const update = async (id: string, request: Request, body: ProductBody) => {

  const em = RequestContext.getEntityManager();
  const product = await em.findOneOrFail(Product,{id});

  if (!product) {
    throw new NotFound('productNotFound', 'Product not found');
  }

  const token = request.headers['x-auth'] as string;
  const tokenData = getAccessTokenData(token,'secretSecretStuff');
  if (product.owner !== tokenData.userId) {
    throw new Forbidden('notOwner', 'You are not the owner of this product')
  }


  product.assign(body);
  await em.flush();
  return product; 
};