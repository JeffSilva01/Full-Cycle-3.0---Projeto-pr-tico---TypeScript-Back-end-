import { Entity } from '../../../../domain/entity';
import { NotFoundError } from '../../../../domain/validators/errors/not-found.errr';
import { Uuid } from '../../../../domain/value-objects/uuid.vo';
import { InMemoryRepository } from '../in-memory.repository';

type StubEntityConstructor = {
  entityId?: Uuid;
  name: string;
  price: number;
};

class StubEntity extends Entity {
  entityId: Uuid;
  name: string;
  price: number;

  constructor({ entityId, name, price }: StubEntityConstructor) {
    super();
    this.entityId = entityId || new Uuid();
    this.name = name;
    this.price = price;
  }

  toJSON() {
    return {
      entityId: this.entityId.id,
      name: this.name,
      price: this.price,
    };
  }
}

class StubInMemoryRepository extends InMemoryRepository<StubEntity, Uuid> {
  getEntity(): new (...args: any[]) => StubEntity {
    return StubEntity;
  }
}

describe('InMemoryRepository Unit Tests', () => {
  let repo: StubInMemoryRepository;

  beforeEach(() => {
    repo = new StubInMemoryRepository();
  });

  it('should insert a new entity', async () => {
    const entity = new StubEntity({
      name: 'Test',
      price: 100,
    });

    await repo.insert(entity);

    expect(repo.items.length).toBe(1);
    expect(repo.items[0]).toBe(entity);
    expect(repo.items[0].entityId.id).toBe(entity.entityId.id);
    expect(repo.items[0].name).toBe(entity.name);
    expect(repo.items[0].price).toBe(entity.price);
  });

  it('should bulk insert entities', async () => {
    const entity1 = new StubEntity({
      name: 'Test 1',
      price: 100,
    });

    const entity2 = new StubEntity({
      name: 'Test 2',
      price: 200,
    });

    await repo.bulkInsert([entity1, entity2]);

    expect(repo.items.length).toBe(2);
    expect(repo.items[0]).toBe(entity1);
    expect(repo.items[1]).toBe(entity2);
  });

  it('should update an entity', async () => {
    const entity = new StubEntity({
      name: 'Test',
      price: 100,
    });

    await repo.insert(entity);

    entity.name = 'Updated';

    await repo.update(entity);

    expect(repo.items.length).toBe(1);
    expect(repo.items[0].name).toBe('Updated');
  });

  it('should throw an error when trying to update an entity that does not exist', async () => {
    const entity = new StubEntity({
      name: 'Test',
      price: 100,
    });

    await expect(repo.update(entity)).rejects.toThrow(
      new NotFoundError(entity.entityId, StubEntity),
    );
  });

  it('should delete an entity', async () => {
    const entity = new StubEntity({
      name: 'Test',
      price: 100,
    });

    await repo.insert(entity);

    await repo.delete(entity.entityId);

    expect(repo.items.length).toBe(0);
  });

  it('should throw an error when trying to delete an entity that does not exist', async () => {
    const entity = new StubEntity({
      name: 'Test',
      price: 100,
    });

    await expect(repo.delete(entity.entityId)).rejects.toThrow(
      new NotFoundError(entity.entityId, StubEntity),
    );
  });

  it('should find an entity by id', async () => {
    const entity = new StubEntity({
      name: 'Test',
      price: 100,
    });

    await repo.insert(entity);

    const foundEntity = await repo.findById(entity.entityId);

    expect(foundEntity).toBe(entity);
  });

  it('should find all entities', async () => {
    const entity1 = new StubEntity({
      name: 'Test 1',
      price: 100,
    });

    const entity2 = new StubEntity({
      name: 'Test 2',
      price: 200,
    });

    await repo.bulkInsert([entity1, entity2]);

    const entities = await repo.findAll();

    expect(entities.length).toBe(2);
    expect(entities[0]).toBe(entity1);
    expect(entities[1]).toBe(entity2);
  });
});
