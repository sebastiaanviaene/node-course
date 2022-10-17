
import { RequestContext } from "@mikro-orm/core";
import { UserBody } from "../../../contracts/user.body";
import { User } from "../../../entities/user.entity";


export const createUser = async (userBody: UserBody) => {
   
  const em = RequestContext.getEntityManager();
  const user = em.create(User, userBody);
  await em.persistAndFlush(user);

  return user;
};

