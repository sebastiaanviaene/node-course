import { getFridgeList, createFridge, getFridge, updateFridge, deleteFridge } from './handlers/fridge.handlers';
import { Authorized, Delete, Get, JsonController, Param, Patch, Post} from 'routing-controllers';
import { Body, ListRepresenter, Query, Representer, StatusCode } from '@panenco/papi';
import { SearchQuery } from '../../contracts/search.query';
import { OpenAPI } from 'routing-controllers-openapi';
import { FridgeView } from '../../contracts/fridge.view';
import { FridgeBody } from '../../contracts/fridge.body';

@JsonController("/fridges")
export class FridgeController {
    
    @Post()
    @Authorized()
    @OpenAPI({summary: 'Create a new fridge'})
    @Representer(FridgeView, StatusCode.created)
    async create(
      @Body() body: FridgeBody
    ){
      return await createFridge(body);
    }

    @Get()
    @Authorized()
    @OpenAPI({summary: 'returns all fridges relevant for the provided search query'})
    @ListRepresenter(FridgeView)
    async getList(
      @Query() query: SearchQuery
    ){
      return await getFridgeList(query);
    }

    @Get('/:id')
    @Authorized()
    @OpenAPI({summary: 'Returns fridge with the given id'})
    @Representer(FridgeView)
    async get(
      @Param('id') id: string
    ){
      return await getFridge(id);
    }

    @Patch('/:id')
    @Authorized()
    @OpenAPI({summary: 'Updates info of fridge with the given id'})
    @Representer(FridgeView)
    async update(
      @Param('id') id: string,
      @Body({}, {skipMissingProperties: true}) body: FridgeBody
    ){
      return await updateFridge(id,body);
    }

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