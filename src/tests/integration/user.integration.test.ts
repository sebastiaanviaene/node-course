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
    describe('User Tests', () => {
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

    it('should CRUD users', async () => {

      //create new user
      const { body: createResponse } = await request
      .post(`/api/users`)
      .send({
        name: 'user0',
        email: 'user0@email.com',
        password: 'weakpassword'
      } as User)
      .set('x-auth','api-key')
      .expect(StatusCode.created);

      //login with incorrect email
      await request
      .post(`/api/auth/tokens`)
      .send({
        email: 'user@email.com',
        password: 'weakpassword'
      } as LoginBody)
      .expect(StatusCode.unauthorized);

      //login with incorrect password
      await request
      .post(`/api/auth/tokens`)
      .send({
        email: 'user0@email.com',
        password: 'weakassword'
      } as LoginBody)
      .expect(StatusCode.unauthorized);

      //correct login should generate a token
      const { body: loginResponse } = await request
      .post(`/api/auth/tokens`)
      .send({
        email: 'user0@email.com',
        password: 'weakpassword'
      } as LoginBody);
      const token = loginResponse.token;

      const duplicateEM = orm.em.fork();
      const testUser = duplicateEM.findOneOrFail(User, {email: { $ilike: `%${createResponse.email}%`}});
      expect(testUser);

      //get user by id
      const { body: getResponse } = await request
      .get(`/api/users/${createResponse.id}`)
      .set('x-auth',token)
      .expect(200);

      expect(createResponse.name === getResponse.name).true;

      
      //updating name of user
      const testName = 'user1'
      const { body : updateResponse} = await request
      .patch(`/api/users/${createResponse.id}`)
      .set('x-auth',token)
      .send({
        name: testName
      } as User)
      .expect(200)
      
      expect(updateResponse.name === testName);
      expect(updateResponse.id === createResponse.id);
      expect(updateResponse.password === undefined)
      
      //deleting user
      await request
      .delete(`/api/users/`+getResponse.id)
      .set('x-auth',token)
      .expect(StatusCode.noContent)
      
      //checking that deleted user is gone by failed get - invalid id
      await request
      .get(`/api/users/`+getResponse.id)
      .set('x-auth',token)
      .expect(StatusCode.notFound);


      });

    });
  });