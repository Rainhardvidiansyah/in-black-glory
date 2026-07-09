import { User } from "src/user/user.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";


@Entity('customer_profiles')
export class CustomerProfile{

  @PrimaryColumn('uuid', {
    default: () => 'uuid_generate_v7()',
  })
  id: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  address: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}