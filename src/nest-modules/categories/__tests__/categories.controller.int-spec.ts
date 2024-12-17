import { ICategoryRepository } from '@/core/category/domain/category.repository';
import { CategoriesController } from '../categories.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@/nest-modules/config/config.module';
import { DatabaseModule } from '@/nest-modules/databese/database.module';
import { CategoriesModule } from '../categories.module';
import { CATEGORY_PROVIDERS } from '../categories.providers';
import { CreateCategoryUseCase } from '@/core/category/application/use-case/create-category/create-category.use-case';
import { UpdateCategoryUseCase } from '@/core/category/application/use-case/update-category/update-category.use-case';
import { ListCategoriesUseCase } from '@/core/category/application/use-case/list-category/list-category.use-case';
import { GetCategoryUseCase } from '@/core/category/application/use-case/get-category/get-category.use-case';
import { DeleteCategoryUseCase } from '@/core/category/application/use-case/delete-category/delete-category.use-case';

describe('CategoriesController Integration Test', () => {
  let controller: CategoriesController;
  let repository: ICategoryRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), DatabaseModule, CategoriesModule],
    }).compile();

    controller = module.get(CategoriesController);
    repository = module.get(
      CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(controller['createUseCase']).toBeInstanceOf(CreateCategoryUseCase);
    expect(controller['updateUseCase']).toBeInstanceOf(UpdateCategoryUseCase);
    expect(controller['listUseCase']).toBeInstanceOf(ListCategoriesUseCase);
    expect(controller['getUseCase']).toBeInstanceOf(GetCategoryUseCase);
    expect(controller['deleteUseCase']).toBeInstanceOf(DeleteCategoryUseCase);
  });
});
