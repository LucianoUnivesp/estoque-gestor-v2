import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { AppService } from '../servicecs/app.service';
import { ProductDto } from '../dtos/product.dto';
import { ProductTypeDto } from '../dtos/productType.dto';

@Controller('api/products')
export class ProductsController {
  constructor(private readonly appService: AppService) { }

  @Get()
  async getProducts(): Promise<ProductDto[]> {
    console.log('Get Products')
    return await this.appService.getProducts();
  }

  @Patch(':id')
  async updateProduct(
    @Param('id') id: number,
    @Body() product: ProductDto
  ): Promise<void> {
    console.log('Patch product')
    return await this.appService.updateProduct(id, product);
  }

  @Post()
  async createProduct(@Body() product: ProductDto): Promise<any> {
    console.log('Post product')
    return await this.appService.createProduct(product);
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: number): Promise<any> {
    console.log('Delete product')
    return await this.appService.deleteProduct(id);
  }
}
