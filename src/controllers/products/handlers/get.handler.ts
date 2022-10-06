import { RequestContext } from "@mikro-orm/core";
import { NotFound } from "@panenco/papi";
import { Product } from "../../../entities/product.entity";

export const get = (id: string) => {
    
    const em = RequestContext.getEntityManager();
    const product = em.findOneOrFail(Product, {id});
    if (!product) {
        throw new NotFound('productNotFound', 'Product not found');
    }
    return product;
    

  };