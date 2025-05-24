import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SupabaseService } from './config/supabase.config';
import { ProductsController } from './constrollers/products.controller';
import { ProductTypesController } from './constrollers/produt-types.controller';
import { AppService } from './servicecs/app.service';
import { StockMovementsController } from './constrollers/stock-movements.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [
    ProductsController,
    ProductTypesController,
    StockMovementsController,
  ],
  providers: [AppService, SupabaseService],
})
export class AppModule {}
