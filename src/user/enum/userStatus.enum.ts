import { registerEnumType } from "@nestjs/graphql";

export enum UserStatusEnum {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
  }

  registerEnumType(UserStatusEnum, {
    name: 'UserStatusEnum',
  });