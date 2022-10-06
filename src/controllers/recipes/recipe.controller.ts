import { getList } from './handlers/getList.handler';
import { create } from './handlers/create.handler';
import { get } from './handlers/get.handler';
import { update } from './handlers/update.handler';
import { deleteRecipe } from './handlers/delete.handler';
import { RecipeBody } from '../../contracts/recipe.body';
import { Authorized, Delete, Get, JsonController, Param, Patch, Post, UseBefore } from 'routing-controllers';
import { Body, ListRepresenter, Query, Representer, StatusCode } from '@panenco/papi';
import { SearchQuery } from '../../contracts/search.query';
import { RecipeView } from '../../contracts/recipe.view';
import { OpenAPI } from 'routing-controllers-openapi';
import { v4 } from 'uuid';

@JsonController("/recipes")
export class RecipeController {
    
    //Adding user to the database
    @Post()
    @Authorized()
    @OpenAPI({summary: 'Create a new recipe'})
    @Representer(RecipeView, StatusCode.created)
    async create(
      @Body() body: RecipeBody
    ){
      const recipe = await create(body);
      return recipe;
    }

    //This action returns all users
    @Get()
    @Authorized()
    @OpenAPI({summary: 'returns all recipes relevant for the provided search query'})
    @ListRepresenter(RecipeView)
    async getList(
      @Query() query: SearchQuery
    ){
      const [recipes, total] = await getList(query.search)
      return [recipes, total];
    }

    //This action returns recipe with the given id
    @Get('/:id')
    @Authorized()
    @OpenAPI({summary: 'Returns recipe with the given id'})
    @Representer(RecipeView)
    async get(
      @Param('id') id: string
    ){
      const recipe = await get(id);
      return recipe;
    }

    //Updating info of recipe with the given id
    @Patch('/:id')
    @Authorized()
    @OpenAPI({summary: 'Updates info of recipe with the given id'})
    @Representer(RecipeView)
    async update(
      @Param('id') id: string,
      @Body({}, {skipMissingProperties: true}) body: RecipeBody
    ){
      const fridge = await update(id,body)
      return fridge;
    }

    //Removing recipe with the given id from the database
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