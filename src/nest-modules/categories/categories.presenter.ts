import { Transform } from 'class-transform';
import { CategoryOutput } from '@/core/category/application/use-case/common/category-output';

export class CategoriesPresenter {
  id: string;
  name: string;
  description: string | null;

  @Transform(({ value }: { value: Date }) => value.toISOString())
  createdAt: Date;

  constructor(output: CategoryOutput) {
    this.id = output.id;
    this.name = output.name;
    this.description = output.description;
    this.createdAt = output.createdAt;
  }
}
