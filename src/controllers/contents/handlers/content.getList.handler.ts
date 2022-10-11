import { RequestContext } from "@mikro-orm/core";
import { getAccessTokenData } from "@panenco/papi";
import { Request } from "express";
import { SearchQuery } from "../../../contracts/search.query";
import { Content } from "../../../entities/content.entity";

export const getList = async (query: SearchQuery, request: Request) => {
    const em = RequestContext.getEntityManager();
    const data = request.token;
    const token = request.headers['x-auth'] as string;
    const tokenData = getAccessTokenData(token,'secretSecretStuff');
    return await em.findAndCount(
      Content,
      {
        $and: [
          {product: {owner: `${tokenData.userId}`}},
          {...(query && query.search
            && {$or: [
              { product: {name: { $ilike: `%${query.search}%`}}},
              { fridge: {location: { $ilike: `%${query.search}%`}}}
          ]})},
        ]
    },
      //{populate: ['fridge', 'product', 'product']}
    );
    
};


