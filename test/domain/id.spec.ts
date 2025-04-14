import { ID } from '../../lib/domain/id';

describe('ID', () => {
  it('should generate a new ID if none is provided', () => {
    const result = ID.create();

    expect(result.isOk()).toBe(true);

    const id = result.unwrap();
    expect(typeof id.value()).toBe('string');
    expect(id.value()).toHaveLength(36);
    expect(id.isNew()).toBe(true);
  });

  it('should create an ID with a provided value', () => {
    const input = '123e4567-e89b-12d3-a456-426614174000';
    const result = ID.create(input);

    expect(result.isOk()).toBe(true);

    const id = result.unwrap();
    expect(id.value()).toBe(input);
    expect(id.isNew()).toBe(false);
  });

  it('should compare two IDs correctly with equals()', () => {
    const resultA = ID.create('abc-123');
    const resultB = ID.create('abc-123');
    const resultC = ID.create('xyz-789');

    const idA = resultA.unwrap();
    const idB = resultB.unwrap();
    const idC = resultC.unwrap();

    expect(idA.equals(idB)).toBe(true);
    expect(idA.equals(idC)).toBe(false);
  });

  it('should return the correct value via value()', () => {
    const result = ID.create('my-id');
    const id = result.unwrap();

    expect(id.value()).toBe('my-id');
  });
});
