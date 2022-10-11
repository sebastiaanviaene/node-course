
import { RequestContext } from "@mikro-orm/core";
import { EntityManager } from "@mikro-orm/postgresql";
import { Forbidden, getAccessTokenData, NotFound, Unauthorized } from "@panenco/papi";
import { Request } from 'express';
import { ContentBody } from "../../../contracts/content.body";
import { Fridge } from "../../../entities/fridge.entity";
import { Content } from "../../../entities/content.entity";
import { Product } from "../../../entities/product.entity";


export const create = async (body: ContentBody, request: Request) => {

  const em: EntityManager = RequestContext.getEntityManager() as EntityManager; 
  const fridge = await getFridge(em, body.fridgeId)
  const prod = await getProduct(em, body.productId)

  //checking if user is owner of the product
  const token = request.headers['x-auth'] as string;
  const tokenData = getAccessTokenData(token,  'secretSecretStuff');
  if (prod.owner !== tokenData.userId) {
    throw new Unauthorized('notOwner', 'You are not the owner of this product')
  }

  //checking if product is already stored in a fridge
  if (await contentStored(em, prod.id)) {
    throw new Forbidden('alreadyStored', 'Product is already stored in a fridge')
  }

  //checking if fridge has enough space left
  const fridgeSpace = await getFridgeSpace(em, fridge);
  if (fridgeSpace < prod.size) {
      throw new Forbidden('overCapacity', 'Not enough capacity left in fridge to store product');
  }
  
  const contentBody = {
    "fridge" : fridge,
    "product" : prod
  }
  const newContent = em.create(Content, contentBody);
  await em.persistAndFlush(newContent);
  return newContent;
};

const getFridge = (em: EntityManager,fridgeId: string): Promise<Fridge> => {
  return em.findOneOrFail(Fridge, {id: fridgeId});
}

const getProduct = (em: EntityManager, productId: string): Promise<Product> => {
  return em.findOneOrFail(Product, {id: productId});
}

const contentStored = async (em: EntityManager, productId: string): Promise<boolean> => {
  const content = await em.findOne(Content, {product : productId});
  return !!content;
}

const getFridgeSpace = async (em: EntityManager, fridge: Fridge): Promise<number> => {

  const qb: {sum: number} = await em.createQueryBuilder(Content,'c')
    .select('sum(p.size)')
    .join('c.product', 'p')
    .where({fridge:fridge.id})
    .execute("get")
  return fridge.capacity-qb.sum;
}

