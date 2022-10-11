import { MikroORM, RequestContext } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { expect } from 'chai'
import { NextFunction, Request, Response } from 'express';
import { Authorized } from 'routing-controllers';
import { App } from '../../app';
import { create } from '../../controllers/users/handlers/user.create.handler';
import { deleteUser } from '../../controllers/users/handlers/user.delete.handler';
import { get } from '../../controllers/users/handlers/user.get.handler';
import { getList } from '../../controllers/users/handlers/user.getList.handler';
import { update } from '../../controllers/users/handlers/user.update.handler';
import { User } from '../../entities/user.entity';
import ormConfig from '../../orm.config';
import { v4 } from 'uuid';
import { emit } from 'process';

const userFixtures: User[] = [
    {
      name: 'test1',
      email: 'test-user+1@panenco.com',
      password: 'password1',
    } as User,
    {
      name: 'test2',
      email: 'test-user+2@panenco.com',
      password: 'password2',
    } as User,
  ];
  
describe('Handler tests', () => {
    describe('User Tests', () => {
      let orm: MikroORM<PostgreSqlDriver>;
      let users: User[];

      before(async () => {
        orm = await MikroORM.init(ormConfig)
      })

      beforeEach(async () => {
        await orm.em.execute(`DROP SCHEMA public CASCADE; CREATE SCHEMA public`);
        await orm.getMigrator().up();
        const em = orm.em.fork();
        users = userFixtures.map((x) => em.create(User, x));
        await em.persistAndFlush(users);
      });

      it('should get users', async () => {
        await RequestContext.createAsync(orm.em.fork(), async () => {
          const [res, total] = await getList(null);
          expect(res.some((x) => x.name === 'test1')).true && expect(res.some((x) => x.name === 'test2'));
        })
      });


      it('should search users', async () => {
        await RequestContext.createAsync(orm.em.fork(), async () => {
          const [res, total] = await getList({search: 'test1'});
          expect(res.some((x) => x.name === 'test1')).true;
        })
      });

      it('should create a user', async () => {
        const body = {
            name: 'test3', 
            email: 'test-user+3@panenco.com',
            password: 'password3'
            } as User;
        await RequestContext.createAsync(orm.em.fork(), async () => {
          const res = await create(body);
          expect(res.name === 'test3').true;
        })
      });

      it('should delete a user by id', async () => {
        await RequestContext.createAsync(orm.em.fork(), async () => {
          const initialCount = await orm.em.count(User);
          await deleteUser(users[0].id);
          const finalCount = await orm.em.count(User)
          expect(finalCount === initialCount-1).true;
        })
      });

      //abundant
      //fully based on whether 'get' works properly for invalid id
      it('should give an error if user to delete does not exist', async () => {
        await RequestContext.createAsync(orm.em.fork(), async () => {
          try {
            deleteUser(v4());
          } catch (error) {
            expect(error.message).equal('User not found');
          }
        });
      });

      it('should get user by id', async () => {
        await RequestContext.createAsync(orm.em.fork(), async () => {
          const res = await get(`${users[0].id}`);
          expect(res.id == users[0].id).true;
          expect(res.name == 'test1').true;
        });
      });

      it('should get fail to get user with nonexisting id', async () => {
        let res: any;
        await RequestContext.createAsync(orm.em.fork(), async () => {
          try {
            res = get(v4());
          } catch (error) {
            expect(error.message).equal('User not found');
          }
        });
      });

      it('should update a user by id', async () => {
        const testId = users[0].id;
        const body = {
            name: 'test3'
            } as User;
        await RequestContext.createAsync(orm.em.fork(), async () => {
          const res = await update(`${testId}`, body);

          expect(res.name === 'test3');
          const newUser = await get(testId);
          expect(newUser.name === 'test3').true;
        });
      });

    });
});