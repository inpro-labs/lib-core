import { SettersAndGetters } from '../../lib/domain/setters-and-getters';

type Props = {
  name: string;
  age: number;
};

class TestSG extends SettersAndGetters<Props> {
  public change<K extends keyof Props>(key: K, value: Props[K]) {
    this.set(key, value);
  }
}

describe('SettersAndGetters', () => {
  const initialProps: Props = {
    name: 'Maxwell',
    age: 30,
  };

  const createInstance = () => new TestSG({ ...initialProps });

  it('should store props on creation', () => {
    const sg = createInstance();

    expect(sg.props).toEqual(initialProps);
  });

  it('should get a property by key', () => {
    const sg = createInstance();

    expect(sg.get('name')).toBe('Maxwell');
    expect(sg.get('age')).toBe(30);
  });

  it('should set a property by key', () => {
    const sg = createInstance();

    sg.change('name', 'João');

    expect(sg.get('name')).toBe('João');
    expect(sg.props.name).toBe('João');
  });
});
