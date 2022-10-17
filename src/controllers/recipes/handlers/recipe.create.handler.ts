import { RequestContext } from "@mikro-orm/core";
import { RecipeBody } from "../../../contracts/recipe.body";
import { Recipe } from "../../../entities/recipe.entity";

export const createRecipe = async (recipeBody: RecipeBody) => {
  const em = RequestContext.getEntityManager();
  const recipe = em.create(Recipe, recipeBody);
  await em.persistAndFlush(recipe);

  return recipe;
};

