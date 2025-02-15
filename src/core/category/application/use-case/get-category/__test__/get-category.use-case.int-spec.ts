import { CategorySequelizeRepository } from '@/category/infra/db/sequelize/category-sequelize.repository';
import { setupSequelize } from '@/shared/infra/testing/helper';
import { CategoryModel } from '@/category/infra/db/sequelize/category.model';
import { Uuid } from '@/shared/domain/value-objects/uuid.vo';
import { NotFoundError } from '@/shared/domain/validators/errors/not-found.errr';
import { Category } from '@/category/domain/category.entity';
import { GetCategoryUseCase } from '../get-category.use-case';

describe('GetCategoryUseCase Integration Tests', () => {
  let useCase: GetCategoryUseCase;
  let repository: CategorySequelizeRepository;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    repository = new CategorySequelizeRepository(CategoryModel);
    useCase = new GetCategoryUseCase(repository);
  });

  it('should throws error when entity not found', async () => {
    const uuid = new Uuid();
    await expect(() => useCase.execute({ id: uuid.id })).rejects.toThrow(
      new NotFoundError(uuid.id, Category),
    );
  });

  it('should returns a category', async () => {
    const category = Category.fake().aCategory().build();
    await repository.insert(category);
    const output = await useCase.execute({ id: category.categoryId.id });
    expect(output).toStrictEqual({
      id: category.categoryId.id,
      name: category.name,
      description: category.description,
      isActive: category.isActive,
      createdAt: category.createdAt,
    });
  });
});
