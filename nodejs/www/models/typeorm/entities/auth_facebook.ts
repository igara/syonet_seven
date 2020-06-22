import "reflect-metadata";
import { ChildEntity } from "typeorm";
import { Auth } from "@www/models/typeorm/entities/auth";

@ChildEntity()
export class AuthFacebook extends Auth {}
