// src/tests/integration/user.integration.test.ts
import { MikroORM, t } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { StatusCode } from "@panenco/papi";
import { expect } from "chai";
import supertest from "supertest";
import { App } from "../../app";
import { LoginBody } from "../../contracts/login.body";
import { Fridge } from "../../entities/entityIndex";
import { initDB, initFridges, initUsers } from "../helpers/helperIndex";

// bootstrapping the server with supertest
describe('Integration tests', () => {

    describe('Fridge Tests', () => {
      let request: supertest.SuperTest<supertest.Test>;
      let orm: MikroORM<PostgreSqlDriver>;
      let fridges: Fridge[];

      before(async () => {
        const app = new App();
        await app.createConnection();
        orm = app.orm;
        request = supertest(app.host);
      })
      
      beforeEach(async () => {
        await initDB(orm);
        await initUsers(orm);
        fridges = await initFridges(orm);
      });

    it('should CRUD fridges', async () => {

      const { body: loginResponse } = await request
      .post(`/api/auth/tokens`)
      .send({
        email: 'test-user+1@panenco.com',
        password: 'password1'
      } as LoginBody);
      const token = loginResponse.token;

      //create fridge
      const { body: createFridgeResponse } = await request
      .post(`/api/fridges`)
      .send({
        location: 'veranda',
        capacity: 30
        } as Fridge)
      .set('x-auth',token)
      .expect(StatusCode.created);
      expect(createFridgeResponse.location === 'veranda').true;
      expect(createFridgeResponse.capacity === 30);

      //get fridge by id
      const [{id}] = fridges;
      const { body: getResponse } = await request
      .get(`/api/fridges/${id}`)
      .set('x-auth',token)
      .expect(200);
      expect(createFridgeResponse.name === getResponse.name).true;

      //updating location of fridge
      const { body : updateResponse} = await request
      .patch(`/api/fridges/${id}`)
      .set('x-auth',token)
      .send({
        location: 'sadLonelyBasement'
      } as Fridge)
      .expect(200)
      expect(updateResponse.location === 'sadLonelyBasement');
      expect(updateResponse.capacity === fridges[0].capacity)
      
      //deleting fridge
      await request
      .delete(`/api/fridges/`+id)
      .set('x-auth',token)
      .expect(StatusCode.noContent)
    });

    it('should not CRUD fridges without authorization', async () => {

      //create fridge
      await request
      .post(`/api/fridges`)
      .send({
        location: 'veranda',
        capacity: 30
        } as Fridge)
      .expect(StatusCode.unauthorized);

      //get fridge by id
      const [{id}] = fridges;
      await request
      .get(`/api/fridges/${id}`)
      .expect(StatusCode.unauthorized);

      //updating location of fridge
      await request
      .patch(`/api/fridges/${id}`)
      .send({
        location: 'sadLonelyBasement'
      } as Fridge)
      .expect(StatusCode.unauthorized)
      
      //deleting fridge
      await request
      .delete(`/api/fridges/`+id)
      .expect(StatusCode.unauthorized)
    });
  });
});