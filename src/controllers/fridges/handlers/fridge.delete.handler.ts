import { RequestContext } from "@mikro-orm/core";
import { NotFound } from "@panenco/papi";
import { Fridge } from "../../../entities/fridge.entity";
import { Content } from "../../../entities/content.entity";

export const deleteFridge = async (id: string) => {

    const em = RequestContext.getEntityManager();
    const fridge = await em.findOneOrFail(Fridge, {id});
    if (!fridge) {
        throw new NotFound('fridgeNotFound', 'Fridge not found');
    }
    const [contents, count] = await em.findAndCount(Content, {fridge: id});
    for (const content of contents) {
        em.remove(content)
    }

    await em.removeAndFlush(fridge);
  };