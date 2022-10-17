import { RequestContext } from "@mikro-orm/core";
import { Content} from "../../../entities/entityIndex";


export const deleteContent = async (productId: string) => {

    const em = RequestContext.getEntityManager();
    const content = await em.findOneOrFail(Content, {product: productId});
    await em.removeAndFlush(content);
  };