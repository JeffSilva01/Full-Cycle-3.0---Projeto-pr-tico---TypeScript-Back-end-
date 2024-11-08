import { IUseCase } from '@/shared/application/use-case.interface';
import { NotFoundError } from '@/shared/domain/validators/errors/not-found.errr';
import { Uuid } from '@/shared/domain/value-objects/uuid.vo';
import { Category } from '@/category/domain/category.entity';
import { ICategoryRepository } from '@/category/domain/category.repository';
import {
  CategoryOutput,
  CategoryOutputMapper,
} from '../common/category-output';

export type GetCategoryInput = {
  id: string;
};

export type GetCategoryOutput = CategoryOutput;

export class GetCategoryUseCase
  implements IUseCase<GetCategoryInput, GetCategoryOutput>
{
  constructor(private readonly categoryRepository: ICategoryRepository) {}
  async execute(input: GetCategoryInput): Promise<GetCategoryOutput> {
    const uuid = new Uuid(input.id);
    const category = await this.categoryRepository.findById(uuid);

    if (!category) {
      throw new NotFoundError(input.id, Category);
    }

    return CategoryOutputMapper.toOutput(category);
  }
}
