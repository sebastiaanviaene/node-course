import { RequestContext } from "@mikro-orm/core";
import { ProductBody } from "../../../contracts/product.body";
import { Product } from "../../../entities/product.entity";


export const createProduct = async (userId: string, productBody: ProductBody) => {
  productBody["owner"] = userId;
  const em = RequestContext.getEntityManager();
  const product = em.create(Product, productBody);
  await em.persistAndFlush(product);
  return product;
};

