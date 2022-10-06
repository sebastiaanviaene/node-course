import { getList } from './handlers/getList.handler';
import { create } from './handlers/create.handler';
import { get } from './handlers/get.handler';
import { update } from './handlers/update.handler';
import { Authorized, Delete, Get, JsonController, Param, Patch, Post, Req, UseBefore } from 'routing-controllers';
import { Body, getAccessTokenData, ListRepresenter, Query, Representer, StatusCode } from '@panenco/papi';
import { SearchQuery } from '../../contracts/search.query';
import { OpenAPI } from 'routing-controllers-openapi';
import { ProductView } from '../../contracts/product.view';
import { ProductBody } from '../../contracts/product.body';
import { deleteProduct } from './handlers/delete.handler';
import { Request } from 'express';

@JsonController("/products")
export class ProductController {
    
    //Adding product to the database
    @Post()
    @Authorized()
    @OpenAPI({summary: 'Create a new product'})
    @Representer(ProductView, StatusCode.created)
    async create(
      @Body() body: ProductBody,
      @Req() request: Request
    ){
      const product = await create( body, request);
      return product;
    }

    //This action returns all products
    @Get()
    @Authorized()
    @OpenAPI({summary: 'returns all products relevant for the provided search query'})
    @ListRepresenter(ProductView)
    async getList(
      @Query() query: SearchQuery
    ){
      const [products, total] = await getList(query.search)
      return [products, total];
    }

    //This action returns product with the given id
    @Get('/:id')
    @Authorized()
    @OpenAPI({summary: 'Returns product with the given id'})
    @Representer(ProductView)
    async get(
      @Param('id') id: string
    ){
      const product = await get(id);
      return product;
    }

    //Updating info of product with the given id
    @Patch('/:id')
    @Authorized()
    @OpenAPI({summary: 'Updates info of product with the given id'})
    @Representer(ProductView)
    async update(
      @Param('id') id: string,
      @Req() request: Request,
      @Body({}, {skipMissingProperties: true}) body: ProductBody
    ){
      const product = await update(id, request, body)
      return product;
    }


    //Removing product with the given id from the database
    @Delete('/:id')
    @Authorized()
    @OpenAPI({summary: 'Deletes product with the given id'})
    @Representer(null, StatusCode.noContent)
    async delete(
      @Param('id') id: string,
      @Req() request: Request
    ){
      await deleteProduct(id, request);
    }

}