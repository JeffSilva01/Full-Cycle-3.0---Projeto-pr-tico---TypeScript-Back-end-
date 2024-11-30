import { UpdateCategoryInput } from '@/core/category/application/use-case/update-category/update-category.input';
import { OmitType } from '@nestjs/mapped-types';

export class UpdateCategoryInputWithoutId extends OmitType(
  UpdateCategoryInput,
  ['id'],
) {}

export class UpdateCategoryDto extends UpdateCategoryInputWithoutId {}
