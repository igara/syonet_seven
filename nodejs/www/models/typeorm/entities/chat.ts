import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
@Entity()
export class Chat extends BaseEntity {
  @Field(_ => ID)
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Field()
  @Column({
    length: 50,
    nullable: false,
  })
  name: string;

  @Field()
  @Column({
    length: 50,
    nullable: true,
  })
  password: string;

  @Field()
  @Column({
    type: "datetime",
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Field()
  @Column({
    type: "datetime",
    name: "updated_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;
}
