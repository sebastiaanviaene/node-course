import { BaseEntity, Collection, Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { v4 } from 'uuid';

@Entity()
export class Recipe extends BaseEntity<Recipe,'id'> {

    @PrimaryKey({columnType: 'uuid'})
    public id: string = v4();

    @Property()
    public name: string

    @Property()
    public description: string

    @Property()
    public ingredients: string

}