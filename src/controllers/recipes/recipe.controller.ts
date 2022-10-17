import { getRecipeList, createRecipe, deleteRecipe, getRecipe, updateRecipe } from './handlers/recipe.handlers';
import { RecipeBody } from '../../contracts/recipe.body';
import { Authorized, Delete, Get, JsonController, Param, Patch, Post, UseBefore } from 'routing-controllers';
import { Body, ListRepresenter, Query, Representer, StatusCode } from '@panenco/papi';
import { SearchQuery } from '../../contracts/search.query';
import { RecipeView } from '../../contracts/recipe.view';
import { OpenAPI } from 'routing-controllers-openapi';

@JsonController("/recipes")
export class RecipeController {
    
    @Post()
    @Authorized()
    @OpenAPI({summary: 'Create a new recipe'})
    @Representer(RecipeView, StatusCode.created)
    async create(
      @Body() body: RecipeBody
    ){
      return await createRecipe(body);
    }

    @Get()
    @Authorized()
    @OpenAPI({summary: 'returns all recipes relevant for the provided search query'})
    @ListRepresenter(RecipeView)
    async getList(
      @Query() query: SearchQuery
    ){
      return await getRecipeList(query);
    }

    @Get('/:id')
    @Authorized()
    @OpenAPI({summary: 'Returns recipe with the given id'})
    @Representer(RecipeView)
    async get(
      @Param('id') id: string
    ){
      return await getRecipe(id);
    }

    @Patch('/:id')
    @Authorized()
    @OpenAPI({summary: 'Updates info of recipe with the given id'})
    @Representer(RecipeView)
    async update(
      @Param('id') id: string,
      @Body({}, {skipMissingProperties: true}) body: RecipeBody
    ){
      return await updateRecipe(id,body);
    }

    @Delete('/:id')
    @Authorized()
    @OpenAPI({summary: 'Deletes recipe with the given id'})
    @Representer(null, StatusCode.noContent)
    async delete(
      @Param('id') id: string
    ){
      await deleteRecipe(id);
    }
}