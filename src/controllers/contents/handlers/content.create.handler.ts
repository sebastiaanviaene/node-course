
import { RequestContext } from "@mikro-orm/core";
import { EntityManager } from "@mikro-orm/postgresql";
import { BadRequest } from "@panenco/papi";
import { ContentBody } from "../../../contracts/content.body";
import { Fridge, Content, Product } from "../../../entities/entityIndex";


export const createContent = async (body: ContentBody) => {

  const em: EntityManager = RequestContext.getEntityManager() as EntityManager; 
  const fridge = await getFridge(em, body.fridgeId)
  const product = await getProduct(em, body.productId)

  //checking if product is already stored in a fridge
  if (await contentStored(em, product.id)) {
    throw new BadRequest('alreadyStored', 'Product is already stored in a fridge')
  }

  //checking if fridge has enough space left
  const fridgeSpace = await getFridgeSpace(em, fridge);
  if (fridgeSpace < product.size) {
      throw new BadRequest('overCapacity', 'Not enough capacity left in fridge to store product');
  }

  const contentBody = {
    fridge,
    product
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

