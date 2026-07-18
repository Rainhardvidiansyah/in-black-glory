import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { UUID } from "typeorm/driver/mongodb/bson.typings.js";
import { ProductVariant } from "./product-variant.entity";

@Entity("product_variant_images")
export class ProductVariantImage{

  @PrimaryColumn('uuid', {
    default: () => 'uuid_generate_v7()'})
  id: string;
  
  @Column({ type: 'uuid', nullable: false})
  productVariantId: string

  @Column({ type: 'varchar', length: 500, nullable: false})
  url: string;

  @Column({ type: 'boolean', nullable: true, default: false})
  isPrimary: boolean;

  @Column({ type: 'int', nullable: false, default: 0})
  sortOrder: number;

  @ManyToOne(() => ProductVariant, (variant) => variant.images, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productVariantId' })
  productVariant: ProductVariant;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;






}

/*
CREATE TABLE "product_variant_images"(
            "id" UUID DEFAULT uuid_generate_v7(),
            "productVariantId" UUID NOT NULL,
            "url" VARCHAR(500) NOT NULL,
            "isPrimary" BOOLEAN NOT NULL DEFAULT false,
            "sortOrder" INT NOT NULL DEFAULT 0,
            "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "PK_product_variant_images_id" PRIMARY KEY ("id"),
            CONSTRAINT "FK_product_variant_images_variant"
            FOREIGN KEY ("productVariantId") REFERENCES "product_variants"("id") ON DELETE CASCADE
            )
*/