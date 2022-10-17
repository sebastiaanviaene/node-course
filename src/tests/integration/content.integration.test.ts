// src/tests/integration/user.integration.test.ts
import { MikroORM } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { getAccessTokenData, StatusCode } from "@panenco/papi";
import { expect } from "chai";
import supertest from "supertest";
import { App } from "../../app";
import { LoginBody } from "../../contracts/login.body";
import { Product } from "../../entities/entityIndex";
import { SearchQuery } from "../../contracts/search.query";
import { ContentBody } from "../../contracts/content.body";
import { initContents, initDB, initUsers } from "../helpers/helperIndex";
const getUuid = require('uuid-by-string');

// bootstrapping the server with supertest
describe('Integration tests', () => {
  
  describe('Content Tests', () => {
    let request: supertest.SuperTest<supertest.Test>;
    let orm: MikroORM<PostgreSqlDriver>;

    before(async () => {
      const app = new App();
      await app.createConnection();
      orm = app.orm;
      request = supertest(app.host);
    })
    
    beforeEach(async () => {
      await initDB(orm);
      await initUsers(orm);
      await initContents(orm);
    });

  it('should CRD contents', async () => {

    const { body: loginResponse } = await request
      .post(`/api/auth/tokens`)
      .send({
        email: 'test-user+1@panenco.com',
        password: 'password1'
      } as LoginBody);
      const token = loginResponse.token;

      const productId = getUuid('product_tea');
      const fridgeId = getUuid('fridge_mancave');
      const {body: createContentResponse} = await request
      .post(`/api/contents`)
      .send({
        productId,
        fridgeId
      } as ContentBody)
      .set('x-auth',token)
      .expect(201)
      const res = createContentResponse.fridge;
      expect(createContentResponse.fridge.id).equals(fridgeId);
      expect(createContentResponse.product.id).equals(productId);

    const { body: getContentResponse } = await request
    .get(`/api/contents/${createContentResponse.product.id}`)
    .set('x-auth',token)
    .expect(200);
    expect(createContentResponse.id === getContentResponse.id).true;

    const {body: {items, count}} = await request
    .get(`/api/contents/`)
    .set('x-auth',token)
    .query({search: 'mancave'} as SearchQuery)
    .expect(200)
    expect(items.some(x => x.id === createContentResponse.id)).true;

    await request
      .delete(`/api/contents/${createContentResponse.product.id}`)
      .set('x-auth',token)
      .expect(StatusCode.noContent)
    
  });

  it('should not CD contents the user does not own', async () => {

    const { body: loginResponse } = await request
      .post(`/api/auth/tokens`)
      .send({
        email: 'test-user+2@panenco.com',
        password: 'password2'
      } as LoginBody);
      const token = loginResponse.token;

      const teaId = getUuid('product_tea');
      const fridgeId = getUuid('fridge_mancave');
      await request
      .post(`/api/contents`)
      .send({
        productId: teaId,
        fridgeId
      } as ContentBody)
      .set('x-auth',token)
      .expect(StatusCode.forbidden)

    const tomatoId = getUuid('product_tomato');
    await request
      .delete(`/api/contents/${tomatoId}`)
      .set('x-auth',token)
      .expect(StatusCode.forbidden)
    
  });

  it('should not CRD contents unauthorized', async () => {

    const productId = getUuid('product_tea');
    const fridgeId = getUuid('fridge_mancave');
    await request
      .post(`/api/contents`)
      .send({
        productId,
        fridgeId
      } as ContentBody)
      .expect(StatusCode.unauthorized);

    await request
    .get(`/api/contents/${productId}`)
    .expect(StatusCode.unauthorized);

    await request
    .get(`/api/contents/`)
    .query({search: 'mancave'} as SearchQuery)
    .expect(StatusCode.unauthorized)

    await request
      .delete(`/api/contents/${productId}`)
      .expect(StatusCode.unauthorized)
  });
  });
});