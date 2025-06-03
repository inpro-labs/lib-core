import { Aggregate } from '../../lib/domain/aggregate';
import { ID } from '../../lib/domain/id';
import { Entity, ValueObject } from '../../lib/domain';

type TestProps = {
  id?: string | ID;
  name: string;
  entityTest: TestEntity;
  valueObjectTest: TestValueObject;
};

class TestEvent {
  constructor(public readonly name: string) {}
}

class TestAggregate extends Aggregate<TestProps> {
  constructor(props: TestProps) {
    super(props);
  }

  public changeName(name: string) {
    this.set('name', name);
  }

  public applyEvent() {
    this.apply(new TestEvent(this.get('name')));
  }
}

class TestEntity extends Entity<{
  id?: ID;
  nameEntity: string;
  entityValueObject: TestEntityValueObject;
}> {
  constructor(props: {
    id?: ID;
    nameEntity: string;
    entityValueObject: TestEntityValueObject;
  }) {
    super(props);
  }
}

class TestValueObject extends ValueObject<{ nameValueObject: string }> {
  constructor(props: { nameValueObject: string }) {
    super(props);
  }
}

class TestEntityValueObject extends ValueObject<{
  nameEntityValueObject: string;
}> {
  constructor(props: { nameEntityValueObject: string }) {
    super(props);
  }
}

describe('Aggregate', () => {
  const initialProps = {
    id: ID.create('1').unwrap(),
    name: 'Aggregate',
    entityTest: new TestEntity({
      id: ID.create('1').unwrap(),
      nameEntity: 'Entity',
      entityValueObject: new TestEntityValueObject({
        nameEntityValueObject: 'Value Object 1',
      }),
    }),
    valueObjectTest: new TestValueObject({ nameValueObject: 'Value Object 2' }),
  };

  const initialPropsWithUndefinedId = {
    id: undefined,
    name: 'Aggregate',
  };

  function makeAggregate(props: Partial<TestProps> = initialProps) {
    return new TestAggregate({
      ...props,
      name: props.name ?? 'Aggregate',
      entityTest:
        props.entityTest ??
        new TestEntity({
          nameEntity: 'Entity',
          entityValueObject: new TestEntityValueObject({
            nameEntityValueObject: 'Value Object 1',
          }),
        }),
      valueObjectTest:
        props.valueObjectTest ??
        new TestValueObject({ nameValueObject: 'Value Object 2' }),
    });
  }

  it('should initialize with a valid ID and props', () => {
    const agg = makeAggregate();

    expect(agg.id).toBeInstanceOf(ID);
    expect(agg.get('name')).toBe('Aggregate');
  });

  it('should initialize with a valid ID and props', () => {
    const agg = makeAggregate({
      id: ID.create('123').unwrap(),
      name: 'Aggregate',
    });

    expect(agg.id).toBeInstanceOf(ID);
    expect(agg.get('name')).toBe('Aggregate');
  });
  it('should change a property using the protected set method', () => {
    const agg = makeAggregate();
    agg.changeName('João');

    expect(agg.get('name')).toBe('João');
    expect(agg.props.name).toBe('João');
  });

  it('should return true from isNew() if ID is new', () => {
    const agg = makeAggregate(initialPropsWithUndefinedId);

    expect(agg.isNew()).toBe(true);
  });

  it('should return false from isNew() if ID is not new', () => {
    const agg = makeAggregate(initialProps);

    expect(agg.isNew()).toBe(false);
  });

  it('should return true when comparing aggregates with the same ID', () => {
    const aggA = makeAggregate(initialProps);
    const aggB = makeAggregate(initialProps);

    expect(aggA.equals(aggB)).toBe(true);
  });

  it('should return false when comparing aggregates with different IDs', () => {
    const aggA = makeAggregate({ id: 'a', name: 'X' });
    const aggB = makeAggregate({ id: 'b', name: 'X' });

    expect(aggA.equals(aggB)).toBe(false);
  });

  it('should serialize props to plain object with toObject', () => {
    const agg = makeAggregate();

    const result = agg.toObject();

    expect(result).toEqual({
      id: '1',
      name: 'Aggregate',
      entityTest: {
        id: '1',
        nameEntity: 'Entity',
        entityValueObject: {
          nameEntityValueObject: 'Value Object 1',
        },
      },
      valueObjectTest: {
        nameValueObject: 'Value Object 2',
      },
    });
  });

  it('should apply events', () => {
    const agg = makeAggregate();

    agg.applyEvent();

    expect(agg.getUncommittedEvents().length).toBe(1);
    expect(agg.getUncommittedEvents()[0]).toBeInstanceOf(TestEvent);
  });

  it('should clone the aggregate', () => {
    const agg = makeAggregate();

    const clone = agg.clone();

    expect(clone).toEqual(agg);
  });

  it('should return true for equals() if ID is the same', () => {
    const aggA = makeAggregate(initialProps);
    const aggB = makeAggregate(initialProps);

    expect(aggA.equals(aggB)).toBe(true);
  });

  it('should return false for equals() if ID is different', () => {
    const aggA = makeAggregate(initialProps);
    const aggB = makeAggregate({ ...initialProps, id: 'b' });

    expect(aggA.equals(aggB)).toBe(false);
  });
});
