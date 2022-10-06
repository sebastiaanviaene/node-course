import { BaseEntity, Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { v4 } from 'uuid';

@Entity()
export class Product extends BaseEntity<Product,'id'> {

    @PrimaryKey({columnType: 'uuid'})
    public id: string = v4();

    @Property()
    public name: string;

    @Property()
    public owner: string;

    @Property()
    public size: number;


}