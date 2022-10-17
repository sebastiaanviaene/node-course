import { RequestContext } from "@mikro-orm/core";
import { SearchQuery } from "../../../contracts/search.query";
import { Product } from "../../../entities/product.entity";

export const getProductList = (query: SearchQuery) => {

    const em = RequestContext.getEntityManager();
    return em.findAndCount(
      Product,
      query && query.search && { $or: [{ name: { $ilike: `%${query.search}%`} }, {owner: { $ilike: `%${query.search}%`} }] }
    );
  };


