import { createConstant } from '../../lib/utils/constants';

describe('createConstant', () => {
  const Status = createConstant({
    ACTIVE: 'active',
    INACTIVE: 'inactive',
  });

  it('should return a frozen object', () => {
    expect(Object.isFrozen(Status)).toBe(true);
  });

  it('should expose values correctly', () => {
    expect(Status.values).toEqual(['active', 'inactive']);
  });

  it('should expose keys correctly', () => {
    expect(Status.keys).toEqual(['ACTIVE', 'INACTIVE']);
  });

  it('should allow access to individual constants', () => {
    expect(Status.ACTIVE).toBe('active');
    expect(Status.INACTIVE).toBe('inactive');
  });

  it('should not allow mutation', () => {
    expect(() => {
      Status.ACTIVE = 'changed';
    }).toThrow();
  });

  it('should match the expected type', () => {
    const test = Status.ACTIVE;
    const expected = test;

    expect(expected).toBe('active');
  });
});
