import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  ManyToMany,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity('roles')
export class Role {

  @PrimaryColumn('uuid', {
    default: () => "uuid_generate_v7()",
  })
  id!: string;

  @Index({ unique: true })
  @Column({
    name: 'role_name',
    type: 'varchar',
    length: 255,
  })
  roleName!: string;

  @Column({
    name: 'description',
    type: 'text',
    nullable: true,
  })
  description?: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'now()',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'now()',
  })
  updatedAt!: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    nullable: true,
  })
  deletedAt?: Date;


  @ManyToMany(() => User, (user) => user.roles)
  users!: User[];
}