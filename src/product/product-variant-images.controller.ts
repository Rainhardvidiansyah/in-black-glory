import { Body, Controller, Delete, Get, Logger, Param, ParseUUIDPipe, Patch, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { ProductVariantImageService } from "./procuct-variant-image.service";
import { UploadVariantImageDto } from "./dto/upload-variant-image.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { Roles } from "src/common/decorators/roles.decorators";
import { Role } from "src/common/enums/role.enum";
import { ResponseMessage } from "src/common/decorators/response-message.decorators";

@Controller('images')
export class ProductVariantImagesController {

  private logger = new Logger(ProductVariantImagesController.name);

  constructor(
    private readonly imageService: ProductVariantImageService
  ){}


  @ResponseMessage('Upload images is success')
  @Post(':variantId')
  @UseInterceptors(FileInterceptor('file'))
  @Roles(Role.ADMIN)
  async createImage(@Param('variantId', new ParseUUIDPipe({version: '7'})) variantId: string, @UploadedFile('file') file: Express.Multer.File, @Body() uploadVariantImageDto: UploadVariantImageDto){
    
    this.logger.log(`UPLOAD FILE = Content of variant id: ${variantId}`)
    return await this.imageService.upload(variantId, file, uploadVariantImageDto.isPrimary);
  }



  @ResponseMessage('Get all image by product variants id is success')
  @Get(':variantId')
  async getAllImages(@Param("variantId", new ParseUUIDPipe({version: '7'})) variantId: string){
    const images = await this.imageService.findAll(variantId);
    this.logger.log(`Image data: ${JSON.stringify(images)}`);
    return images;
  }


  @ResponseMessage('Get one image by product variant id is success')
  @Get('variants/:variantId')
  async findOneImageByVariantId(@Param("variantId", new ParseUUIDPipe({version: '7'})) variantId: string){
    return await this.imageService.findOneImageByVariantId(variantId);
  }


  @ResponseMessage('Get one image by id is success')
  @Get('single/:imageId')
  async findOne(@Param("imageId", new ParseUUIDPipe({version: '7'})) imageId: string){
    this.logger.log(`Find one images is called...`);
    return await this.imageService.findOneImageById(imageId);
  }


  @ResponseMessage('Set image to be a primary image is success')
  @Patch(':imageId/primary')
  @Roles(Role.ADMIN)
  async makeImageAsPrimary(@Param("imageId", new ParseUUIDPipe({version: '7'})) imageId: string){
    return await this.imageService.makeImageAsPrimary(imageId);
  }


  @ResponseMessage('Delete image by id is success')
  @Delete(':imageId')
  @Roles(Role.ADMIN)
  async deleteImageById(@Param("imageId", new ParseUUIDPipe({version: '7'})) imageId){
    return await this.deleteImageById(imageId);
  }




}