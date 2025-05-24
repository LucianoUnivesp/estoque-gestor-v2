import { Module } from '@nestjs/common';
import { ProductsController } from './constrollers/products.controller';
import { AppService } from './servicecs/app.service';
import { ProductTypesController } from './constrollers/produt-types.controller';

@Module({
  imports: [],
  controllers: [ProductsController,ProductTypesController],
  providers: [AppService],
})
export class AppModule {}
