import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
@Entity()
export class WebPushMessage extends BaseEntity {
  @Field(_ => ID)
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Field()
  @Column({
    length: 255,
    nullable: false,
  })
  title: string;

  @Field()
  @Column({
    length: 255,
    nullable: false,
  })
  body: string;

  @Field()
  @Column({
    length: 255,
    nullable: false,
  })
  icon: string;

  @Field()
  @Column({
    length: 255,
    nullable: false,
  })
  url: string;

  @Field()
  @Column({
    type: "datetime",
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;
}
