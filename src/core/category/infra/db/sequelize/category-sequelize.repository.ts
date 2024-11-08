import { Op } from 'sequelize';
import { NotFoundError } from '../../../../shared/domain/validators/errors/not-found.errr';
import { Uuid } from '../../../../shared/domain/value-objects/uuid.vo';
import { Category } from '../../../domain/category.entity';
import {
  CategorySearchParams,
  CategorySearchResult,
  ICategoryRepository,
} from '../../../domain/category.repository';
import { CategoryModel } from './category.model';
import { CategoryModelMapper } from './category-model-mapper';

export class CategorySequelizeRepository implements ICategoryRepository {
  sortableFields: string[] = ['name', 'createdAt'];

  constructor(private categoryModel: typeof CategoryModel) {}

  async insert(entity: Category): Promise<void> {
    const model = CategoryModelMapper.toModel(entity);

    await this.categoryModel.create(model.toJSON());
  }

  async bulkInsert(entities: Category[]): Promise<void> {
    const models = entities.map((entity) =>
      CategoryModelMapper.toModel(entity).toJSON(),
    );

    await this.categoryModel.bulkCreate(models);
  }

  async update(entity: Category): Promise<void> {
    const id = entity.categoryId.id;
    const modelExistes = await this._get(id);

    if (!modelExistes) {
      throw new NotFoundError(id, this.getEntity());
    }

    const model = CategoryModelMapper.toModel(entity);

    await this.categoryModel.update(model.toJSON(), {
      where: { categoryId: id },
    });
  }

  async delete(entityId: Uuid): Promise<void> {
    const model = await this._get(entityId.id);

    if (!model) {
      throw new NotFoundError(entityId.id, this.getEntity());
    }

    await this.categoryModel.destroy({ where: { categoryId: entityId.id } });
  }

  async findById(entityId: Uuid): Promise<Category | null> {
    const model = await this._get(entityId.id);

    if (!model) {
      return null;
    }

    return CategoryModelMapper.toEntity(model);
  }

  private async _get(id: string) {
    return await this.categoryModel.findByPk(id);
  }

  async findAll(): Promise<Category[]> {
    const categories = await this.categoryModel.findAll();

    return categories.map(CategoryModelMapper.toEntity);
  }

  async search(props: CategorySearchParams): Promise<CategorySearchResult> {
    const offset = (props.page - 1) * props.per_page;
    const limit = props.per_page;

    const { rows: models, count } = await this.categoryModel.findAndCountAll({
      ...(props.filter && {
        where: {
          name: { [Op.like]: `%${props.filter}%` },
        },
      }),
      ...(props.sort && this.sortableFields.includes(props.sort)
        ? { order: [[props.sort, props.sort_dir!]] }
        : { order: [['created_at', 'desc']] }),
      offset,
      limit,
    });

    return new CategorySearchResult({
      items: models.map(CategoryModelMapper.toEntity),
      total: count,
      per_page: props.per_page,
      current_page: props.page,
    });
  }

  getEntity(): new (...args: any[]) => Category {
    return Category;
  }
}
