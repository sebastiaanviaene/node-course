import { IRequirement } from '@panenco/papi';

declare module 'routing-controllers' {
  /**
   * Supply an array of groups where within a group all requirements need to be valid
   *
   * Example1: [[valid1, valid2], [valid3, invalid1]] => success
   *
   * Example2: [valid1, invalid1] => fail
   *
   * If applied on both controller and endpoint, one of both requirements must succeed.
   */
  function Authorized(requirements?: (IRequirement | IRequirement[])[]): Function;
}