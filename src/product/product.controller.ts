import { Body, Controller, Delete, Get, Logger, Param, ParseUUIDPipe, Patch, Post, Put } from '@nestjs/common';
import { ProductService } from './product.service';
import { ResponseMessage } from 'src/common/decorators/response-message.decorators';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { Roles } from 'src/common/decorators/roles.decorators';
import { Role } from 'src/common/enums/role.enum';
import { ProductVariantService } from './product-variant.service';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { Public } from 'src/common/decorators/public.decorators';
import { ProductVariantResponse } from './dto/product-varian.response.dto';
import { ProductResponseDto } from './dto/product-response.dto';

@Controller('products')
export class ProductController {

  private logger = new Logger(ProductController.name);

  constructor(
    private readonly productsService: ProductService,
    private readonly variantService: ProductVariantService,
  ) {}


  @ResponseMessage('Product created successfully')
  @Post("/")
  @Roles(Role.ADMIN)
  async createProduct(@Body() createProductDto: CreateProductDto){
    
    this.logger.log(`Product controller --- Create Product: ${JSON.stringify(createProductDto)}`)
    return this.productsService.createProduct(createProductDto);
  }

  // example: GET /products/:id
  @ResponseMessage('Product id fetched successfully')
  @Get(':id')
  async getProductById(@Param('id') id: string){
    const data = await this.productsService.getProductById(id);
    return data;
  }


  @Public()
  @ResponseMessage('All products fetched successfully')
  @Get()
  async getAllProducts(){
    return this.productsService.getAllProducts();
  }

  
  /*
  @Patch(':id')
  @Roles(Role.ADMIN)
  async updateProduct(@Param('id', ParseUUIDPipe) id: string,
  @Body() updateProductDto: UpdateProductDto) {
    return await this.productsService.updateProductById(id, updateProductDto);
  }
  */


  @Delete('/')
  @Roles(Role.ADMIN)
  async deleteProductById(id: string){
    this.productsService.deleteProductById(id);
  }


  // ======== PRODUCT VARIANT ======== //

  @ResponseMessage('Id product variant has been fetched successfully')
  @Get("variants/:variantId")
  async getVarianId(@Param("variantId", new ParseUUIDPipe({version: '7'})) variantId: string){
    return this.variantService.getVariantById(variantId);
  }


  //Get Varian by product id
  @ResponseMessage('Product variants have been fetched successfully')
  @Get(":productId/variants")
  async findVariantByProductId(@Param("productId", new ParseUUIDPipe({version: '7'})) productId: string){
    this.logger.log(`findVariantByProductId is hit`);

    return await this.variantService.getVariantByProductId(productId);

  }

  //Create Product Variant
  @ResponseMessage('Variant created successfully')
  @Post(':productId/variant')
  @Roles(Role.ADMIN)
  async createProductVarian(@Param("productId", new ParseUUIDPipe({version: '7'})) productId: string, @Body() variantDto: CreateProductVariantDto){
    const varian = await this.variantService.createProductVarian(productId, variantDto);
    return new ProductVariantResponse(varian);
  }

  



}


