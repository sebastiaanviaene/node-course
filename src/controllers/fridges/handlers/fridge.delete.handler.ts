import { RequestContext } from "@mikro-orm/core";
import { Fridge} from "../../../entities/entityIndex";

export const deleteFridge = async (fridgeId: string) => {

    const em = RequestContext.getEntityManager();
    const fridge = await em.findOneOrFail(Fridge, {id: fridgeId});
    await em.removeAndFlush(fridge);
  };