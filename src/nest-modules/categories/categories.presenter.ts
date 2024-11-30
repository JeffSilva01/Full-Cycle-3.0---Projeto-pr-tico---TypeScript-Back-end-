import { Transform } from 'class-transformer';
import { CategoryOutput } from '@/core/category/application/use-case/common/category-output';
import { ListCategoriesOutput } from '@/core/category/application/use-case/list-category/list-category.use-case';
import { CollectionPresenter } from '../shared/collection.presenter';

export class CategoryPresenter {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  @Transform(({ value }: { value: Date }) => value.toISOString())
  createdAt: Date;

  constructor(output: CategoryOutput) {
    this.id = output.id;
    this.name = output.name;
    this.description = output.description;
    this.isActive = output.isActive;
    this.createdAt = output.createdAt;
  }
}

export class CategoriesCollectionPresenter extends CollectionPresenter {
  data: CategoryPresenter[];

  constructor(output: ListCategoriesOutput) {
    const { items, ...paginationProps } = output;
    super(paginationProps);
    this.data = items.map((item) => new CategoryPresenter(item));
  }
}
