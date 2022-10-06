import { RequestContext } from "@mikro-orm/core";
import { NotFound } from "@panenco/papi";
import { Fridge } from "../../../entities/fridge.entity";

export const get = (id: string) => {
    
    const em = RequestContext.getEntityManager();
    const recipe = em.findOneOrFail(Fridge, {id});
    if (!recipe) {
        throw new NotFound('fridgeNotFound', 'Fridge not found');
    }
    return recipe;
    

  };