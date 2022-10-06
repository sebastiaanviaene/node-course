// src/tests/integration/user.integration.test.ts
import { MikroORM } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { getAccessTokenData, StatusCode } from "@panenco/papi";
import { expect } from "chai";
import supertest from "supertest";
import { App } from "../../app";
import { LoginBody } from "../../contracts/login.body";
import { Fridge } from "../../entities/fridge.entity";
import { Product } from "../../entities/product.entity";
import { User } from "../../entities/user.entity";
import { v4 } from 'uuid';
import { Fridgecontent } from "../../entities/fridgecontent.entity";
import { SearchQuery } from "../../contracts/search.query";

// bootstrapping the server with supertest
describe('Integration tests', () => {
  
  describe('Fridgecontent Tests', () => {
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

  it('should CRUD fridgecontents', async () => {

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

    //create a product
    const { body: productTomato } = await request
    .post(`/api/products`)
    .send({
      name: 'tomato',
      size: 12
    } as Product)
    .set('x-auth',user0token)
    .expect(StatusCode.created);
    expect(productTomato.owner === getAccessTokenData(user0token,'secretSecretStuff').userId).true


    //create a product
    const { body: productChonk } = await request
    .post(`/api/products`)
    .send({
      name: 'chonk',
      size: 63
    } as Product)
    .set('x-auth',user1token)
    .expect(StatusCode.created);
    expect(productChonk.owner === getAccessTokenData(user1token,'secretSecretStuff').userId).true

    //create a fridge
      const { body: fridgeBedroom } = await request
      .post(`/api/fridges`)
      .send({
        location: 'bedroom',
        capacity: 12
      } as Fridge)
      .set('x-auth',user0token)
      .expect(StatusCode.created);
      expect(fridgeBedroom.location === 'bedroom').true;
      expect(fridgeBedroom.capacity === 12);

      const { body: fridgeMancave } = await request
      .post(`/api/fridges`)
      .send({
        location: 'mancave',
        capacity: 50
      } as Fridge)
      .set('x-auth',user0token)
      .expect(StatusCode.created);
      expect(fridgeMancave.location === 'mancave').true;
      expect(fridgeMancave.capacity === 50);

      //put non-existing product in fridge
      await request
      .post(`/api/fridgecontents`)
      .send({
        product: {
          id: v4(),
          name: productTomato.name,
          owner: productTomato.owner,
          size: productTomato.size
        },
        fridge: fridgeBedroom
      } as Fridgecontent)
      .set('x-auth',user0token)
      .expect(StatusCode.notFound)

      //put product in non-existing fridge
      await request
      .post(`/api/fridgecontents`)
      .send({
        product: productTomato,
        fridge: {
          id: v4(),
          location: fridgeBedroom.location,
          capacity: fridgeBedroom.capacity
        }
      } as Fridgecontent)
      .set('x-auth',user0token)
      .expect(StatusCode.notFound)

      //trying to put a product in a fridge that isnt owned by user
      await request
      .post(`/api/fridgecontents`)
      .send({
        product: productTomato,
        fridge: fridgeBedroom
      } as Fridgecontent)
      .set('x-auth',user1token)
      .expect(StatusCode.unauthorized)

      //putting product in fridge
      const {body: createContentResponse} = await request
      .post(`/api/fridgecontents`)
      .send({
        product: productTomato,
        fridge: fridgeBedroom
      } as Fridgecontent)
      .set('x-auth',user0token)
      .expect(201)
      const res = createContentResponse.fridge;
      expect(createContentResponse.fridge.id).equals(fridgeBedroom.id);
      expect(createContentResponse.product.id).equals(productTomato.id);

      //trying to put a product in a fridge that doesnt has the capacity
      await request
      .post(`/api/fridgecontents`)
      .send({
        product: productChonk,
        fridge: fridgeBedroom
      } as Fridgecontent)
      .set('x-auth',user1token)
      .expect(StatusCode.forbidden)

      //trying to put a product in thats already stored in a fridge
      await request
      .post(`/api/fridgecontents`)
      .send({
        product: productTomato,
        fridge: fridgeMancave
      } as Fridgecontent)
      .set('x-auth',user0token)
      .expect(StatusCode.forbidden)

    //get content by productId as owner
    const { body: getContentResponse } = await request
    .get(`/api/fridgecontents/${createContentResponse.product.id}`)
    .set('x-auth',user0token)
    .expect(200);
    expect(createContentResponse.name === getContentResponse.name).true;

    //get product by id as not the owner
    const { body: getContentResponse2 } = await request
    .get(`/api/fridgecontents/${createContentResponse.product.id}`)
    .set('x-auth',user1token)
    .expect(200);
    expect(createContentResponse.name === getContentResponse2.name).true;

    //get list of users stored contents
    const {body: getListResponse} = await request
    .get(`/api/fridgecontents/`)
    .set('x-auth',user1token)
    .query({search: 'mancave'} as SearchQuery)
    .expect(200)
    expect(getListResponse.count===0).true

    // //search with location that doesnt have contents
    const {body: getListResponse2} = await request
    .get(`/api/fridgecontents/`)
    .set('x-auth',user0token)
    .query({search: 'mancave'} as SearchQuery)
    .expect(200)
    expect(getListResponse2.count===0).true
    
    // //getList without search query
    const {body: getListResponse3} = await request
    .get(`/api/fridgecontents/`)
    .set('x-auth',user0token)
    .expect(200)
    expect(getListResponse3.count===1).true

    // //getList with search query about product
    const {body: getListResponse4} = await request
    .get(`/api/fridgecontents/`)
    .set('x-auth',user0token)
    .query({search: 'tomato'} as SearchQuery)
    .expect(200)
    expect(getListResponse4.count===1).true


    //create some more products for future use
    const { body: productTea } = await request
    .post(`/api/products`)
    .send({
      name: 'tea',
      size: 7
    } as Product)
    .set('x-auth',user1token)
    .expect(StatusCode.created);

    const { body: productSnack } = await request
    .post(`/api/products`)
    .send({
      name: 'snack',
      size: 5
    } as Product)
    .set('x-auth',user1token)
    .expect(StatusCode.created);

    //try putting item in fully stocked fridge
    await request
      .post(`/api/fridgecontents`)
      .send({
        product: productTea,
        fridge: fridgeBedroom
      } as Fridgecontent)
      .set('x-auth',user1token)
      .expect(StatusCode.forbidden)

    //put products in fridge
    await request
      .post(`/api/fridgecontents`)
      .send({
        product: productTea,
        fridge: fridgeMancave
      } as Fridgecontent)
      .set('x-auth',user1token)
      .expect(201)
    
    await request
      .post(`/api/fridgecontents`)
      .send({
        product: productSnack,
        fridge: fridgeMancave
      } as Fridgecontent)
      .set('x-auth',user1token)
      .expect(201)

    //deleting a product should also remove it from the fridge
    await request
      .delete(`/api/products/${productTea.id}`)
      .set('x-auth',user1token)
      .expect(204)
    
    await request
      .get(`/api/fridgecontents/${productTea.id}`)
      .set('x-auth',user1token)
      .expect(404)

    //deleting a fridge should also remove all contents
    await request
      .delete(`/api/fridges/${fridgeMancave.id}`)
      .set('x-auth',user1token)
      .expect(204)

    await request
      .get(`/api/fridgecontents/${productSnack.id}`)
      .set('x-auth',user1token)
      .expect(404)

    //trying to delete content as not the owner -> should not be allowed
    await request
      .delete(`/api/fridgecontents/${productTomato.id}`)
      .set('x-auth',user1token)
      .expect(StatusCode.unauthorized)

    // //delete content as the owner
    await request
      .delete(`/api/fridgecontents/${productTomato.id}`)
      .set('x-auth',user0token)
      .expect(StatusCode.noContent)
    
    });

  });
  });