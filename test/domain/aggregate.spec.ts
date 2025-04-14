import { Aggregate } from '../../lib/domain/aggregate';
import { ID } from '../../lib/domain/id';
import { Adapter } from '../../lib/domain/adapter';

type TestProps = {
  id?: string | ID;
  name: string;
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

describe('Aggregate', () => {
  const initialProps = {
    id: 'user-123',
    name: 'Maxwell',
  };

  const initialPropsWithUndefinedId = {
    id: undefined,
    name: 'Maxwell',
  };

  function makeAggregate(props: TestProps = initialProps) {
    return new TestAggregate({ ...props });
  }

  it('should initialize with a valid ID and props', () => {
    const agg = makeAggregate();

    expect(agg.id).toBeInstanceOf(ID);
    expect(agg.get('name')).toBe('Maxwell');
  });

  it('should initialize with a valid ID and props', () => {
    const agg = makeAggregate({
      id: ID.create('123').unwrap(),
      name: 'Maxwell',
    });

    expect(agg.id).toBeInstanceOf(ID);
    expect(agg.get('name')).toBe('Maxwell');
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
      id: 'user-123',
      name: 'Maxwell',
    });
  });

  it('should use custom adapter if provided', () => {
    const agg = makeAggregate();

    const adapter: Adapter<
      TestAggregate,
      { aggregateId: string; upperName: string }
    > = {
      adaptOne: (a) => ({
        aggregateId: a.id.value(),
        upperName: a.get('name').toUpperCase(),
      }),
    };

    const result = agg.toObject(adapter);

    expect(result).toEqual({
      aggregateId: 'user-123',
      upperName: 'MAXWELL',
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
});
