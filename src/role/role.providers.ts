import { DataSource } from "typeorm";
import { Role } from "./role.entity";


export const rolesProviders = [
  {
    provide: 'ROLES_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Role),
    inject: ['DATA_SOURCE'],
  },
];