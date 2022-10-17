import { MikroORM } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { Fridge } from "../../entities/fridge.entity";
const getUuid = require('uuid-by-string');


const fridgeFixtures: Fridge[] = [
    {
      id: getUuid('fridge_mancave'),
      location: 'mancave',
      capacity: 50
    } as Fridge,
    {
      id: getUuid('fridge_bedroom'),
      location: 'bedroom',
      capacity: 12
    } as Fridge
  ];

  export const initFridges = (async (orm: MikroORM<PostgreSqlDriver>) => {
    let fridges: Fridge[];
    const em = orm.em.fork();
    fridges = fridgeFixtures.map((x) => em.create(Fridge, x));
    await em.persistAndFlush(fridges);
    return fridges;
  })