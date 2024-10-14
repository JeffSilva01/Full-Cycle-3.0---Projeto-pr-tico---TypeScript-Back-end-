import { IUseCase } from "../../shared/application/use-case.interface";
import { Category } from "../domain/category.entity";
import { ICategoryRepository } from "../domain/category.repository";

export type CreateCategoryInput = {
  name: string;
  description?: string | null;
  isActive?: boolean;
};

export type CreateCategoryOutput = {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
};

export class CreateCategoryUseCase
  implements IUseCase<CreateCategoryInput, CreateCategoryOutput>
{
  constructor(private readonly categoryRepository: ICategoryRepository) {}
  async execute({
    name,
    description,
    isActive,
  }: CreateCategoryInput): Promise<CreateCategoryOutput> {
    const category = Category.create({
      name,
      description,
      isActive,
    });

    await this.categoryRepository.insert(category);

    return {
      id: category.categoryId.id,
      name: category.name,
      description: category.description,
      isActive: category.isActive,
      createdAt: category.createdAt,
    };
  }
}
