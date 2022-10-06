import { RequestContext } from "@mikro-orm/core";
import { Recipe } from "../../../entities/recipe.entity";

export const getList = (search: string) => {

    const em = RequestContext.getEntityManager();
    return em.findAndCount(
      Recipe,
      search
      ? {
        $or: [{ name: { $ilike: `%${search}%`} }, {description: { $ilike: `%${search}%`}}]
      }
      : {}
    );
    
  };


