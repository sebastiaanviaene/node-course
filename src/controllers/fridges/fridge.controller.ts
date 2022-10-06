import { getList } from './handlers/getList.handler';
import { create } from './handlers/create.handler';
import { get } from './handlers/get.handler';
import { update } from './handlers/update.handler';
import { deleteFridge } from './handlers/delete.handler';
import { Authorized, Delete, Get, JsonController, Param, Patch, Post, UseBefore } from 'routing-controllers';
import { Body, ListRepresenter, Query, Representer, StatusCode } from '@panenco/papi';
import { SearchQuery } from '../../contracts/search.query';
import { OpenAPI } from 'routing-controllers-openapi';
import { v4 } from 'uuid';
import { FridgeView } from '../../contracts/fridge.view';
import { FridgeBody } from '../../contracts/fridge.body';

@JsonController("/fridges")
export class FridgeController {
    
    //Adding user to the database
    @Post()
    @Authorized()
    @OpenAPI({summary: 'Create a new fridge'})
    @Representer(FridgeView, StatusCode.created)
    async create(
      @Body() body: FridgeBody
    ){
      const fridge = await create(body);
      return fridge;
    }

    //This action returns all users
    @Get()
    @Authorized()
    @OpenAPI({summary: 'returns all fridges relevant for the provided search query'})
    @ListRepresenter(FridgeView)
    async getList(
      @Query() query: SearchQuery
    ){
      const [fridges, total] = await getList(query.search)
      return [fridges, total];
    }

    //This action returns fridge with the given id
    @Get('/:id')
    @Authorized()
    @OpenAPI({summary: 'Returns fridge with the given id'})
    @Representer(FridgeView)
    async get(
      @Param('id') id: string
    ){
      const fridge = await get(id);
      return fridge;
    }

    //Updating info of recipe with the given id
    @Patch('/:id')
    @Authorized()
    @OpenAPI({summary: 'Updates info of fridge with the given id'})
    @Representer(FridgeView)
    async update(
      @Param('id') id: string,
      @Body({}, {skipMissingProperties: true}) body: FridgeBody
    ){
      const fridge = await update(id,body)
      return fridge;
    }

    //Removing fridge with the given id from the database
    @Delete('/:id')
    @Authorized()
    @OpenAPI({summary: 'Deletes fridge with the given id'})
    @Representer(null, StatusCode.noContent)
    async delete(
      @Param('id') id: string
    ){
      await deleteFridge(id);
    }
}