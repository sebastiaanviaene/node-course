// update.handler.ts
import { RequestContext } from '@mikro-orm/core';
import { NotFound } from '@panenco/papi';
import { RecipeBody } from '../../../contracts/recipe.body';
import { Recipe } from '../../../entities/recipe.entity';

export const update = async (id: string, body: RecipeBody) => {

  const em = RequestContext.getEntityManager();
  const recipe = await em.findOneOrFail(Recipe,{id});

  if (!recipe) {
    throw new NotFound('recipeNotFound', 'Recipe not found');
  }

  recipe.assign(body);
  await em.flush();
  return recipe; 
};