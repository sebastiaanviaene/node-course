import { MikroORM } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { Recipe } from "../../entities/recipe.entity";

const recipeFixtures: Recipe[] = [
    {
        name: 'recipe1',
        description: 'tasty recipe',
        ingredients: 'ingredient'
    } as Recipe,
    {
        name: 'recipe2',
        description: 'tasty recipe2',
        ingredients: 'ingredient2'
    } as Recipe,
  ];

  export const initRecipes = (async (orm: MikroORM<PostgreSqlDriver>) => {
    let recipes: Recipe[];
    const em = orm.em.fork();
    recipes = recipeFixtures.map((x) => em.create(Recipe, x));
    await em.persistAndFlush(recipes);
    return recipes;
  })