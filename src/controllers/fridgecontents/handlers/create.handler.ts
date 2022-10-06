
import { RequestContext } from "@mikro-orm/core";
import { EntityManager } from "@mikro-orm/postgresql";
import { Forbidden, getAccessTokenData, NotFound, Unauthorized } from "@panenco/papi";
import { Request } from 'express';
import { FridgecontentBody } from "../../../contracts/fridgecontent.body";
import { Fridge } from "../../../entities/fridge.entity";
import { Fridgecontent } from "../../../entities/fridgecontent.entity";
import { Product } from "../../../entities/product.entity";


export const create = async (body: FridgecontentBody, request: Request) => {
   
  const em: EntityManager = RequestContext.getEntityManager() as EntityManager;
  //checking if fridge exists
  const fridge = await em.findOneOrFail(Fridge, {id: body.fridge.id});
  if (!fridge) {
    throw new NotFound('fridgeNotFound', 'Fridge does not exist');
  }
  const fridgeCapacity = fridge.capacity;

  //checking if product exists
  const prod = await em.findOne(Product, {id: body.product.id});
  if (!prod) {
    throw new NotFound('productNotFound', 'Product does not exist');
  }
  const prodSize = prod.size;

  //checking if user is owner of the product

  const token = request.headers['x-auth'] as string;
  const tokenData = getAccessTokenData(token,  'secretSecretStuff');
  if (prod.owner !== tokenData.userId) {
    throw new Unauthorized('notOwner', 'You are not the owner of this product')
  }

  //checking if product is already stored in a fridge
  const content = await em.findOne(Fridgecontent, {product : prod.id});
  if (content) {
    throw new Forbidden('alreadyStored', 'Product is already stored in a fridge')
  }

  //calculating how much space is left in the fridge
  const qb = await em.createQueryBuilder(Fridgecontent, 'fc')
  .select('sum(p.size)')
  .join('fc.product','p')
  .where({fridge: {id: fridge.id}})
  .execute()

  const [contents, count] = await em.findAndCount(Fridgecontent, {fridge: fridge.id});
  const prods = contents.map((x) => x.product.id)
  const sizes = []
  for (const id of prods){
      const prod = await em.findOneOrFail(Product, id);
      if (!prod) {
        throw new NotFound('productNotFound', 'Product not found')
      }
      sizes.push(prod.size)
  }
  const usage = sizes.reduce((a,b) => a + b, 0)
  //const newUsage = usage + prod.size;
  if (usage+prod.size > fridge.capacity) {
      throw new Forbidden('overCapacity', 'Not enough capacity left in fridge to store product');
  }
  
  const contentBody = {
    "fridge" : fridge,
    "product" : prod
  }
  const fridgecontent = em.create(Fridgecontent, contentBody);
  await em.persistAndFlush(fridgecontent);
  

  return fridgecontent;
};

