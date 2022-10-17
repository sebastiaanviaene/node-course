// src/tests/integration/user.integration.test.ts
import { MikroORM, t } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { StatusCode } from "@panenco/papi";
import { expect } from "chai";
import supertest from "supertest";
import { App } from "../../app";
import { LoginBody } from "../../contracts/login.body";
import { Recipe, User } from "../../entities/entityIndex";
import { initDB, initRecipes, initUsers } from "../helpers/helperIndex";

// bootstrapping the server with supertest
describe('Integration tests', () => {

    describe('Recipe Tests', () => {
      let request: supertest.SuperTest<supertest.Test>;
      let orm: MikroORM<PostgreSqlDriver>;
      let users: User[];
      let recipes: Recipe[];

      before(async () => {
        const app = new App();
        await app.createConnection();
        orm = app.orm;
        request = supertest(app.host);
      })
      
      beforeEach(async () => {
        await initDB(orm);
        users = await initUsers(orm);
        recipes = await initRecipes(orm);
      });

    it('should CRUD recipes', async () => {

      const { body: loginResponse } = await request
      .post(`/api/auth/tokens`)
      .send({
        email: 'test-user+1@panenco.com',
        password: 'password1'
      } as LoginBody);
      const token = loginResponse.token;

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

      const { body: getResponse } = await request
      .get(`/api/recipes/${createRecipeResponse.id}`)
      .set('x-auth',token)
      .expect(200);
      expect(createRecipeResponse.name === getResponse.name).true;

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
      
      await request
      .delete(`/api/recipes/`+createRecipeResponse.id)
      .set('x-auth',token)
      .expect(StatusCode.noContent)

    });

    it('should not CRUD recipes unauthorized', async () => {

      await request
      .post(`/api/recipes`)
      .send({
        name: 'ei',
        description: 'eitje',
        ingredients: 'ei,zout'
      } as Recipe)
      .expect(StatusCode.unauthorized);

      const [{id}] = recipes
      const { body: getResponse } = await request
      .get(`/api/recipes/${id}`)
      .expect(StatusCode.unauthorized);

      await request
      .patch(`/api/recipes/${id}`)
      .send({
        ingredients: 'twee ei'
      } as Recipe)
      .expect(StatusCode.unauthorized)
      
      await request
      .delete(`/api/recipes/`+id)
      .expect(StatusCode.unauthorized)
    });

  });
});