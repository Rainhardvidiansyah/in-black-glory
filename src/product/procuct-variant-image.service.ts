import { Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { ProductVariantImage } from "./entities/product-variant-image.entity";
import { MinioService } from "src/minio/minio.service";
import { ProductVariantService } from "./product-variant.service";
import { MinioBucket } from "src/common/constants/minio-bucket.constant";


@Injectable()
export class ProductVariantImageService{

  private logger = new Logger(ProductVariantImageService.name);

  constructor(
    @Inject("PRODUCT_VARIANT_IMAGE_REPOSITORY") private readonly variantImageRepository: Repository<ProductVariantImage>,
    private readonly variantsService: ProductVariantService,
    private readonly minioService: MinioService
  ){}



  /* Save Image*/
  async upload(variantId: string, file: Express.Multer.File, isPrimaryRequested?: boolean): Promise<ProductVariantImage>{

    const variant = await this.variantsService.getVariantById(variantId);

    const url = await this.minioService.uploadFile(MinioBucket.PRODUCT_IMAGE, file);

    const existingCount = await this.variantImageRepository.count({
      where: {productVariantId: variantId},
    });

    const isFirstImage = existingCount === 0;

    const shouldBePrimary = isFirstImage|| isPrimaryRequested === true;

    if(shouldBePrimary || !isFirstImage){
      await this.variantImageRepository.update(
        {productVariantId: variantId},
        {isPrimary: false}
      );
    }

    const image = this.variantImageRepository.create({
      productVariantId: variantId,
      url: url,
      isPrimary: shouldBePrimary
    });

    const savedImage = await this.variantImageRepository.save(image);

    return savedImage;

  }

  /* Find all images by Variant Id */
  async findAll(variantId: string): Promise<ProductVariantImage[]>{

    this.logger.log(`Find all images by VariantId is called`);

    const images = await this.variantImageRepository.find({
      where: {productVariantId: variantId},
      order: {sortOrder: 'ASC', createdAt: 'ASC'}
    });

    if(!images){
      throw new NotFoundException('Images not found');
    }

    return images;
  }

  
  /* Get One Image by Product Variant Id */
  async findOneImageByVariantId(imageId: string): Promise<ProductVariantImage>{
    const image = await this.variantImageRepository.findOne({
      where: {productVariantId: imageId}
    });

    if(!image){
      throw new NotFoundException(`Image with id ${imageId} not found!`);
    }
    return image;
  }


  /* Find one image by Image id */
  async findOneImageById(imageId: string): Promise<ProductVariantImage>{
    const image = await this.variantImageRepository.findOne(
      {where:  {id : imageId}}
      
    );

    if(!image){
      throw new NotFoundException(`Image with id ${imageId} Not Found`);
    }

    return image;
  }

  /* Make one image as Primary Image */
  async makeImageAsPrimary(imageId: string): Promise<ProductVariantImage>{
    const image = await this.findOneImageById(imageId);

    await this.variantImageRepository.update(
      { productVariantId: image.productVariant.id },
      { isPrimary: false }
  );

  image.isPrimary = true;

  const savedNewImage = await this.variantImageRepository.save(image);

  return savedNewImage;
  }


  async removeImage(imageId: string): Promise<void>{
    const image = await this.findOneImageById(imageId);
    await this.minioService.deleteFileFromMinioStorage(MinioBucket.PRODUCT_IMAGE, image.url);
  }







}