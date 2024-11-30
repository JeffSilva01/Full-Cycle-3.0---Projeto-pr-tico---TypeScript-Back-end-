import { Entity } from '../../../domain/entity';
import {
  IRepository,
  ISearchableRepository,
} from '../../../domain/repository/repository-interface';
import {
  SearchParams,
  SortDirection,
} from '../../../domain/repository/search-params';
import { SearchResult } from '../../../domain/repository/search-result';
import { NotFoundError } from '../../../domain/validators/errors/not-found.errr';
import { ValueObject } from '../../../domain/value-object';

export abstract class InMemoryRepository<
  E extends Entity,
  EntityId extends ValueObject,
> implements IRepository<E, EntityId>
{
  items: E[] = [];

  async insert(entity: E): Promise<void> {
    this.items.push(entity);
  }

  async bulkInsert(entities: E[]): Promise<void> {
    this.items.push(...entities);
  }

  async update(entity: E): Promise<void> {
    const indexFound = this.items.findIndex((item) =>
      item.entityId.equals(entity.entityId),
    );

    if (indexFound === -1) {
      throw new NotFoundError(entity.entityId, this.getEntity());
    }

    this.items[indexFound] = entity;
  }

  async delete(entityId: EntityId): Promise<void> {
    const indexFound = this.items.findIndex((item) =>
      item.entityId.equals(entityId),
    );

    if (indexFound === -1) {
      throw new NotFoundError(entityId, this.getEntity());
    }

    this.items.splice(indexFound, 1);
  }

  async findById(entityId: EntityId): Promise<E | null> {
    const item = this.items.find((item) => item.entityId.equals(entityId));

    if (!item) {
      return null;
    }

    return item;
  }

  async findAll(): Promise<E[]> {
    return this.items;
  }

  abstract getEntity(): new (...args: any[]) => E;
}

export abstract class InMemorySearchableRepository<
    E extends Entity,
    EntityId extends ValueObject,
    Filter = string,
  >
  extends InMemoryRepository<E, EntityId>
  implements ISearchableRepository<E, EntityId, Filter>
{
  sortableFields: string[] = [];
  async search(props: SearchParams<Filter>): Promise<SearchResult<E>> {
    const itemsFiltered = await this.applyFilter(this.items, props.filter);
    const itemsSorted = this.applySort(
      itemsFiltered,
      props.sort,
      props.sortDir,
    );
    const itemsPaginated = this.applyPaginate(
      itemsSorted,
      props.page,
      props.perPage,
    );

    return new SearchResult({
      items: itemsPaginated,
      total: itemsFiltered.length,
      currentPage: props.page,
      perPage: props.perPage,
    });
  }

  protected abstract applyFilter(
    items: E[],
    filter: Filter | null,
  ): Promise<E[]>;

  protected applyPaginate(
    itmes: E[],
    page: SearchParams['page'],
    perPage: SearchParams['perPage'],
  ): E[] {
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return itmes.slice(start, end);
  }

  protected applySort(
    items: E[],
    sort: string | null,
    dortDir: SortDirection | null,
    customGetter?: (sort: string, item: E) => any,
  ) {
    if (!sort || !this.sortableFields.includes(sort)) {
      return items;
    }

    return [...items].sort((a, b) => {
      //@ts-ignore
      const aValue = customGetter ? customGetter(sort, a) : a[sort];
      //@ts-ignore
      const bValue = customGetter ? customGetter(sort, b) : b[sort];

      if (aValue > bValue) {
        return dortDir === 'asc' ? 1 : -1;
      }

      if (aValue < bValue) {
        return dortDir === 'asc' ? -1 : 1;
      }

      return 0;
    });
  }
}
