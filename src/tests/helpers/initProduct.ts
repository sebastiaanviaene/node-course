import { MikroORM, UuidType } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { Product } from "../../entities/product.entity";
const getUuid = require('uuid-by-string');

const productFixtures: Product[] = [
    {
        id: getUuid('product_tomato'),
        name: 'tomato',
        owner: getUuid('user_1'),
        size: 12
    } as Product,
    {
        id: getUuid('product_chonk'),
        name: 'chonk',
        owner: getUuid('user_2'),
        size: 63
    } as Product,
    {
        id: getUuid('product_tea'),
        name: 'tea',
        owner: getUuid('user_1'),
        size: 7
    } as Product,
    {
        id: getUuid('product_snack'),
        name: 'snack',
        owner: getUuid('user_2'),
        size: 5
      } as Product
  ];

  export const initProducts = (async (orm: MikroORM<PostgreSqlDriver>) => {
    let products: Product[];
    const em = orm.em.fork();
    products = productFixtures.map((x) => em.create(Product, x));
    await em.persistAndFlush(products);
    return products;
  })