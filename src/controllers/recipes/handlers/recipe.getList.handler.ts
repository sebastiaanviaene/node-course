import { RequestContext } from "@mikro-orm/core";
import { SearchQuery } from "../../../contracts/search.query";
import { Recipe } from "../../../entities/recipe.entity";

export const getRecipeList = (query: SearchQuery) => {

    const em = RequestContext.getEntityManager();
    return em.findAndCount(
      Recipe,
      query && query.search && { $or: [{ name: { $ilike: `%${query.search}%`} }, {description: { $ilike: `%${query.search}%`}}] }
    );
};


