// update.handler.ts
import { RequestContext } from '@mikro-orm/core';
import { FridgeBody } from '../../../contracts/fridge.body';
import { Fridge } from '../../../entities/entityIndex';

export const updateFridge = async (fridgeId: string, fridgeBody: FridgeBody) => {

  const em = RequestContext.getEntityManager();
  const fridge = await em.findOneOrFail(Fridge,{id: fridgeId});
  fridge.assign(fridgeBody);
  await em.flush();
  return fridge; 
};