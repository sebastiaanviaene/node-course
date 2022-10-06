import { RequestContext } from "@mikro-orm/core";
import { getAccessTokenData } from "@panenco/papi";
import { Request } from "express";
import { Fridgecontent } from "../../../entities/fridgecontent.entity";

export const getList = async (search: string, request: Request) => {
    const em = RequestContext.getEntityManager();
    const data = request.token;
    const token = request.headers['x-auth'] as string;
    const tokenData = getAccessTokenData(token,'secretSecretStuff');
    return await em.findAndCount(
      Fridgecontent,
      {
        $and: [
          {product: {owner: `${tokenData.userId}`}},
          {...(search
            && {$or: [
              { product: {name: { $ilike: `%${search}%`}}},
              { fridge: {location: { $ilike: `%${search}%`}}}
          ]})},
        ]
    },
      //{populate: ['fridge', 'product', 'product']}
    );
    
};


