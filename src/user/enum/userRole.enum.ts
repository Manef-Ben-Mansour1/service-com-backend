import { registerEnumType } from "@nestjs/graphql";

export enum UserRoleEnum {
  ADMIN = 'ADMIN',
  USER = 'USER',
  SERVICE_PROVIDER = 'SERVICE_PROVIDER'
}

registerEnumType(UserRoleEnum, {
  name: 'UserRoleEnum',
});