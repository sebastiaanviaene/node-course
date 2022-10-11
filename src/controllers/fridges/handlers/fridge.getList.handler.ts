import { RequestContext } from "@mikro-orm/core";
import { SearchQuery } from "../../../contracts/search.query";
import { Fridge } from "../../../entities/fridge.entity";

export const getList = (query: SearchQuery) => {

    const em = RequestContext.getEntityManager();
    return em.findAndCount(
      Fridge,
      query && query.search
      ? {
        $or: [{ location: { $ilike: `%${query.search}%`} }]
      }
      : {}
    );
    
  };


