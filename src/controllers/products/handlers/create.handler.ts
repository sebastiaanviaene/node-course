import { RequestContext } from "@mikro-orm/core";
import { getAccessTokenData } from "@panenco/papi";
import { IsJWT } from "class-validator";
import { Request } from "express";
import { ProductBody } from "../../../contracts/product.body";
import { Product } from "../../../entities/product.entity";


export const create = async (body: ProductBody, request: Request) => {
  const token = request.headers['x-auth'] as string;
  const tokenData = getAccessTokenData(token,'secretSecretStuff');
  body["owner"] = tokenData.userId;
  const em = RequestContext.getEntityManager();
  const product = em.create(Product, body);
  await em.persistAndFlush(product);

  return product;
};

