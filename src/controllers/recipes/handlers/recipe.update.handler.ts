// update.handler.ts
import { RequestContext } from '@mikro-orm/core';
import { RecipeBody } from '../../../contracts/recipe.body';
import { Recipe } from '../../../entities/recipe.entity';

export const updateRecipe = async (recipeId: string, recipeBody: RecipeBody) => {
  const em = RequestContext.getEntityManager();
  const recipe = await em.findOneOrFail(Recipe,{id: recipeId});
  recipe.assign(recipeBody);
  await em.flush();
  return recipe; 
};