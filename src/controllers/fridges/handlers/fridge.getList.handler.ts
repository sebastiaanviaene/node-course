import { RequestContext } from "@mikro-orm/core";
import { SearchQuery } from "../../../contracts/search.query";
import { Fridge } from "../../../entities/entityIndex";

export const getFridgeList = (query: SearchQuery) => {

    const em = RequestContext.getEntityManager();
    return em.findAndCount(
      Fridge,
      query && query.search && { location: { $ilike: `%${query.search}%`} }
    );
    
  };


