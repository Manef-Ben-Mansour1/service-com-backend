import { registerEnumType } from "@nestjs/graphql";

export enum OrderStatusEnum {
    EN_ATTENTE = 'En attente de confirmaiton',
    CONFIRME = 'Confirmé',
    FINIE = 'Finie'
  }

  registerEnumType(OrderStatusEnum, {
    name: 'OrderStatusEnum', // This is the name that will appear in the GraphQL schema
  });