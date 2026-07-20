import { ConflictException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { RedisConfigService } from 'src/redisconfig/redisconfig.service';
import { RedisCacheKey } from 'src/common/constants/redis-cache-key.constant';
import { RedisTTL } from 'src/common/constants/redis-ttl.constants';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/products.entity';
import { ProductResponseDto } from './dto/product-response.dto';
import { CreateProductDto } from './dto/create-product.dto';
import slugify from 'slugify';


@Injectable()
export class ProductService {

  private logger = new Logger(ProductService.name);

  

  constructor(
    private readonly redisService: RedisConfigService,
    @Inject('PRODUCT_REPOSITORY') private readonly productRepository: Repository<Product>
  ){}


  


  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    this.logger.log(`Creating product: ${JSON.stringify(createProductDto)}`);

    const finalSlug = await this.generateUniqueSlug(createProductDto.name);

    const product = this.productRepository.create({
      slug: finalSlug,
      ...createProductDto
    });

    try{
      return await this.productRepository.save(product);

    }catch(error){
      if(error && typeof error === 'object' && 'code' in error && error.code === '23505'){
        throw new ConflictException("Slug already exists. Please choose a different name for the product...");
      }
      throw error;
    }
  }
  



  //GET PRODUCT BY ID
  async getProductById(id: string){

    const productCacheKey = RedisCacheKey.PRODUCT(id);

    this.logger.log(`Cache key: ${productCacheKey}`);

    const cachedProduct = await this.redisService.get<ProductResponseDto>(productCacheKey);

    if (cachedProduct) {
      return cachedProduct
    }
      
    const product = await this.productRepository.findOne({ where: { id } });
    
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  
    const productData = {
      productId: product.id,
      productName: product.name,
      basePrice: product.basePrice,
  };

    await this.redisService.set(productCacheKey, productData, RedisTTL.PRODUCT);  
    
    return productData;
  }



  
  //Get product by Slug
  async getProductSlug(slug: string){

    const productCacheKey = RedisCacheKey.PRODUCT_SLUG(slug);

    this.logger.log(`Cache key: ${productCacheKey}`);

    const cachedProduct = await this.redisService.get<ProductResponseDto>(productCacheKey);

    if (cachedProduct) {
      return cachedProduct
    }
      
    const productSlug = await this.productRepository.findOne({ where: { slug } });
    
    if (!productSlug) {
      throw new NotFoundException(`Product with ID ${slug} not found`);
    }

  
    const productDataSlug = {
      productId: productSlug.id,
      productName: productSlug.name,
      basePrice: productSlug.basePrice,
  };

    await this.redisService.set(productCacheKey, productDataSlug, RedisTTL.PRODUCT_SLUG);
    
    return productDataSlug;
  }
  
  
  
  //GET ALL PRODUCT
  async getAllProducts(): Promise<Product[]>{

    return this.productRepository.find();
  }


  //Find Product By Id
  async findProductById(id: string): Promise<Product>{
    const product = await this.productRepository.findOne({where: {id}});
    
    if(!product){
      throw new NotFoundException("Product not found");
    }
    return product;
  }


  
  //UPDATE PRODUCT BY ID
  async updateProductById(id: string, updateProductDto: UpdateProductDto): Promise<Product>{

    const productToUpdate = await this.productRepository.preload({
      id: id,
      ...updateProductDto
    })
    
    if(!productToUpdate){
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    
    const updatedProduct = await this.productRepository.save(productToUpdate);

    await this.redisService.delete(RedisCacheKey.PRODUCT(id));

    return updatedProduct;
  }

 

  
  //DELETE PRODUCT BY ID -- IMPLEMENTING SOFT DELETE
  async deleteProductById(id: string): Promise<void>{

    const productId = await this.productRepository.findOneBy({id});

    if(!productId){
      throw new NotFoundException(`Product with ID ${id} not found`)
    }

    await this.redisService.delete(RedisCacheKey.PRODUCT(productId.id));

    await this.productRepository.softDelete(id);
  }





  //GENERATE UNIQUE SLUG
  private async generateUniqueSlug(name: string): Promise<string> {

    const baseSlug = slugify(name, { lower: true, strict: true });

    const existingProducts = await this.productRepository
    .createQueryBuilder("product")
    .where("product.slug ILIKE :slug", { slug: `${baseSlug}%`})
    .getMany();

    const finalSlug = existingProducts.length > 0 
    ? `${baseSlug}-${Date.now()}` 
    : baseSlug;

    return finalSlug;
  }
}
