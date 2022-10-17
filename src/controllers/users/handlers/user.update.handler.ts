// update.handler.ts
import { RequestContext } from '@mikro-orm/core';
import { NotFound } from '@panenco/papi';
import { UserBody } from '../../../contracts/user.body';
import { User } from '../../../entities/user.entity';

export const updateUser = async (userId: string, userBody: UserBody) => {

  const em = RequestContext.getEntityManager();
  const user = await em.findOneOrFail(User,{id: userId});
  user.assign(userBody);
  await em.flush();
  return user; 
};