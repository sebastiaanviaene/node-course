import { MikroORM } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";

export const initDB = (async (orm: MikroORM<PostgreSqlDriver>) => {
  await orm.em.execute(`DROP SCHEMA public CASCADE; CREATE SCHEMA public`);
  await orm.getMigrator().up();
})  