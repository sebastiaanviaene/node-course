import { RequestContext } from "@mikro-orm/core";
import { Recipe } from "../../../entities/recipe.entity";

export const deleteRecipe = async (recipeId: string) => {

    const em = RequestContext.getEntityManager();
    const recipe = await em.findOneOrFail(Recipe, {id: recipeId});
    await em.removeAndFlush(recipe);
  };