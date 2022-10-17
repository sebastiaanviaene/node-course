import { MikroORM } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { Content } from "../../entities/content.entity";
import { initFridges } from "./initFridges";
import { initProducts } from "./initProduct";


export const initContents = (async (orm: MikroORM<PostgreSqlDriver>) => {
    const products = await initProducts(orm);
    const fridges = await initFridges(orm);
    const contentFixtures =
    [
        {
            fridge: fridges[1],
            product: products[0]
        } as Content,
        {
            fridge: fridges[0],
            product: products[3]
        }
    ]
    let contents: Content[];
    const em = orm.em.fork();
    contents = contentFixtures.map((x) => em.create(Content, x));
    await em.persistAndFlush(contents);
    return contents;
  })