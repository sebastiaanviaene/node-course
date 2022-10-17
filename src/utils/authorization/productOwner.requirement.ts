import { RequestContext } from "@mikro-orm/core";
import { Forbidden, IRequirement } from "@panenco/papi";
import { Product } from "../../entities/product.entity";

export const productOwnerRequirement: IRequirement = async req => {
    const {
      token,
      params: { id: productId },
    } = req;
  
    const {
      userId,
    } = token;
  
    const em = RequestContext.getEntityManager();
    const product = await em.findOneOrFail(Product,{id: productId});
    if (product.owner !== userId) {
        throw new Forbidden('notOwner', 'You are not the owner of this product')
      }
  };

  export const productOwnerContentRequirement: IRequirement = async req => {
    const {
      token,
      body: { productId },
    } = req;
  
    const {
      userId,
    } = token;
  
    const em = RequestContext.getEntityManager();
    const product = await em.findOneOrFail(Product,{id: productId});
    if (product.owner !== userId) {
        throw new Forbidden('notOwner', 'You are not the owner of this product')
      }
  };