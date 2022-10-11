import { RequestContext } from "@mikro-orm/core";
import { SearchQuery } from "../../../contracts/search.query";
import { User } from "../../../entities/user.entity";

export const getList = (query: SearchQuery) => {

    const em = RequestContext.getEntityManager();
    return em.findAndCount(
      User,
      query && query.search
      ? {
        $or: [{ name: { $ilike: `%${query.search}%`} }, {email: { $ilike: `%${query.search}%`}}]
      }
      : {}
    );
    
  };


