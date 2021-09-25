import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, Index } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
@Entity()
@Index(["endpoint", "auth", "p256dh"], { unique: true })
export class WebPushUser extends BaseEntity {
  @Field(_ => ID)
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Field()
  @Column({
    length: 255,
    nullable: false,
  })
  endpoint: string;

  @Field()
  @Column({
    length: 255,
    nullable: false,
  })
  auth: string;

  @Field()
  @Column({
    length: 255,
    nullable: false,
  })
  p256dh: string;

  @Field()
  @Column({
    type: "datetime",
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;
}
