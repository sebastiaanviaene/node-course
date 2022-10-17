import { RequestContext } from "@mikro-orm/core";
import { Product } from "../../../entities/product.entity";

export const deleteProduct = async (productId: string) => {
    const em = RequestContext.getEntityManager();
    const product = await em.findOneOrFail(Product, {id: productId});
    await em.removeAndFlush(product);

  };