import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ProductTypeDto } from '../dtos/productType.dto';
import { AppService } from 'src/servicecs/app.service';

@Controller('api/product-types')
export class ProductTypesController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getProductTypes(): Promise<ProductTypeDto[]> {
    console.log('Get product-types');
    return await this.appService.getProductTypes();
  }

  @Post()
  async createProductType(
    @Body() productType: ProductTypeDto,
  ): Promise<ProductTypeDto> {
    console.log('Post product type');
    return await this.appService.createProductType(productType);
  }

  @Delete(':id')
  async deleteProductType(@Param('id') id: number): Promise<void> {
    console.log('Delete product type');
    return await this.appService.deleteProductType(id);
  }

  @Patch(':id')
  async updateProductType(
    @Param('id') id: number,
    @Body() productType: Partial<ProductTypeDto>,
  ): Promise<ProductTypeDto> {
    console.log('Update product type');
    return await this.appService.updateProductType(id, productType);
  }
}
