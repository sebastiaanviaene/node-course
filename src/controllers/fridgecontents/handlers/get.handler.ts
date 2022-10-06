import { RequestContext } from "@mikro-orm/core";
import { NotFound } from "@panenco/papi";
import { Fridgecontent } from "../../../entities/fridgecontent.entity";

export const get = (productId: string) => {
    
    const em = RequestContext.getEntityManager();
    const content = em.findOneOrFail(Fridgecontent, { product: productId});
    if (!content) {
        throw new NotFound('contentNotFound', 'Content not found');
    }
    return content;
    

  };