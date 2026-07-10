import { Role } from "src/role/role.entity";
import { Column, CreateDateColumn, Entity, Index, JoinTable, ManyToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";



@Entity('users')
export class User {
  
  @PrimaryColumn('uuid', {
    default: () => 'uuid_generate_v7()',
  })
  id: string;

  @Index({ unique: true })
  @Column({
    type: 'varchar'
  })
  email: string;

  @Column({ 
    type: 'varchar',
    nullable: true })
  password: string;

  @Column({ default: 'local' })
  provider!: 'local' | 'google' | 'github';

  @Column({ nullable: true })
  providerId!: string;

  @Column({ default: false })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({
    name: 'users_roles', 
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id', 
      referencedColumnName: 'id',
    },
  })
  roles: Role[];

}