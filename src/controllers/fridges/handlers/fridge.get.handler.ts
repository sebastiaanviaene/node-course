import { RequestContext } from "@mikro-orm/core";
import { Fridge } from "../../../entities/entityIndex";

export const getFridge = (fridgeId: string) => {
    
    const em = RequestContext.getEntityManager();
    const recipe = em.findOneOrFail(Fridge, {id: fridgeId});
    return recipe;
  };