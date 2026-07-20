import { Body, Controller, Delete, Get, Logger, Param, ParseUUIDPipe, Patch, Post, Put, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { ResponseMessage } from 'src/common/decorators/response-message.decorators';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { Roles } from 'src/common/decorators/roles.decorators';
import { Role } from 'src/common/enums/role.enum';
import { Public } from 'src/common/decorators/public.decorators';
import { PaginationQueryDto } from './dto/pagination-query.dto';

@Controller('products')
export class ProductController {

  private logger = new Logger(ProductController.name);

  constructor(
    private readonly productsService: ProductService,
  ) {}

  //Save product to database
  @ResponseMessage('Product created successfully')
  @Post("/")
  @Roles(Role.ADMIN)
  async createProduct(@Body() createProductDto: CreateProductDto){
    
    this.logger.log(`Product controller --- Create Product: ${JSON.stringify(createProductDto)}`)
    return this.productsService.createProduct(createProductDto);
  }

  // example: GET /products/:id
  @Public()
  @ResponseMessage('Product id fetched successfully')
  @Get(':id')
  async getProductById(@Param('id', new ParseUUIDPipe({version: '7'})) id: string){
    const data = await this.productsService.getProductById(id);
    return data;
  }

  // Get Product by Slug
  @Public()
  @ResponseMessage('Product slug fetched successfully')
  @Get('slug/:slug')
  async getProductBySlug(@Param('slug') slug: string){
    const data = await this.productsService.getProductSlug(slug);
    return data;
  }


  // Fetch all products from database
  @Public()
  @ResponseMessage('All products fetched successfully')
  @Get()
  async getAllProducts(@Query() query: PaginationQueryDto){
    return this.productsService.getAllProducts(query);
  }

  
  /*
  @Patch(':id')
  @Roles(Role.ADMIN)
  async updateProduct(@Param('id', ParseUUIDPipe) id: string,
  @Body() updateProductDto: UpdateProductDto) {
    return await this.productsService.updateProductById(id, updateProductDto);
  }
  */


  // Delete product from database
  @Delete('/')
  @Roles(Role.ADMIN)
  async deleteProductById(id: string){
    this.productsService.deleteProductById(id);
  }


  


}




//TODO: Make several methods public!