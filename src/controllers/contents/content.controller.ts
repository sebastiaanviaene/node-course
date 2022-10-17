import { getContentList, createContent, deleteContent, getContent } from './handlers/content.handlers';
import { Authorized, Delete, Get, JsonController, Param, Post, Req } from 'routing-controllers';
import { Body, ListRepresenter, Query, Representer, StatusCode } from '@panenco/papi';
import { SearchQuery } from '../../contracts/search.query';
import { OpenAPI } from 'routing-controllers-openapi';
import { ContentBody } from '../../contracts/content.body';
import { ContentView as ContentView } from '../../contracts/content.view';
import { Request } from 'express';
import { productOwnerContentRequirement, productOwnerRequirement } from '../../utils/authorization/productOwner.requirement';

@JsonController("/contents")
export class ContentController {
    
    @Post()
    @Authorized(productOwnerContentRequirement)
    @OpenAPI({summary: 'Put product in fridge'})
    @Representer(ContentView, StatusCode.created)
    async create(
      @Body() body: ContentBody
    ){
      return createContent(body);
    }

    @Get()
    @Authorized()
    @OpenAPI({summary: 'get list of contents',description: 'returns all products stored in fridges relevant for the provided search query. Only returns owners own products if requested'})
    @ListRepresenter(ContentView)
    async getList(
      @Req() request: Request,
      @Query() query: SearchQuery,
    ){ 
      return await getContentList(request.token.userId, query)
    }

    @Get('/:id')
    @Authorized()
    @OpenAPI({summary: 'Returns contents with the given productId'})
    @Representer(ContentView)
    async get(
      @Param('id') id: string
    ){
      return await getContent(id);
    }

    @Delete('/:id')
    @Authorized(productOwnerRequirement)
    @OpenAPI({summary: 'Removes product from fridge'})
    @Representer(null, StatusCode.noContent)
    async delete(
      @Param('id') id: string
    ){
      await deleteContent(id);
    }
    
}