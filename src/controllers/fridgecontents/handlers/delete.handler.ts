import { RequestContext } from "@mikro-orm/core";
import { getAccessTokenData, NotFound, Unauthorized } from "@panenco/papi";
import e, { Request } from "express";
import { Fridge } from "../../../entities/fridge.entity";
import { Fridgecontent } from "../../../entities/fridgecontent.entity";
import { Product } from "../../../entities/product.entity";

export const deleteContent = async (productId: string, request: Request) => {

    const em = RequestContext.getEntityManager();
    const content = await em.findOneOrFail(Fridgecontent, {product: productId});
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