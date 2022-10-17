import { RequestContext } from "@mikro-orm/core";
import { SearchQuery } from "../../../contracts/search.query";
import { Content } from "../../../entities/entityIndex";

export const getContentList = async (userId: string, query: SearchQuery) => {
    const em = RequestContext.getEntityManager();
    const searchFilter = query && query.search && 
        {$or: [
              { product: {name: { $ilike: `%${query.search}%`}}},
              { fridge: {location: { $ilike: `%${query.search}%`}}}
          ]};
    return await em.findAndCount(
      Content,
      {
          product: {owner: `${userId}`},
          ...(searchFilter),
      },
    );
};


