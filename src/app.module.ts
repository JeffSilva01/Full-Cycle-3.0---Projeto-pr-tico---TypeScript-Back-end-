import { Module } from '@nestjs/common';
import { CategoriesModule } from './nest-modules/categories/categories.module';
import { DatabeseModule } from './nest-modules/databese/databese.module';
import { ConfigModule } from './nest-modules/config/config.module';

@Module({
  imports: [ConfigModule.forRoot(), DatabeseModule, CategoriesModule],
})
export class AppModule {}
