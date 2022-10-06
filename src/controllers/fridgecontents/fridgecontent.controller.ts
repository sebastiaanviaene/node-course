import { getList } from './handlers/getList.handler';
import { create } from './handlers/create.handler';
import { get } from './handlers/get.handler';
import { deleteContent } from './handlers/delete.handler';
import { Authorized, Delete, Get, JsonController, Param, Patch, Post, Req } from 'routing-controllers';
import { Body, ListRepresenter, Query, Representer, StatusCode } from '@panenco/papi';
import { SearchQuery } from '../../contracts/search.query';
import { OpenAPI } from 'routing-controllers-openapi';
import { v4 } from 'uuid';
import { FridgecontentBody } from '../../contracts/fridgecontent.body';
import { FridgecontentView } from '../../contracts/fridgecontent.view';
import { Request } from 'express';

@JsonController("/fridgecontents")
export class FridgeContentController {
    
    @Post()
    @Authorized()
    @OpenAPI({summary: 'Put product in fridge'})
    @Representer(FridgecontentView, StatusCode.created)
    async create(
      @Body() body: FridgecontentBody,
      @Req() request: Request
    ){
      const content = await create(body, request);
      return content;
    }

    @Get()
    @Authorized()
    @OpenAPI({summary: 'get list of contents',description: 'returns all products stored in fridges relevant for the provided search query. Only returns owners own products if requested'})
    @ListRepresenter(FridgecontentView)
    async getList(
      @Req() request: Request,
      @Query() query: SearchQuery,
    ){
      const [contents, total] = await getList(query.search, request)
      return [contents, total];
    }


    @Get('/:id')
    @Authorized()
    @OpenAPI({summary: 'Returns contents with the given productId'})
    @Representer(FridgecontentView)
    async get(
      @Param('id') id: string
    ){
      const content = await get(id);
      return content;
    }

    @Delete('/:id')
    @Authorized()
    @OpenAPI({summary: 'Removes product from fridge'})
    @Representer(null, StatusCode.noContent)
    async delete(
      @Param('id') id: string,
      @Req() request: Request
    ){
      await deleteContent(id, request);
    }
    
}