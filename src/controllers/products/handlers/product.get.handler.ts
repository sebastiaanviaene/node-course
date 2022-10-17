import { RequestContext } from "@mikro-orm/core";
import { Product } from "../../../entities/product.entity";

export const getProduct = (productId: string) => {
    
    const em = RequestContext.getEntityManager();
    const product = em.findOneOrFail(Product, {id: productId});
    return product;
  };