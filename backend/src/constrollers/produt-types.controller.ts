import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { AppService } from '../servicecs/app.service';
import { ProductTypeDto } from '../dtos/productType.dto';

@Controller('api/product-types')
export class ProductTypesController {
    constructor(private readonly appService: AppService) { }

    @Get()
    async getProductTypes(): Promise<ProductTypeDto> {
        console.log('Get product-types')
        return await this.appService.getProductTypes();
    }

    @Post()
    async createProductType(@Body() productType: ProductTypeDto) {
        console.log('Post product type')
        return await this.appService.createProductType(productType);
    }

    @Delete(':id')
    async deleteProductType(@Param('id') id: number) {
        console.log('Delete product type')
        return await this.appService.deleteProductType(id);
    }

    @Patch(':id')
    async updateProductType(
        @Param('id') id: number,
        @Body() productType: ProductTypeDto
    ) {
        console.log('Update product type')
        return await this.appService.updateProductType(id, productType);
    }
}
