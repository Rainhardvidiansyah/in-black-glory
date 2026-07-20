import { Body, Controller, Delete, Get, Logger, Param, ParseUUIDPipe, Patch, Post } from "@nestjs/common";
import { ProductVariantService } from "./product-variant.service";
import { ResponseMessage } from "src/common/decorators/response-message.decorators";
import { Roles } from 'src/common/decorators/roles.decorators';
import { Role } from 'src/common/enums/role.enum';
import { CreateProductVariantDto } from "./dto/create-product-variant.dto";
import { ProductVariantResponse } from "./dto/product-variant.response.dto";
import { RestockVariantDto } from "./dto/restock-variant.dto";
import { UpdateVariantDto } from "./dto/update-variant.dto";



@Controller('variants')
export class ProductVariantController{

  private logger = new Logger(ProductVariantController.name);

  constructor(private readonly variantService: ProductVariantService){}



  //Get Variant by Product_Variant id
  @ResponseMessage('Id product variant has been fetched successfully')
  @Get(":variantId")
  async getVarianById(@Param("variantId", new ParseUUIDPipe({version: '7'})) variantId: string){
    return this.variantService.getVariantById(variantId);
  }


  //Get Variant by product id
  @ResponseMessage('Product variants have been fetched successfully')
  @Get("product/:productId")
  async findVariantByProductId(@Param("productId", new ParseUUIDPipe({version: '7'})) productId: string){
    this.logger.log(`findVariantByProductId is hit`);
    return await this.variantService.getVariantByProductId(productId);

  }

  //Create Product Variant
  @ResponseMessage('Variant created successfully')
  @Post('product/:productId')
  @Roles(Role.ADMIN)
  async createProductVariant(@Param("productId", new ParseUUIDPipe({version: '7'})) productId: string, @Body() variantDto: CreateProductVariantDto){
    const variant = await this.variantService.createProductVarian(productId, variantDto);
    return new ProductVariantResponse(variant);
  }


  //Restock Product Variants quantity
  @ResponseMessage('Add quantity in product variant success')
  @Patch(':variantId/restock')
  @Roles(Role.ADMIN)
  async updateVariantQuantity(@Param("variantId", new ParseUUIDPipe({version: '7'})) variantId: string, @Body() restockDto: RestockVariantDto){

    const restockedVariant = await this.variantService.updateVariantQuantity(variantId, restockDto.amount);
    return new ProductVariantResponse(restockedVariant);
  }


  //Delete variant by id
  @ResponseMessage('Variant has been deleted')
  @Delete(':variantId')
  @Roles(Role.ADMIN)
  async deleteVariantById(@Param("variantId", new ParseUUIDPipe({version: '7'})) variantId: string){
    this.logger.log(`Variant id ${variantId} is deleted`);
    await this.variantService.deleteProductVariantById(variantId);
  }


  //Update Variant by id
  @ResponseMessage('Variant has been updated')
  @Patch(':variantId/update')
  @Roles(Role.ADMIN)
  async updateVariant(@Param("variantId", new ParseUUIDPipe({version: '7'})) variantId: string, updateVariantDto: UpdateVariantDto){

    this.logger.log(`Variant with id ${variantId} has been updated`);

    const updatedVariant = await this.variantService.updateVariant(variantId, updateVariantDto);
    return new ProductVariantResponse(updatedVariant);
  }

}