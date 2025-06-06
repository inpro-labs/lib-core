import { ValueObject } from '../../lib/domain/value-object';

type FullNameProps = {
  first: string;
  last: string;
};

class FullName extends ValueObject<FullNameProps> {
  get fullName(): string {
    return `${this.props.first} ${this.props.last}`;
  }
}

describe('ValueObject', () => {
  const props = { first: 'Max', last: 'Silva' };

  const createVO = () => new FullName(props);

  it('should create a value object with given props', () => {
    const vo = createVO();

    expect(vo.props).toEqual(props);
    expect(vo.fullName).toBe('Max Silva');
  });

  it('should return true with deepEquals() if props are equal', () => {
    const voA = createVO();
    const voB = createVO();

    expect(voA.equals(voB)).toBe(true);
  });

  it('should return false with equals() if props are different', () => {
    const voA = createVO();
    const voB = new FullName({ first: 'João', last: 'Silva' });

    expect(voA.equals(voB)).toBe(false);
  });

  it('should return plain object from toObject()', () => {
    const vo = createVO();

    const result = vo.toObject();

    expect(result).toEqual({ first: 'Max', last: 'Silva' });
    expect(result).not.toBe(vo.props); // cópia, não referência
  });

  it('should clone the value object with same props', () => {
    const original = createVO();
    const clone = original.clone();

    expect(clone).not.toBe(original);
    expect(clone.equals(original)).toBe(true);
    expect(clone.fullName).toBe(original.fullName);
  });
});
