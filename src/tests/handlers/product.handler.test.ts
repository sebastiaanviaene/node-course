import { MikroORM, RequestContext } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { expect } from 'chai'
import ormConfig from '../../orm.config';
import { Product, User } from '../../entities/entityIndex';
import { createProduct, getProduct, getProductList, updateProduct, deleteProduct } from '../../controllers/products/handlers/product.handlers';
import { initDB, initProducts, initUsers } from '../helpers/helperIndex';
import {v4} from 'uuid';
import { ProductBody } from '../../contracts/product.body';

describe('Handler tests', () => {
    describe('Product Tests', () => {
      let orm: MikroORM<PostgreSqlDriver>;
      let users: User[];
      let products: Product[];

        before(async () => {
            orm = await MikroORM.init(ormConfig);
        })
        
        beforeEach(async () => {
            await initDB(orm);
            users = await initUsers(orm);
            products = await initProducts(orm);
        });

        it('should create a product', async () => {
            const body = {
                name: 'cheese',
                size: 10
            } as ProductBody;
            await RequestContext.createAsync(orm.em.fork(), async () => {
            const res = await createProduct('user_1', body);
            expect(res.name === 'cheese').true;
            })
        });

        it('should get a product by id', async () => {
            const [{ id }] = products;
            await RequestContext.createAsync(orm.em.fork(), async () => {
            const res = await getProduct(`${id}`);
            expect(res.id == id).true;
            expect(res.name == 'tomato').true;
            });
        })

        it('should not get a product by a wrong id', async () => {
            let res: any;
            await RequestContext.createAsync(orm.em.fork(), async () => {
              try {
                res = getProduct(v4());
              } catch (error) {
                expect(error.code).equal(404);
              }
            });
        })

        it('should get all products', async () => {
            await RequestContext.createAsync(orm.em.fork(), async () => {
            const [res, total] = await getProductList(null);
            expect(res.every(x => ['tomato', 'chonk', 'tea', 'snack'].includes(x.name))).true;
            expect(total === products.length).true;
            })
        })

        it('should search products', async () => {
            await RequestContext.createAsync(orm.em.fork(), async () => {
            const [res, total] = await getProductList({search: 'snack'});
            expect(res.every(x => [5].includes(x.size))).true;
            })
        })

        it('should update a product by id', async () => {
            const [{id}] = products;
            const body = {
                size: 30
            } as Product;
            await RequestContext.createAsync(orm.em.fork(), async () => {
                const res = await updateProduct(`${id}`, body);
                expect(res.name === 'tomato');
                const newProduct = await getProduct(id);
                expect(newProduct.size).equals(30);
            });
        })

        it('should not update a product by a wrong id', async () => {
            const body = {
                size: 65
            } as Product;
            await RequestContext.createAsync(orm.em.fork(), async () => {
                try {
                    await updateProduct(`${v4()}`, body);
                }
                catch (error){
                    expect(error.code).equal(404)
                }
            });
        })

        it('should delete a product by id', async () => {
            const [{id}] = products;
            await RequestContext.createAsync(orm.em.fork(), async () => {
              const initialCount = await orm.em.count(Product);
              await deleteProduct(id);
              const finalCount = await orm.em.count(Product)
              expect(finalCount === initialCount-1).true;
            })
        });

        it('should not delete a product by a wrong id', async () => {
            await RequestContext.createAsync(orm.em.fork(), async () => {
              const initialCount = await orm.em.count(Product);
              try {
                await deleteProduct(v4());
              }
              catch (error) {
                expect(error.code).equal(404)
              }
              const finalCount = await orm.em.count(Product)
              expect(finalCount === initialCount).true;
            })
        });
    });
});