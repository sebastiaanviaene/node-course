import { getList } from './handlers/content.getList.handler';
import { create } from './handlers/content.create.handler';
import { get } from './handlers/content.get.handler';
import { deleteContent } from './handlers/content.delete.handler';
import { Authorized, Delete, Get, JsonController, Param, Post, Req } from 'routing-controllers';
import { Body, ListRepresenter, Query, Representer, StatusCode } from '@panenco/papi';
import { SearchQuery } from '../../contracts/search.query';
import { OpenAPI } from 'routing-controllers-openapi';
import { ContentBody } from '../../contracts/content.body';
import { ContentView as ContentView } from '../../contracts/content.view';
import { Request } from 'express';

@JsonController("/contents")
export class ContentController {
    
    @Post()
    @Authorized()
    @OpenAPI({summary: 'Put product in fridge'})
    @Representer(ContentView, StatusCode.created)
    async create(
      @Body() body: ContentBody,
      @Req() request: Request
    ){
      return create(body, request);
    }

    @Get()
    @Authorized()
    @OpenAPI({summary: 'get list of contents',description: 'returns all products stored in fridges relevant for the provided search query. Only returns owners own products if requested'})
    @ListRepresenter(ContentView)
    async getList(
      @Req() request: Request,
      @Query() query: SearchQuery,
    ){
      return getList(query, request)
    }


    @Get('/:id')
    @Authorized()
    @OpenAPI({summary: 'Returns contents with the given productId'})
    @Representer(ContentView)
    async get(
      @Param('id') id: string
    ){
      return await get(id);
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