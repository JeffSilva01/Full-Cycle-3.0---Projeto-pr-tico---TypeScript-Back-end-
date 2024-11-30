import { ListCategoriesInput } from '@/core/category/application/use-case/list-category/list-category.use-case';
import { SortDirection } from '@/core/shared/domain/repository/search-params';

export class SearchCategoriesDto implements ListCategoriesInput {
  page?: number;
  perPage?: number;
  sort?: string;
  sortField?: SortDirection | null;
  filter?: string;
}
