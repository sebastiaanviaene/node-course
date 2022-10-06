// src/tests/integration/user.integration.test.ts
import { MikroORM } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { getAccessTokenData, StatusCode } from "@panenco/papi";
import { expect } from "chai";
import supertest from "supertest";
import { App } from "../../app";
import { LoginBody } from "../../contracts/login.body";
import { Product } from "../../entities/product.entity";
import { User } from "../../entities/user.entity";

// bootstrapping the server with supertest
describe('Integration tests', () => {
  
  describe('Product Tests', () => {
    let request: supertest.SuperTest<supertest.Test>;
    let orm: MikroORM<PostgreSqlDriver>;

    before(async () => {
      const app = new App();
      await app.createConnection();
      orm = app.orm;
      request = supertest(app.host);
    })
    
    beforeEach(async () => {
      await orm.em.execute(`DROP SCHEMA public CASCADE; CREATE SCHEMA public`);
      await orm.getMigrator().up();
    });

  it('should CRUD products', async () => {

    //create user
    const { body: createUserResponse } = await request
    .post(`/api/users`)
    .send({
      name: 'user0',
      email: 'user0@email.com',
      password: 'weakpassword'
    } as User)
    .set('x-auth','api-key')
    .expect(StatusCode.created);

    const { body: loginResponse } = await request
    .post(`/api/auth/tokens`)
    .send({
      email: 'user0@email.com',
      password: 'weakpassword'
    } as LoginBody);
    const user0token = loginResponse.token;

    //create second user
    const { body: createUserResponse2 } = await request
    .post(`/api/users`)
    .send({
      name: 'user1',
      email: 'user1@email.com',
      password: 'weakpassword'
    } as User)
    .set('x-auth','api-key')
    .expect(StatusCode.created);

    const { body: loginResponse2 } = await request
    .post(`/api/auth/tokens`)
    .send({
      email: 'user1@email.com',
      password: 'weakpassword'
    } as LoginBody);
    const user1token = loginResponse2.token;

    const { body: createProductResponse } = await request
    .post(`/api/products`)
    .send({
      name: 'tomato',
      size: 12
    } as Product)
    .set('x-auth',user0token)
    .expect(StatusCode.created);
    expect(createProductResponse.owner === getAccessTokenData(user0token,'secretSecretStuff').userId).true

    //get product by id as owner
    const { body: getProductResponse } = await request
    .get(`/api/products/${createProductResponse.id}`)
    .set('x-auth',user0token)
    .expect(200);
    expect(createProductResponse.name === getProductResponse.name).true;

    //get product by id as not the owner
    const { body: getProductResponse2 } = await request
    .get(`/api/products/${createProductResponse.id}`)
    .set('x-auth',user1token)
    .expect(200);
    expect(createProductResponse.name === getProductResponse2.name).true;

    
    //updating name of product as not the owner -> should not be allowed
    const testName = 'potato'
    await request
    .patch(`/api/products/${createProductResponse.id}`)
    .set('x-auth',user1token)
    .send({
      name: testName
    } as Product)
    .expect(StatusCode.forbidden)
    //name should not have changed
    const duplicateEM = orm.em.fork();
    const testProduct = duplicateEM.findOneOrFail(Product, {name: { $ilike: `%${createProductResponse.name}%`}});
    expect(testProduct);

    //update product as owner
    const testSize = 3
    const {body: updateProductResponse} = await request
    .patch(`/api/products/${createProductResponse.id}`)
    .set('x-auth',user0token)
    .send({
      size: testSize
    } as Product)
    .expect(200)
    expect(updateProductResponse.size === testSize).true
    expect(updateProductResponse.name === createProductResponse.name).true;
    expect(updateProductResponse.owner === createProductResponse.owner).true;

    //transfer ownership
    const {body: transferResponse} = await request
    .patch(`/api/products/${createProductResponse.id}`)
    .set('x-auth',user0token)
    .send({
      owner: createUserResponse2.id
    } as Product)
    .expect(200)
    expect(transferResponse.owner === createUserResponse2.id).true;
    
    //deleting user as not the owner -> should not be allowed
    await request
    .delete(`/api/products/`+createProductResponse.id)
    .set('x-auth',user0token)
    .expect(StatusCode.forbidden);

    await request
    .delete(`/api/products/`+createProductResponse.id)
    .set('x-auth',user1token)
    .expect(StatusCode.noContent);

    const duplicate_em = orm.em.fork();
    const [products, total] = await duplicate_em.findAndCount(Product, null);
    expect(total === 0).true;
    


    });

  });
  });