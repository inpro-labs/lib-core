import { Entity } from '../../lib/domain/entity';
import { ID } from '../../lib/domain/id';
import { ValueObject } from '../../lib/domain/value-object';

class TestEntity extends Entity<{
  id: ID;
  name: string;
  value: ValueObject<{ teste: string }>;
  userId: ID;
  createdAt: Date;
}> {
  constructor(props: {
    id: ID;
    name: string;
    value: ValueObject<{ teste: string }>;
    userId: ID;
    createdAt: Date;
  }) {
    super(props);
  }
}

describe('Entity', () => {
  it('should create an entity', () => {
    const createdAt = new Date();

    const entity = new TestEntity({
      id: ID.create('1').unwrap(),
      name: 'John Doe',
      value: new ValueObject({ teste: 'John Doe' }),
      userId: ID.create('2').unwrap(),
      createdAt,
    });

    expect(entity).toBeDefined();
    expect(entity.id).toBeDefined();
    expect(entity.id.value()).toBe('1');
    expect(entity.get('name')).toBe('John Doe');
    expect(entity.get('value')).toBeDefined();
    expect(entity.get('value').props.teste).toBe('John Doe');
  });

  it('should transform to object', () => {
    const createdAt = new Date();
    const value = new ValueObject({ teste: 'John Doe' });

    const entity = new TestEntity({
      id: ID.create('1').unwrap(),
      name: 'John Doe',
      userId: ID.create('2').unwrap(),
      value,
      createdAt,
    });

    const obj = entity.toObject();

    expect(obj).toEqual({
      id: '1',
      name: 'John Doe',
      value: { teste: 'John Doe' },
      userId: '2',
      createdAt,
    });
  });

  it('should clone the entity', () => {
    const entity = new TestEntity({
      id: ID.create('1').unwrap(),
      name: 'John Doe',
      value: new ValueObject({ teste: 'John Doe' }),
      userId: ID.create('2').unwrap(),
      createdAt: new Date(),
    });

    const clone = entity.clone();

    expect(clone).toEqual(entity);
  });

  it('should return true for isNew when ID is generated', () => {
    const entity = new TestEntity({
      id: ID.create().unwrap(), // sem passar ID, gera novo
      name: 'New Entity',
      value: new ValueObject({ teste: 'data' }),
      userId: ID.create('user-1').unwrap(),
      createdAt: new Date(),
    });

    expect(entity.isNew()).toBe(true);
  });

  it('should return false for isNew when ID is provided', () => {
    const entity = new TestEntity({
      id: ID.create('1').unwrap(),
      name: 'Old Entity',
      value: new ValueObject({ teste: 'data' }),
      userId: ID.create('user-1').unwrap(),
      createdAt: new Date(),
    });

    expect(entity.isNew()).toBe(false);
  });

  it('should return true for equals if same ID', () => {
    const commonId = ID.create('1').unwrap();

    const e1 = new TestEntity({
      id: commonId,
      name: 'Entity A',
      value: new ValueObject({ teste: 'abc' }),
      userId: ID.create('x').unwrap(),
      createdAt: new Date(),
    });

    const e2 = new TestEntity({
      id: commonId,
      name: 'Entity B', // different props
      value: new ValueObject({ teste: 'def' }),
      userId: ID.create('y').unwrap(),
      createdAt: new Date(),
    });

    expect(e1.equals(e2)).toBe(true);
  });

  it('should return false for equals if different IDs', () => {
    const e1 = new TestEntity({
      id: ID.create('1').unwrap(),
      name: 'Entity A',
      value: new ValueObject({ teste: 'abc' }),
      userId: ID.create('x').unwrap(),
      createdAt: new Date(),
    });

    const e2 = new TestEntity({
      id: ID.create('2').unwrap(),
      name: 'Entity B',
      value: new ValueObject({ teste: 'abc' }),
      userId: ID.create('x').unwrap(),
      createdAt: new Date(),
    });

    expect(e1.equals(e2)).toBe(false);
  });
});
