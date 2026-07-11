// src/products/entities/product.entity.ts
import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm';
import { ProductVariant } from './product-variant.entity';
import { ColumnNumericTransformer } from 'src/utils/column-numeric.transformers';

@Entity('products')
export class Product {

  @PrimaryColumn('uuid', {
    default: () => 'uuid_generate_v7()',
  })
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 255, unique: true})
  slug: string;

  @Column({ type: 'numeric',
    precision: 10, 
    scale: 2, 
    default: 0.0,
    transformer: ColumnNumericTransformer
   })
  basePrice: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'timestamp', nullable: true })
  deletedAt: Date | null;

  @OneToMany(() => ProductVariant, (variant) => variant.product)
  variants: ProductVariant[];
}