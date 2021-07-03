import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn, Index } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { Auth } from "@www/models/typeorm/entities/auth";

@ObjectType()
@Entity()
@Index(["token"], { unique: true })
export class AccessToken extends BaseEntity {
  @Field(_ => ID)
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Field()
  @JoinColumn({
    name: "auth_id",
    referencedColumnName: "id",
  })
  @ManyToOne(() => Auth, {
    eager: true,
  })
  auth: Auth;

  @Field()
  @Column({
    length: 255,
    nullable: false,
  })
  token: string;

  @Field()
  @Column({
    type: "datetime",
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;
}
