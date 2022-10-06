
import { RequestContext } from "@mikro-orm/core";
import { RecipeBody } from "../../../contracts/recipe.body";
import { Recipe } from "../../../entities/recipe.entity";


export const create = async (body: RecipeBody) => {
   
  const em = RequestContext.getEntityManager();
  const recipe = em.create(Recipe, body);
  await em.persistAndFlush(recipe);

  return recipe;
};

