import { RequestContext } from "@mikro-orm/core";
import { FridgeBody } from "../../../contracts/fridge.body";
import { Fridge } from "../../../entities/entityIndex";


export const createFridge = async (fridgeBody: FridgeBody) => {
   
  const em = RequestContext.getEntityManager();
  const fridge = em.create(Fridge, fridgeBody);
  await em.persistAndFlush(fridge);

  return fridge;
};

