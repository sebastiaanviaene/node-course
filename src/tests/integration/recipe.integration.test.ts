// src/tests/integration/user.integration.test.ts
import { MikroORM, t } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { StatusCode } from "@panenco/papi";
import { expect } from "chai";
import supertest from "supertest";
import { App } from "../../app";
import { LoginBody } from "../../contracts/login.body";
import { Recipe } from "../../entities/recipe.entity";
import { User } from "../../entities/user.entity";

// bootstrapping the server with supertest
describe('Integration tests', () => {

    describe('Recipe Tests', () => {
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
      const { body: createRecipeResponse } = await request
      .post(`/api/recipes`)
      .send({
        name: 'ei',
        description: 'eitje',
        ingredients: 'ei,zout'
      } as Recipe)
      .set('x-auth',token)
      .expect(StatusCode.created);
      expect(createRecipeResponse.name === 'ei').true;
      expect(createRecipeResponse.description === 'eitje').true;
      expect(createRecipeResponse.ingredients).equals('ei,zout');

      //get recipe by id
      const { body: getResponse } = await request
      .get(`/api/recipes/${createRecipeResponse.id}`)
      .set('x-auth',token)
      .expect(200);
      expect(createRecipeResponse.name === getResponse.name).true;

      //updating ingredients of recipe
      const testRecipe = 'twee ei'
      const { body : updateResponse} = await request
      .patch(`/api/recipes/${createRecipeResponse.id}`)
      .set('x-auth',token)
      .send({
        ingredients: testRecipe
      } as Recipe)
      .expect(200)
      
      expect(updateResponse.location === testRecipe);
      expect(updateResponse.id === createRecipeResponse.id);
      expect(updateResponse.capacity === createRecipeResponse.capacity)
      
      //deleting fridge
      await request
      .delete(`/api/recipes/`+createRecipeResponse.id)
      .set('x-auth',token)
      .expect(StatusCode.noContent)
      
      await request
      .get(`/api/recipes/`+createRecipeResponse.id)
      .set('x-auth',token)
      .expect(StatusCode.notFound);

      });

    });
  });