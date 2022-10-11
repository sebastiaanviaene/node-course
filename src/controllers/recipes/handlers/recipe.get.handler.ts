import { RequestContext } from "@mikro-orm/core";
import { NotFound } from "@panenco/papi";
import { Recipe } from "../../../entities/recipe.entity";

export const get = (id: string) => {
    
    const em = RequestContext.getEntityManager();
    const recipe = em.findOneOrFail(Recipe, {id});
    if (!recipe) {
        throw new NotFound('recipeNotFound', 'Recipe not found');
    }
    return recipe;
    

  };