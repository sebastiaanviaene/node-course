// src/tests/integration/user.integration.test.ts
import { MikroORM, t } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { StatusCode } from "@panenco/papi";
import { expect } from "chai";
import supertest from "supertest";
import { App } from "../../app";
import { LoginBody } from "../../contracts/login.body";
import { Fridge } from "../../entities/fridge.entity";
import { User } from "../../entities/user.entity";

// bootstrapping the server with supertest
describe('Integration tests', () => {

    describe('Fridge Tests', () => {
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

    it('should CRUD fridges', async () => {

      //create new user

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
      const token = loginResponse.token;

      //create fridge
      const { body: createFridgeResponse } = await request
      .post(`/api/fridges`)
      .send({
        location: 'mancave',
        capacity: 50
      } as Fridge)
      .set('x-auth',token)
      .expect(StatusCode.created);
      expect(createFridgeResponse.location === 'mancave').true;
      expect(createFridgeResponse.capacity === 50);

      //get fridge by id
      const { body: getResponse } = await request
      .get(`/api/fridges/${createFridgeResponse.id}`)
      .set('x-auth',token)
      .expect(200);
      expect(createFridgeResponse.name === getResponse.name).true;

      //updating location of fridge
      const testLocation = 'sadLonelyBasement'
      const { body : updateResponse} = await request
      .patch(`/api/fridges/${createFridgeResponse.id}`)
      .set('x-auth',token)
      .send({
        location: testLocation
      } as Fridge)
      .expect(200)
      
      expect(updateResponse.location === testLocation);
      expect(updateResponse.id === createFridgeResponse.id);
      expect(updateResponse.capacity === createFridgeResponse.capacity)
      
      //deleting fridge
      await request
      .delete(`/api/fridges/`+createFridgeResponse.id)
      .set('x-auth',token)
      .expect(StatusCode.noContent)
      
      await request
      .get(`/api/fridges/`+createFridgeResponse.id)
      .set('x-auth',token)
      .expect(StatusCode.notFound);


      });

    });
  });