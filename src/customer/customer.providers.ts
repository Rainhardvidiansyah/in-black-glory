import { DataSource } from "typeorm";
import { CustomerProfile } from "./customer.entity";


export const customerProviders = [
  {
    provide: 'CUSTOMER_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(CustomerProfile),
    inject: ['DATA_SOURCE'],
  },
];