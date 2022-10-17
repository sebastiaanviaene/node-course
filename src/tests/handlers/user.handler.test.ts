import { MikroORM, RequestContext } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { expect } from 'chai'
import { createUser, deleteUser, getUser, getUserList, updateUser } from '../../controllers/users/handlers/user.handlers';
import { User } from '../../entities/entityIndex';
import ormConfig from '../../orm.config';
import { v4 } from 'uuid';
import {initDB, initUsers} from '../helpers/helperIndex'

describe('Handler tests', () => {
    describe('User Tests', () => {
      let orm: MikroORM<PostgreSqlDriver>;
      let users: User[];

      before(async () => {
        orm = await MikroORM.init(ormConfig)
      })

      beforeEach(async () => {
        await initDB(orm);
        users = await initUsers(orm);
      });

      it('should get users', async () => {
        await RequestContext.createAsync(orm.em.fork(), async () => {
          const [res, total] = await getUserList(null);
          expect(res.every(x => ['test1', 'test2'].includes(x.name))).true
        })
      });


      it('should search users', async () => {
        await RequestContext.createAsync(orm.em.fork(), async () => {
          const [res, total] = await getUserList({search: 'test1'});
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
          const res = await createUser(body);
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
        const [{ id }] = users;
        await RequestContext.createAsync(orm.em.fork(), async () => {
          const res = await getUser(`${id}`);
          expect(res.id == id).true;
          expect(res.name == 'test1').true;
        });
      });

      it('should get fail to get user with nonexisting id', async () => {
        let res: any;
        await RequestContext.createAsync(orm.em.fork(), async () => {
          try {
            res = getUser(v4());
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
          const res = await updateUser(`${testId}`, body);

          expect(res.name === 'test3');
          const newUser = await getUser(testId);
          expect(newUser.name === 'test3').true;
        });
      });

    });
});