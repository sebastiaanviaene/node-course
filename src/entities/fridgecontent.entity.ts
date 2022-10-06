import { BaseEntity, Cascade, Entity, ManyToOne, OneToMany, OneToOne, PrimaryKey } from "@mikro-orm/core";
import { v4 } from 'uuid';
import { Fridge } from "./fridge.entity";
import { Product } from "./product.entity";

@Entity()
export class Fridgecontent extends BaseEntity<Fridgecontent,'id'> {

    @PrimaryKey({columnType: 'uuid'})
    public id: string = v4();

    @ManyToOne(() => Fridge, {wrappedReference: true})
    public fridge: Fridge;


    @ManyToOne(() => Product, {wrappedReference: true})
    public product: Product;

}