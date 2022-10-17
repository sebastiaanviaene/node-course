import { RequestContext } from "@mikro-orm/core";
import { Content } from "../../../entities/entityIndex";

export const getContent = (productId: string) => {
    
    const em = RequestContext.getEntityManager();
    const content = em.findOneOrFail(Content, { product: productId});
    return content;
  };