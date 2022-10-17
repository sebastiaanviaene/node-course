import { RequestContext } from "@mikro-orm/core";
import { NotFound } from "@panenco/papi";
import { User } from "../../../entities/user.entity";

export const getUser = (userId: string) => {
    
    const em = RequestContext.getEntityManager();
    const user = em.findOneOrFail(User, {id: userId});
    return user;
  };