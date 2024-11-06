import { IUseCase } from "@/shared/application/use-case.interface";
import { Category } from "@/category/domain/category.entity";
import { ICategoryRepository } from "@/category/domain/category.repository";
import {
  CategoryOutput,
  CategoryOutputMapper,
} from "../common/category-output";
import { CreateCategoryInput } from "./create-category.input";

export type CreateCategoryOutput = CategoryOutput;

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

    return CategoryOutputMapper.toOutput(category);
  }
}
