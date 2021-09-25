import "reflect-metadata";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  // TableInheritance,
  Index,
} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
@Entity()
// @TableInheritance({
//   column: {
//     name: "type",
//   },
// })
@Index(["type", "snsID"], { unique: true })
export class Auth extends BaseEntity {
  @Field((_) => ID)
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Field()
  @Column({
    length: 255,
    nullable: false,
    name: "sns_id",
  })
  snsID: string;

  @Field()
  @Column({
    length: 255,
    nullable: false,
  })
  username: string;

  @Field()
  @Column({
    length: 255,
    nullable: false,
    name: "image_url",
  })
  imageURL: string;

  @Field()
  @Column({
    length: 255,
    nullable: false,
    name: "access_token",
  })
  accessToken: string;

  @Field()
  @Column({
    length: 30,
    nullable: false,
  })
  type: "AuthGoogle" | "AuthGithub";

  @Field()
  @Column({
    type: "datetime",
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;
}
