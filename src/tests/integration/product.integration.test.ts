// src/tests/integration/user.integration.test.ts
import { MikroORM } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { getAccessTokenData, StatusCode } from "@panenco/papi";
import { expect } from "chai";
import supertest from "supertest";
import { App } from "../../app";
import { LoginBody } from "../../contracts/login.body";
import { Product, User } from "../../entities/entityIndex";
import { initDB, initProducts, initUsers } from "../helpers/helperIndex";

// bootstrapping the server with supertest
describe('Integration tests', () => {
  
  describe('Product Tests', () => {
    let request: supertest.SuperTest<supertest.Test>;
    let orm: MikroORM<PostgreSqlDriver>;
    let users: User[];
    let products: Product[];

    before(async () => {
      const app = new App();
      await app.createConnection();
      orm = app.orm;
      request = supertest(app.host);
    })
    
    beforeEach(async () => {
      await initDB(orm);
      users = await initUsers(orm);
      products = await initProducts(orm);
    });

  it('should CRUD products', async () => {

    const { body: loginResponse } = await request
      .post(`/api/auth/tokens`)
      .send({
        email: 'test-user+1@panenco.com',
        password: 'password1'
      } as LoginBody);
      const token = loginResponse.token;

    const { body: createProductResponse } = await request
    .post(`/api/products`)
    .send({
      name: 'cheese',
      size: 10
    } as Product)
    .set('x-auth',token)
    .expect(StatusCode.created);
    expect(createProductResponse.owner === getAccessTokenData(token, 'secretSecretStuff').userId).true;

    //get product by id as owner
    const { body: getProductResponse } = await request
    .get(`/api/products/${createProductResponse.id}`)
    .set('x-auth', token)
    .expect(200);
    expect(createProductResponse.name === getProductResponse.name).true;

    //update product as owner
    const testSize = 3
    const {body: updateProductResponse} = await request
    .patch(`/api/products/${createProductResponse.id}`)
    .set('x-auth',token)
    .send({
      size: testSize
    } as Product)
    .expect(200)
    expect(updateProductResponse.size === testSize).true
    expect(updateProductResponse.name === createProductResponse.name).true;
    expect(updateProductResponse.owner === createProductResponse.owner).true;

    
    const [originalProducts, originalCount] = await orm.em.fork().findAndCount(Product, null);
    await request
    .delete(`/api/products/`+createProductResponse.id)
    .set('x-auth',token)
    .expect(StatusCode.noContent);
    const [finalProducts, finalCount] = await orm.em.fork().findAndCount(Product, null);
    expect(finalCount === originalCount-1).true;
  });
  
  it('should not UD products user does not own', async () => {
    
    const { body: loginResponse } = await request
    .post(`/api/auth/tokens`)
    .send({
      email: 'test-user+2@panenco.com',
      password: 'password2'
    } as LoginBody);
    const token = loginResponse.token;

    const [{id}] = products;
    await request
    .patch(`/api/products/${id}`)
    .set('x-auth',token)
    .send({
      size: 3
    } as Product)
    .expect(StatusCode.forbidden)
      
    const duplicate_em = orm.em.fork();
    const [originalProducts, originalCount] = await duplicate_em.findAndCount(Product, null);
    await request
    .delete(`/api/products/`+id)
    .set('x-auth',token)
    .expect(StatusCode.forbidden);
    const [finalProducts, finalCount] = await duplicate_em.findAndCount(Product, null);
    expect(finalCount === originalCount).true;
  });

  it('should not CRUD products unauthorized', async () => {

    await request
    .post(`/api/products`)
    .send({
      name: 'cheese',
      size: 10
    } as Product)
    .expect(StatusCode.unauthorized);

    const [{id}] = products;
    const { body: getProductResponse } = await request
    .get(`/api/products/${id}`)
    .expect(StatusCode.unauthorized);

    //update product as owner
    const testSize = 3
    const {body: updateProductResponse} = await request
    .patch(`/api/products/${id}`)
    .send({
      size: testSize
    } as Product)
    .expect(StatusCode.unauthorized)

    await request
    .delete(`/api/products/`+id)
    .expect(StatusCode.unauthorized);
  });
  });
});