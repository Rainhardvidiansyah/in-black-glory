import { Body, Controller, Delete, Get, Logger, Param, ParseUUIDPipe, Patch, Post, Put } from '@nestjs/common';
import { ProductService } from './product.service';
import { ResponseMessage } from 'src/common/decorators/response-message.decorators';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { Roles } from 'src/common/decorators/roles.decorators';
import { Role } from 'src/common/enums/role.enum';
import { Public } from 'src/common/decorators/public.decorators';

@Controller('products')
export class ProductController {

  private logger = new Logger(ProductController.name);

  constructor(
    private readonly productsService: ProductService,
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


  


}


