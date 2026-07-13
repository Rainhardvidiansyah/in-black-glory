import { ConflictException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ProductVariant } from './entities/product-variant.entity';
import { ProductService } from './product.service';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { generateSku } from 'src/utils/sku-generator';
import { RedisCacheKey } from 'src/common/constants/redis-cache-key.constant';
import { RedisConfigService } from 'src/redisconfig/redisconfig.service';
import { ProductVariantResponse } from './dto/product-variant.response.dto';
import { RedisTTL } from 'src/common/constants/redis-ttl.constants';


@Injectable()
export class ProductVariantService {


  private logger = new Logger(ProductVariantService.name);

  constructor(
    @Inject("PRODUCT_VARIANT_REPOSITORY") private variantRepository: Repository<ProductVariant>,
    private readonly redisService: RedisConfigService,
    private readonly productService: ProductService,

  ){}


  //CREATE PRODUCT VARIANT
  //productID AS PARAM, NOT A BODY
  async createProductVarian(productId: string, createProductVariantDto: CreateProductVariantDto): Promise<ProductVariant>{

    this.logger.log(`Data Create Product Varian dto: ${JSON.stringify(createProductVariantDto)}`);

    const product = await this.productService.findProductById(productId);

    this.logger.log(`Data product: ${JSON.stringify(product)}`);

    if(!product){
      throw new NotFoundException(`Product with id ${productId} not found`);
    }

    const generatedSku = generateSku(product.name, createProductVariantDto.size, createProductVariantDto.color);

    console.log("Generated SKU: " + generatedSku);

    const createdProductVariant = this.variantRepository.create({
      ...createProductVariantDto,
      productId: product.id,
      sku: generatedSku
    });

    this.logger.log(`Created Product Varian: ${JSON.stringify(createdProductVariant)}`);

    const savedProduct = await this.variantRepository.save(createdProductVariant);
    
    this.logger.log(`Saved Product Varian: ${JSON.stringify(savedProduct)}`);

    return savedProduct;
  }


  async getVariantById(varianId: string): Promise<ProductVariantResponse>{

    //getRedis
    const productVariantCacheKey = RedisCacheKey.PRODUCT_VARIANT(varianId);

    this.logger.log(`Product cache key: ${productVariantCacheKey}`)

    const cachedProductVariant = await this.redisService.get<ProductVariantResponse>(productVariantCacheKey);

    if(cachedProductVariant){
      return cachedProductVariant;
    }

    const productVariant = await this.variantRepository.findOne({ 
      where: { id: varianId },
      relations: { product: true }, 
    });

    if(!productVariant){
      throw new NotFoundException('Product variant not found');
    }

    this.logger.log(`Product name: ${productVariant.product.name}`);

    const productVariantData: ProductVariantResponse = {
    productId: productVariant.productId,
    productVariantId: productVariant.id,
    productName: productVariant.product.name,
    color: productVariant.color,
    size: productVariant.size,
    quantity: productVariant.quantity
  };

    //setRedis
    await this.redisService.set(productVariantCacheKey, JSON.stringify(productVariantData), RedisTTL.PRODUCT_VARIANT);

    return productVariantData;

  }


  //Get Variants By Product Id
  async getVariantByProductId(productId: string): Promise<ProductVariant[]>{
    this.logger.log(`Get variants by product id is hit`)
    
    const variants = await this.variantRepository.find({
      where: {productId: productId},
      relations: {
        product: true
      }
    });

    if(variants.length === 0){
      throw new NotFoundException(`Product variant with productId ${productId} not found`);
    }

    this.logger.log(`Variants: ${JSON.stringify(variants)}`)

    return variants;
  }


  //Delete Product Variant By Id
  async deleteProductVariantById(variantId: string): Promise<void>{

    await this.redisService.delete(RedisCacheKey.PRODUCT_VARIANT(variantId));

    await this.variantRepository.softDelete(variantId);
  }


  //Update Quantity in Product Variant
  async updateVariantQuantity(variantId: string, changeAmount: number): Promise<ProductVariant>{

    const variant = await this.variantRepository.findOne({ where: {id: variantId}});

    if(!variant){
      throw new NotFoundException(`Product varian with id ${variantId} not found`);
    }

    const newQuantity = variant.quantity + changeAmount

    if (newQuantity < 0) {
    throw new ConflictException(
      `Insufficient stock. Remaining stock: ${variant.quantity}, requested reduction: ${Math.abs(changeAmount)}`);
  }

    variant.quantity = newQuantity;

    return await this.variantRepository.save(variant);

    //send this to restock:
    // await this.variantsService.updateVariantQuantity(variantId, 10);
    // send this to reduce the stock, or there is an order:
    // await this.variantsService.updateVariantQuantity(variantId, -3);

  }


}

//createProductVarian(productId: string, createProductVariantDto: CreateProductVariantDto): Promise<ProductVariant>
//getVariantById(varianId: string): Promise<ProductVariantResponse>
//deleteProductVariantById(variantId: string): Promise<void>