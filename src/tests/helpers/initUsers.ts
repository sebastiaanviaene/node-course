import { MikroORM } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { User } from "../../entities/user.entity";
const getUuid = require('uuid-by-string');

const userFixtures: User[] = [
    {
      id: getUuid('user_1'),
      name: 'test1',
      email: 'test-user+1@panenco.com',
      password: 'password1',
    } as User,
    {
      id: getUuid('user_2'),
      name: 'test2',
      email: 'test-user+2@panenco.com',
      password: 'password2',
    } as User,
  ];

  export const initUsers = (async (orm: MikroORM<PostgreSqlDriver>) => {
    let users: User[];
    const em = orm.em.fork();
    users = userFixtures.map((x) => em.create(User, x));
    await em.persistAndFlush(users);
    return users;
  })