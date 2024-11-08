import { CategoryInMemoryRepository } from '@/category/infra/db/in-memory/category-in-memory.repository';
import { InvalidUuidError, Uuid } from '@/shared/domain/value-objects/uuid.vo';
import { NotFoundError } from '@/shared/domain/validators/errors/not-found.errr';
import { Category } from '@/category/domain/category.entity';
import { DeleteCategoryUseCase } from '../delete-category.use-case';

describe('DeleteCategoryUseCase Unit Tests', () => {
  let useCase: DeleteCategoryUseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new DeleteCategoryUseCase(repository);
  });

  it('should throws error when entity not found', async () => {
    await expect(() => useCase.execute({ id: 'fake id' })).rejects.toThrow(
      new InvalidUuidError(),
    );

    const uuid = new Uuid();

    await expect(() => useCase.execute({ id: uuid.id })).rejects.toThrow(
      new NotFoundError(uuid.id, Category),
    );
  });

  it('should delete a category', async () => {
    const items = [new Category({ name: 'test 1' })];
    repository.items = items;
    await useCase.execute({
      id: items[0].categoryId.id,
    });
    expect(repository.items).toHaveLength(0);
  });
});
