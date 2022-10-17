import { MikroORM, RequestContext } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { expect } from 'chai'
import ormConfig from '../../orm.config';
import { Content, Fridge, Product, User } from '../../entities/entityIndex';
import { createContent, getContent, getContentList, deleteContent } from '../../controllers/contents/handlers/content.handlers';
import { initContents, initDB, initFridges, initProducts, initUsers } from '../helpers/helperIndex';
import { v4 } from 'uuid';
import { ContentBody } from '../../contracts/content.body';
import { StatusCode } from '@panenco/papi';
import { deleteProduct } from '../../controllers/products/handlers/product.delete.handler';
import { deleteFridge } from '../../controllers/fridges/handlers/fridge.delete.handler';
const getUuid = require('uuid-by-string');

describe('Handler tests', () => {
    describe('Content Tests', () => {
      let orm: MikroORM<PostgreSqlDriver>;
      let users: User[];

        before(async () => {
            orm = await MikroORM.init(ormConfig);
        })
        
        beforeEach(async () => {
            await initDB(orm);
            users = await initUsers(orm);
            await initContents(orm);
        });

        it('should create a content', async () => {
            const fridgeId = getUuid('fridge_mancave');
            const productId = getUuid('product_tea');
            const body = {
                fridgeId,
                productId
            } as ContentBody;
            await RequestContext.createAsync(orm.em.fork(), async () => {
            const res = await createContent(body);
            expect(res.fridge.id === fridgeId).true;
            expect(res.product.id === productId).true;
            })
        });

        it('should not create a content if product does not exist', async () => {
            const fridgeId = getUuid('fridge_mancave');
            const productId = v4();
            const body = {
                fridgeId,
                productId
            } as ContentBody;
            await RequestContext.createAsync(orm.em.fork(), async () => {
                try {
                    await createContent(body);
                }
                catch (error) {
                    expect(error.code === StatusCode.notFound).true;
                }
            })
        });

        it('should not create a content if fridge does not exist', async () => {
            const fridgeId = v4()
            const productId = getUuid('product_tea')
            const body = {
                fridgeId,
                productId
            } as ContentBody;
            await RequestContext.createAsync(orm.em.fork(), async () => {
                try {
                    await createContent(body);
                }
                catch (error) {
                    expect(error.code === StatusCode.notFound).true;
                }
            })
        });

        it('should not create a content if product is already stored', async () => {
            const fridgeId = getUuid('fridge_mancave');
            const productId = getUuid('product_tomato');
            const body = {
                fridgeId,
                productId
            } as ContentBody;
            await RequestContext.createAsync(orm.em.fork(), async () => {
                try {
                    await createContent(body);
                }
                catch (error) {
                    expect(error.code === StatusCode.badRequest).true;
                }
            })
        });

        it('should not create a content if fridge is full', async () => {
            const fridgeId = getUuid('fridge_bedroom');
            const productId = getUuid('product_tea');
            const body = {
                fridgeId,
                productId
            } as ContentBody;
            await RequestContext.createAsync(orm.em.fork(), async () => {
                try {
                    await createContent(body);
                }
                catch (error) {
                    expect(error.code === StatusCode.badRequest).true;
                }
            })
        });

        it('should get a content by productId', async () => {
            const fridgeId = getUuid('fridge_mancave');
            const productId = getUuid('product_snack');
            await RequestContext.createAsync(orm.em.fork(), async () => {
            const res = await getContent(`${productId}`);
            expect(res.fridge.id === fridgeId).true;
            });
        })

        it('should not get a content by a wrong id', async () => {
            let res: any;
            await RequestContext.createAsync(orm.em.fork(), async () => {
              try {
                res = getContent(v4());
              } catch (error) {
                expect(error.code).equal(404);
              }
            });
        })

        it('should get all contents of a user', async () => {
            const [{id: userId}] = users
            await RequestContext.createAsync(orm.em.fork(), async () => {
            const [res, total] = await getContentList(userId, null);
            const populatedRes = res.map(async x => {
                const product = await x.product.init()
                return x})
            expect(populatedRes.every(async x => [userId].includes(((await x).product.owner)))).true;
            })
        })

        it('should search contents of a user', async () => {
            const [{id: userId}] = users
            await RequestContext.createAsync(orm.em.fork(), async () => {
            const [res, total] = await getContentList(userId, {search: 'tomato'});
            const populatedRes = res.map(async x => {
                const product = await x.product.init()
                return x})
            expect(populatedRes.every(async x => [userId].includes(((await x).product.owner)))).true;
            expect(populatedRes.every(async x => ['tomato'].includes(((await x).product.name)))).true;
            })
        })

        it('should delete a content by productId', async () => {
            const productId = getUuid('product_snack')
            await RequestContext.createAsync(orm.em.fork(), async () => {
              const initialCount = await orm.em.count(Content);
              await deleteContent(productId);
              const finalCount = await orm.em.count(Content)
              expect(finalCount === initialCount-1).true;
            })
        });

        it('should not delete a content by a wrong id', async () => {
            await RequestContext.createAsync(orm.em.fork(), async () => {
              const initialCount = await orm.em.count(Content);
              try {
                await deleteContent(v4());
              }
              catch (error) {
                expect(error.code).equal(404)
              }
              const finalCount = await orm.em.count(Content)
              expect(finalCount === initialCount).true;
            })
        });

        it('should delete a content if the product is deleted', async () => {
            const productId = getUuid('product_snack')
            await RequestContext.createAsync(orm.em.fork(), async () => {
              const initialCount = await orm.em.count(Content);
              await deleteProduct(productId);
              const finalCount = await orm.em.count(Content)
              expect(finalCount === initialCount-1).true;
            })
        })

        it('should delete all content of fridge if the fridge is deleted', async () => {
            const fridgeId = getUuid('fridge_mancave')
            const [initialRes, initialCount] = await orm.em.fork().findAndCount(Content, {fridge: fridgeId});
            expect(initialCount === 0).false
            await RequestContext.createAsync(orm.em.fork(), async () => {
              await deleteFridge(fridgeId);
            })
            const [res, count] = await orm.em.fork().findAndCount(Content, {fridge: fridgeId});
            expect(count === 0).true
        })
    });
});