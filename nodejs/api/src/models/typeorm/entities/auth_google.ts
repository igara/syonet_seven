import "reflect-metadata";
import { ChildEntity } from "typeorm";
import { Auth } from "@api/models/typeorm/entities/auth";

@ChildEntity()
export class AuthGoogle extends Auth {}
