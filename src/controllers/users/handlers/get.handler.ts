import { RequestContext } from "@mikro-orm/core";
import { NotFound } from "@panenco/papi";
import { User } from "../../../entities/user.entity";

export const get = (id: string) => {
    
    const em = RequestContext.getEntityManager();
    const user = em.findOneOrFail(User, {id});
    if (!user) {
        throw new NotFound('userNotFound', 'User not found');
    }
    return user;
    

  };