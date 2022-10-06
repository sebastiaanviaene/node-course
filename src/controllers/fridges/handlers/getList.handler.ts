import { RequestContext } from "@mikro-orm/core";
import { Fridge } from "../../../entities/fridge.entity";

export const getList = (search: string) => {

    const em = RequestContext.getEntityManager();
    return em.findAndCount(
      Fridge,
      search
      ? {
        $or: [{ location: { $ilike: `%${search}%`} }]
      }
      : {}
    );
    
  };


