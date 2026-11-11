import { Injectable, Logger } from '@nestjs/common';
import { ProductVariantService } from 'src/product/product-variant.service';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class DashboardService {

  private logger = new Logger(DashboardService.name);

  constructor(
    private readonly productService: ProductService,
    private readonly variantService: ProductVariantService
  ){}

}
