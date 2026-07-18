// src/products/entities/product-variant.entity.ts
import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Product } from './products.entity';
import { ProductVariantImage } from './product-variant-image.entity';


@Entity('product_variants')
export class ProductVariant {
  
  @PrimaryColumn('uuid', {
    default: () => 'uuid_generate_v7()',
  })
  id: string;

  @Column()
  productId: string;

  @Column()
  sku: string;

  @Column()
  size: string;

  @Column()
  color: string;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  priceOverride: number | null;

  @Column({ default: 0 })
  quantity: number;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => ProductVariantImage, (image) => image.productVariant)
  images: ProductVariantImage[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Product, (product) => product.variants)
  @JoinColumn({ name: 'productId' })
  product: Product;
}