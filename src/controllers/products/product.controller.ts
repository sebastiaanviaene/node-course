import { getProductList, createProduct, deleteProduct, getProduct, updateProduct } from './handlers/product.handlers';
import { Authorized, Delete, Get, JsonController, Param, Patch, Post, Req} from 'routing-controllers';
import { Body, ListRepresenter, Query, Representer, StatusCode } from '@panenco/papi';
import { SearchQuery } from '../../contracts/search.query';
import { OpenAPI } from 'routing-controllers-openapi';
import { ProductView } from '../../contracts/product.view';
import { ProductBody } from '../../contracts/product.body';
import { Request } from 'express';
import { productOwnerRequirement } from '../../utils/authorization/productOwner.requirement';

@JsonController("/products")
export class ProductController {
    
    @Post()
    @Authorized()
    @OpenAPI({summary: 'Create a new product'})
    @Representer(ProductView, StatusCode.created)
    async create(
      @Body() body: ProductBody,
      @Req() request: Request
    ){
      return await createProduct(request.token.userId, body);
    }

    @Get()
    @Authorized()
    @OpenAPI({summary: 'returns all products relevant for the provided search query'})
    @ListRepresenter(ProductView)
    async getList(
      @Query() query: SearchQuery
    ){
      return await getProductList(query);
    }

    @Get('/:id')
    @Authorized()
    @OpenAPI({summary: 'Returns product with the given id'})
    @Representer(ProductView)
    async get(
      @Param('id') id: string
    ){
      return await getProduct(id);
    }

    //needs requirement
    @Patch('/:id')
    @Authorized(productOwnerRequirement)
    @OpenAPI({summary: 'Updates info of product with the given id'})
    @Representer(ProductView)
    async update(
      @Param('id') id: string,
      @Req() request: Request,
      @Body({}, {skipMissingProperties: true}) body: ProductBody
    ){
      return await updateProduct(id, body);
    }

    //needs requirement
    @Delete('/:id')
    @Authorized(productOwnerRequirement)
    @OpenAPI({summary: 'Deletes product with the given id'})
    @Representer(null, StatusCode.noContent)
    async delete(
      @Param('id') id: string,
      @Req() request: Request
    ){
      await deleteProduct(id);
    }
}