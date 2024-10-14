import { IUseCase } from "../../../shared/application/use-case.interface";
import { NotFoundError } from "../../../shared/domain/validators/errors/not-found.errr";
import { Uuid } from "../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../../domain/category.entity";
import { ICategoryRepository } from "../../domain/category.repository";
import { CategoryOutput, CategoryOutputMapper } from "./common/category-output";

export type UpdateCategoryInput = {
  id: string;
  name?: string;
  description?: string;
  isActive?: boolean;
};

export type UpdateCategoryOutput = CategoryOutput;

export class UpdateCategoryUseCase
  implements IUseCase<UpdateCategoryInput, UpdateCategoryOutput>
{
  constructor(private categoryRepo: ICategoryRepository) {}

  async execute(input: UpdateCategoryInput): Promise<UpdateCategoryOutput> {
    const uuid = new Uuid(input.id);
    const category = await this.categoryRepo.findById(uuid);

    if (!category) {
      throw new NotFoundError(input.id, Category);
    }

    input.name && category.changeName(input.name);

    if ("description" in input) {
      category.changeDescription(input.description ?? null);
    }

    if (input.isActive === true) {
      category.activate();
    }

    if (input.isActive === false) {
      category.deactivate();
    }

    await this.categoryRepo.update(category);

    return CategoryOutputMapper.toOutput(category);
  }
}
