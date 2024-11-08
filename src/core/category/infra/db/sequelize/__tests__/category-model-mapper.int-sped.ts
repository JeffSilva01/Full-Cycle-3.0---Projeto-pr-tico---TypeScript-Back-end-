import { CategoryModel } from '../category.model';
import { CategorySequelizeRepository } from '../category-sequelize.repository';
import { Sequelize } from 'sequelize-typescript';

describe('CategoryModelMapper Integration Tests', () => {
  let sequelize;
  let repository;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      models: [CategoryModel],
      logging: false,
    });
    await sequelize.sync({ force: true });
    repository = new CategorySequelizeRepository(CategoryModel);
  });
});
