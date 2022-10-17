import { RequestContext } from "@mikro-orm/core";
import { NotFound } from "@panenco/papi";
import { Recipe } from "../../../entities/recipe.entity";

export const getRecipe = (recipeId: string) => {
    
    const em = RequestContext.getEntityManager();
    return em.findOneOrFail(Recipe, {id: recipeId});
  };