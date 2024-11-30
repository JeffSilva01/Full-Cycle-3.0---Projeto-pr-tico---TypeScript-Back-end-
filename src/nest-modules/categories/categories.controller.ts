import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateCategoryUseCase } from '@/core/category/application/use-case/create-category/create-category.use-case';
import { UpdateCategoryUseCase } from '@/core/category/application/use-case/update-category/update-category.use-case';
import { GetCategoryUseCase } from '@/core/category/application/use-case/get-category/get-category.use-case';
import { DeleteCategoryUseCase } from '@/core/category/application/use-case/delete-category/delete-category.use-case';
import { ListCategoriesUseCase } from '@/core/category/application/use-case/list-category/list-category.use-case';
import { CategoriesPresenter } from './categories.presenter';
import { CategoryOutput } from '@/core/category/application/use-case/common/category-output';

@Controller('categories')
export class CategoriesController {
  @Inject(CreateCategoryUseCase)
  private createUseCase: CreateCategoryUseCase;

  @Inject(UpdateCategoryUseCase)
  private updateUseCase: UpdateCategoryUseCase;

  @Inject(GetCategoryUseCase)
  private getUseCase: GetCategoryUseCase;

  @Inject(DeleteCategoryUseCase)
  private deleteUseCase: DeleteCategoryUseCase;

  @Inject(ListCategoriesUseCase)
  private listeUseCase: ListCategoriesUseCase;

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const result = await this.createUseCase.execute(createCategoryDto);

    return CategoriesController.serialize(result);
  }

  @Get()
  findAll() {}

  @Get(':id')
  findOne(@Param('id') id: string) {}

  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const result = await this.updateUseCase.execute({
      ...updateCategoryDto,
      id,
    });

    return CategoriesController.serialize(result);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {}

  static serialize(output: CategoryOutput) {
    return new CategoriesPresenter(output);
  }
}
