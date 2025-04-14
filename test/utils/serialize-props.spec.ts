import { serializeProps } from '../../lib/utils/serialize-props';
import { Entity } from '../../lib/domain/entity';

type AddressProps = {
  id: string;
  city: string;
};

class AddressEntity extends Entity<AddressProps> {
  get city(): string {
    return this.get('city');
  }
}

type UserProps = {
  id: string;
  name: string;
  address: AddressEntity;
};

class UserEntity extends Entity<UserProps> {
  get name(): string {
    return this.get('name');
  }

  get address(): AddressEntity {
    return this.get('address');
  }
}

describe('serializeProps', () => {
  it('should serialize Entity props including nested Entity and ID', () => {
    const address = new AddressEntity({
      id: 'addr-1',
      city: 'São Paulo',
    });

    const user = new UserEntity({
      id: 'user-1',
      name: 'Maxwell',
      address,
    });

    const result = serializeProps(user.props);

    expect(result.id).toBe('user-1');
    expect(result.name).toBe('Maxwell');

    expect(result.address).toEqual({
      id: 'addr-1',
      city: 'São Paulo',
    });
  });

  it('should preserve primitive types', () => {
    const entity = new Entity({
      id: 'id-1',
      value: 123,
      status: true,
      createdAt: new Date('2024-01-01'),
    });

    const result = serializeProps<typeof entity.props>(entity.props);

    expect(result.id).toBe('id-1');
    expect(result.value).toBe(123);
    expect(result.status).toBe(true);
    expect(result.createdAt instanceof Date).toBe(true);
    expect(result.createdAt.toISOString()).toBe('2024-01-01T00:00:00.000Z');
  });

  it('should handle empty props', () => {
    const result = serializeProps({});

    expect(result).toEqual({});
  });
});
