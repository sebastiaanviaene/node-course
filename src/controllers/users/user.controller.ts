import { NextFunction, Request, Response, Router } from 'express';

import { getList } from './handlers/user.getList.handler';
import { create } from './handlers/user.create.handler';
import { get } from './handlers/user.get.handler';
import { update } from './handlers/user.update.handler';
import { deleteUser } from './handlers/user.delete.handler';
import { UserBody } from '../../contracts/user.body';
import { Authorized, Delete, Get, JsonController, Param, Patch, Post, UseBefore } from 'routing-controllers';
import { Body, ListRepresenter, Query, Representer, StatusCode } from '@panenco/papi';
import { SearchQuery } from '../../contracts/search.query';
import { UserView } from '../../contracts/user.view';
import { OpenAPI } from 'routing-controllers-openapi';

const adminMiddleware = (req, res, next) => {
    if (req.header("x-auth") != "api-key") {
        return res.status(401).send('Unauthorized');
    }
    next();
}

@JsonController("/users")
export class UserController {
    
    //Adding user to the database
    @Post()
    @UseBefore(adminMiddleware)
    @OpenAPI({summary: 'Create a new user'})
    @Representer(UserView, StatusCode.created)
    async create(
      @Body() body: UserBody
    ){
      const user = await create(body);
      return user;
    }

    //This action returns all users
    @Get()
    @Authorized()
    @OpenAPI({summary: 'returns all users relevant for the provided search query'})
    @ListRepresenter(UserView)
    async getList(
      @Query() query: SearchQuery
    ){
      const [users, total] = await getList(query)
      return [users, total];
    }

    //This action returns user with the given id
    @Get('/:id')
    @Authorized()
    @OpenAPI({summary: 'Returns user with the given id'})
    @Representer(UserView)
    async get(
      @Param('id') id: string
    ){
      const user = await get(id);
      return user;
    }

    //Updating info of user with the given id
    @Patch('/:id')
    @Authorized()
    @OpenAPI({summary: 'Updates info of user with the given id'})
    @Representer(UserView)
    async update(
      @Param('id') id: string,
      @Body({}, {skipMissingProperties: true}) body: UserBody
    ){
      const user = await update(id,body)
      return user;
    }

    //Removing user with the given id from the database
    @Delete('/:id')
    @Authorized()
    @OpenAPI({summary: 'Deletes user with the given id'})
    @Representer(null, StatusCode.noContent)
    async delete(
      @Param('id') id: string
    ){
      await deleteUser(id);
    }
}