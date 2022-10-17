import { EntityManager } from '@mikro-orm/core';
import { TeamTokenData } from 'utils/helpers/token/TokenData.interfaces';

declare module 'express' {
  interface Request {
    em: EntityManager;
    token: TeamTokenData;
    rawBody: any;
  }
}