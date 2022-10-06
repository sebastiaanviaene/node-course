import { RequestContext } from "@mikro-orm/core";
import { Product } from "../../../entities/product.entity";

export const getList = (search: string) => {

    const em = RequestContext.getEntityManager();
    return em.findAndCount(
      Product,
      search
      ? {
        $or: [{ name: { $ilike: `%${search}%`} }, {owner: { $ilike: `%${search}%`} }]
      }
      : {}
    );
    
  };


