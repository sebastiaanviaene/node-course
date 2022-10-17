import { MikroORM, RequestContext } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { expect } from 'chai'
import ormConfig from '../../orm.config';
import { Recipe } from '../../entities/entityIndex';
import { createRecipe, getRecipe, getRecipeList, updateRecipe, deleteRecipe } from '../../controllers/recipes/handlers/recipe.handlers';
import { initDB, initRecipes } from '../helpers/helperIndex';
import {v4} from 'uuid';
import { RecipeBody } from '../../contracts/recipe.body';

describe('Handler tests', () => {
    describe('Recipe Tests', () => {
      let orm: MikroORM<PostgreSqlDriver>;
      let recipes: Recipe[];

        before(async () => {
            orm = await MikroORM.init(ormConfig)
        })
        
        beforeEach(async () => {
            await initDB(orm);
            recipes = await initRecipes(orm)
        });

        it('should create a recipe', async () => {
            const body = {
                name: 'ei',
                description: 'eitje',
                ingredients: 'ei,zout'
            } as RecipeBody;
            await RequestContext.createAsync(orm.em.fork(), async () => {
            const res = await createRecipe(body);
            expect(res.name === 'ei').true;
            })
        });

        it('should get a recipe by id', async () => {
            const [{ id }] = recipes;
            await RequestContext.createAsync(orm.em.fork(), async () => {
            const res = await getRecipe(`${id}`);
            expect(res.id == id).true;
            expect(res.name == 'recipe1').true;
            });
        })

        it('should not get a recipe by a wrong id', async () => {
            let res: any;
            await RequestContext.createAsync(orm.em.fork(), async () => {
              try {
                res = getRecipe(v4());
              } catch (error) {
                expect(error.message).equal('Recipe not found');
              }
            });
        })

        it('should get all recipes', async () => {
            await RequestContext.createAsync(orm.em.fork(), async () => {
            const [res, total] = await getRecipeList(null);
            expect(res.every(x => ['recipe1', 'recipe2'].includes(x.name))).true;
            expect(total === recipes.length).true;
            })
        })

        it('should search recipes', async () => {
            await RequestContext.createAsync(orm.em.fork(), async () => {
            const [res, total] = await getRecipeList({search: 'ingredient2'});
            expect(res.every(x => ['recipe2'].includes(x.name))).true;
            })
        })

        it('should update a recipe by id', async () => {
            const testId = recipes[0].id;
            const body = {
                name: 'badRecipe'
            } as Recipe;
            await RequestContext.createAsync(orm.em.fork(), async () => {
                const res = await updateRecipe(`${testId}`, body);
                expect(res.name === 'test3');
                const newRecipe = await getRecipe(testId);
                expect(newRecipe.name === 'badRecipe').true;
            });
        })

        it('should not update a recipe by a wrong id', async () => {
            const body = {
                name: 'badRecipe'
            } as Recipe;
            await RequestContext.createAsync(orm.em.fork(), async () => {
                try {
                    await updateRecipe(`${v4()}`, body);
                }
                catch (error){
                    expect(error.code).equal(404)
                }
            });
        })

        it('should delete a recipe by id', async () => {
            await RequestContext.createAsync(orm.em.fork(), async () => {
              const initialCount = await orm.em.count(Recipe);
              await deleteRecipe(recipes[0].id);
              const finalCount = await orm.em.count(Recipe)
              expect(finalCount === initialCount-1).true;
            })
        });

        it('should not delete a recipe by a wrong id', async () => {
            await RequestContext.createAsync(orm.em.fork(), async () => {
              const initialCount = await orm.em.count(Recipe);
              try {
                await deleteRecipe(v4());
              }
              catch (error) {
                expect(error.code).equal(404)
              }
              const finalCount = await orm.em.count(Recipe)
              expect(finalCount === initialCount).true;
            })
        });
    });
});