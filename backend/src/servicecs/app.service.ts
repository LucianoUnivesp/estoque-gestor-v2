import { BadRequestException, Injectable } from '@nestjs/common';
import { products as mockProductsStore, productTypes as mockProductTypesStore } from '../mocks/mockData';
import { ProductDto } from '../dtos/product.dto';
import { ProductTypeDto } from 'src/dtos/productType.dto';


@Injectable()
export class AppService {
  async updateProductType(id: number, data: any): Promise<any> {
    try {
      const index = mockProductTypesStore.findIndex(pt => pt.id === Number(id));
      if (index === -1) throw new Error('Tipo de produto não encontrado');

      mockProductTypesStore[index] = {
        ...mockProductTypesStore[index],
        ...data,
      };
      return mockProductTypesStore[index];
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async deleteProductType(id: number): Promise<void> {
    try {
      const index = mockProductTypesStore.findIndex(p => p.id === Number(id));
      if (index === -1) throw new Error('Tipo de produto não encontrado');
      mockProductTypesStore.splice(index, 1);
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async createProductType(productType: ProductTypeDto): Promise<any> {
    try {
      mockProductTypesStore.push(productType);

      const index = mockProductTypesStore.findIndex(p => p.id === Number(productType.id));
      if (index === -1) throw new Error('Produto não encontrado');

      return mockProductTypesStore[index];
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async deleteProduct(id: number): Promise<void> {
    try {
      const index = mockProductsStore.findIndex(p => p.id === Number(id));
      if (index === -1) throw new Error('Produto não encontrado');
      mockProductsStore.splice(index, 1);

    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async createProduct(product: ProductDto): Promise<any> {
    try {
      mockProductsStore.push(product);

      const index = mockProductsStore.findIndex(p => p.id === Number(product.id));
      if (index === -1) throw new Error('Produto não encontrado');

      return mockProductsStore[index];
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async updateProduct(id: any, data: any): Promise<any> {
    try {
      const index = mockProductsStore.findIndex(p => p.id === Number(id));
      if (index === -1) throw new Error('Produto não encontrado');

      mockProductsStore[index] = {
        ...mockProductsStore[index],
        ...data,
        productType: data.productTypeId
          ? mockProductsStore.find(type => type.id === data.productTypeId)
          : mockProductsStore[index].productType,
      };

      return mockProductsStore[index];
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async getProductTypes(): Promise<any> {
    try {
      return mockProductTypesStore
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async getProducts(): Promise<any> {
    try {
      return mockProductsStore
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }
}
