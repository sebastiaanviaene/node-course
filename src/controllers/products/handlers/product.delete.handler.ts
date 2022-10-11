import { RequestContext } from "@mikro-orm/core";
import { Forbidden, getAccessTokenData, NotFound } from "@panenco/papi";
import { Request } from "express";
import { Content } from "../../../entities/content.entity";
import { Product } from "../../../entities/product.entity";

export const deleteProduct = async (id: string, request: Request) => {

    const em = RequestContext.getEntityManager();
    const product = await em.findOneOrFail(Product, {id});
    if (!product) {
        throw new NotFound('productNotFound', 'Product not found');
    }

    const token = request.headers['x-auth'] as string;
    const tokenData = getAccessTokenData(token,'secretSecretStuff');
    if (product.owner !== tokenData.userId) {
        throw new Forbidden('notOwner', 'You are not the owner of this product')
    }

    //if the product was stored in the fridge, it should also be removed from there
    const content = await em.findOne(Content, {product: id});
    if (content) {
        em.remove(content);
    }
    await em.removeAndFlush(product);

  };