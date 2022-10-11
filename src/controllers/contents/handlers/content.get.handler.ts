import { RequestContext } from "@mikro-orm/core";
import { NotFound } from "@panenco/papi";
import { Content } from "../../../entities/content.entity";

export const get = (productId: string) => {
    
    const em = RequestContext.getEntityManager();
    const content = em.findOneOrFail(Content, { product: productId});
    if (!content) {
        throw new NotFound('contentNotFound', 'Content not found');
    }
    return content;
    

  };