import { RequestContext } from "@mikro-orm/core";
import { NotFound } from "@panenco/papi";
import { Recipe } from "../../../entities/recipe.entity";

export const deleteRecipe = async (id: string) => {

    const em = RequestContext.getEntityManager();
    const recipe = await em.findOneOrFail(Recipe, {id});
    if (!recipe) {
        throw new NotFound('recipeNotFound', 'Recipe not found');
    }
    await em.removeAndFlush(recipe);
  };