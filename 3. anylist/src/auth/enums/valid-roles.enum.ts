import { registerEnumType } from '@nestjs/graphql';

export enum ValidRoles {
  admin = 'admin',
  user = 'user',
  superuser = 'super-user',
}

//con esto se registra el enum para que GraphQL lo reconozca
registerEnumType(ValidRoles, {
  name: 'ValidRoles',
});
