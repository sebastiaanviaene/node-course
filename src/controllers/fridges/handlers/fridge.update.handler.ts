// update.handler.ts
import { RequestContext } from '@mikro-orm/core';
import { NotFound } from '@panenco/papi';
import { FridgeBody } from '../../../contracts/fridge.body';
import { Fridge } from '../../../entities/fridge.entity';

export const update = async (id: string, body: FridgeBody) => {

  const em = RequestContext.getEntityManager();
  const fridge = await em.findOneOrFail(Fridge,{id});

  if (!fridge) {
    throw new NotFound('fridgeNotFound', 'Fridge not found');
  }

  fridge.assign(body);
  await em.flush();
  return fridge; 
};