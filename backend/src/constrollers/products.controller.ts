// backend/src/controllers/products.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ProductDto } from '../dtos/product.dto';
import { AppService } from 'src/servicecs/app.service';

@Controller('api/products')
export class ProductsController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getProducts(): Promise<ProductDto[]> {
    console.log('Get Products');
    return await this.appService.getProducts();
  }

  @Patch(':id')
  async updateProduct(
    @Param('id') id: number,
    @Body() product: Partial<ProductDto>,
  ): Promise<ProductDto> {
    console.log('Patch product');
    return await this.appService.updateProduct(id, product);
  }

  @Post()
  async createProduct(@Body() product: ProductDto): Promise<ProductDto> {
    console.log('Post product');
    return await this.appService.createProduct(product);
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: number): Promise<void> {
    console.log('Delete product');
    return await this.appService.deleteProduct(id);
  }
}
