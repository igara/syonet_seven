import "reflect-metadata";
import { ChildEntity } from "typeorm";
import { Auth } from "@www/models/typeorm/entities/auth";

@ChildEntity()
export class AuthGitHub extends Auth {}
