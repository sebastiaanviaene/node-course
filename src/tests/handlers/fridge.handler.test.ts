import { MikroORM, RequestContext } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { expect } from 'chai'
import ormConfig from '../../orm.config';
import { Fridge } from '../../entities/entityIndex';
import { createFridge, getFridge, getFridgeList, updateFridge, deleteFridge } from '../../controllers/fridges/handlers/fridge.handlers';
import { initDB, initFridges } from '../helpers/helperIndex';
import {v4} from 'uuid';
import { FridgeBody } from '../../contracts/fridge.body';

describe('Handler tests', () => {
    describe('Fridge Tests', () => {
      let orm: MikroORM<PostgreSqlDriver>;
      let fridges: Fridge[];

        before(async () => {
            orm = await MikroORM.init(ormConfig)
        })
        
        beforeEach(async () => {
            await initDB(orm);
            fridges = await initFridges(orm)
        });

        it('should create a fridge', async () => {
            const body = {
                location: 'veranda',
                capacity: 30
            } as FridgeBody;
            await RequestContext.createAsync(orm.em.fork(), async () => {
            const res = await createFridge(body);
            expect(res.location === 'veranda').true;
            })
        });

        it('should get a fridge by id', async () => {
            const [{ id }] = fridges;
            await RequestContext.createAsync(orm.em.fork(), async () => {
            const res = await getFridge(`${id}`);
            expect(res.id == id).true;
            expect(res.location == 'mancave').true;
            });
        })

        it('should not get a fridge by a wrong id', async () => {
            let res: any;
            await RequestContext.createAsync(orm.em.fork(), async () => {
              try {
                res = getFridge(v4());
              } catch (error) {
                expect(error.code).equal(404);
              }
            });
        })

        it('should get all fridges', async () => {
            await RequestContext.createAsync(orm.em.fork(), async () => {
            const [res, total] = await getFridgeList(null);
            expect(res.every(x => ['bedroom', 'mancave'].includes(x.location))).true;
            expect(total === fridges.length).true;
            })
        })

        it('should search fridges', async () => {
            await RequestContext.createAsync(orm.em.fork(), async () => {
            const [res, total] = await getFridgeList({search: 'bedroom'});
            expect(res.every(x => ['bedroom'].includes(x.location))).true;
            })
        })

        it('should update a fridge by id', async () => {
            const [{id}] = fridges;
            const body = {
                capacity: 65
            } as Fridge;
            await RequestContext.createAsync(orm.em.fork(), async () => {
                const res = await updateFridge(`${id}`, body);
                expect(res.location === 'mancave');
                const newfridge = await getFridge(id);
                expect(newfridge.capacity).equals(65);
            });
        })

        it('should not update a fridge by a wrong id', async () => {
            const body = {
                capacity: 65
            } as Fridge;
            await RequestContext.createAsync(orm.em.fork(), async () => {
                try {
                    await updateFridge(`${v4()}`, body);
                }
                catch (error){
                    expect(error.code).equal(404)
                }
            });
        })

        it('should delete a fridge by id', async () => {
            const [{id}] = fridges;
            await RequestContext.createAsync(orm.em.fork(), async () => {
              const initialCount = await orm.em.count(Fridge);
              await deleteFridge(id);
              const finalCount = await orm.em.count(Fridge)
              expect(finalCount === initialCount-1).true;
            })
        });

        it('should not delete a fridge by a wrong id', async () => {
            await RequestContext.createAsync(orm.em.fork(), async () => {
              const initialCount = await orm.em.count(Fridge);
              try {
                await deleteFridge(v4());
              }
              catch (error) {
                expect(error.code).equal(404)
              }
              const finalCount = await orm.em.count(Fridge)
              expect(finalCount === initialCount).true;
            })
        });
    });
});