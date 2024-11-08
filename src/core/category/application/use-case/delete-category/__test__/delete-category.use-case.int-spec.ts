import { CategorySequelizeRepository } from '@/category/infra/db/sequelize/category-sequelize.repository';
import { CategoryModel } from '@/category/infra/db/sequelize/category.model';
import { setupSequelize } from '@/shared/infra/testing/helper';
import { Uuid } from '@/shared/domain/value-objects/uuid.vo';
import { NotFoundError } from '@/shared/domain/validators/errors/not-found.errr';
import { Category } from '@/category/domain/category.entity';
import { DeleteCategoryUseCase } from '../delete-category.use-case';

describe('DeleteCategoryUseCase Integration Tests', () => {
  let useCase: DeleteCategoryUseCase;
  let repository: CategorySequelizeRepository;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    repository = new CategorySequelizeRepository(CategoryModel);
    useCase = new DeleteCategoryUseCase(repository);
  });

  it('should throws error when entity not found', async () => {
    const uuid = new Uuid();
    await expect(() => useCase.execute({ id: uuid.id })).rejects.toThrow(
      new NotFoundError(uuid.id, Category),
    );
  });

  it('should delete a category', async () => {
    const category = Category.fake().aCategory().build();
    await repository.insert(category);
    await useCase.execute({
      id: category.categoryId.id,
    });
    await expect(repository.findById(category.categoryId)).resolves.toBeNull();
  });
});
