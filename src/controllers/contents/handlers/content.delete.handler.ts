import { RequestContext } from "@mikro-orm/core";
import { getAccessTokenData, NotFound, Unauthorized } from "@panenco/papi";
import { Request } from "express";
import { Content } from "../../../entities/content.entity";
import { Product } from "../../../entities/product.entity";

export const deleteContent = async (productId: string, request: Request) => {

    const em = RequestContext.getEntityManager();
    const content = await em.findOneOrFail(Content, {product: productId});
    if (!content) {
        throw new NotFound('contentNotFound', 'Product not in fridge');
    }

    //checking if user is owner of the product
    const prod = await em.findOneOrFail(Product,productId)
    const token = request.headers['x-auth'] as string;
    const tokenData = getAccessTokenData(token,'secretSecretStuff');
    if (prod.owner !== tokenData.userId) {
        throw new Unauthorized('notOwner', 'You are not the owner of this product')
    }
    
    await em.removeAndFlush(content);
  };