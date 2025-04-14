import { Adapter } from '../../lib/domain/adapter';

type FullNameProps = { first: string; last: string };
type FullNameDTO = { fullName: string };

class FullNameAdapter implements Adapter<FullNameProps, FullNameDTO> {
  adaptOne(from: FullNameProps): FullNameDTO {
    return { fullName: `${from.first} ${from.last}` };
  }

  adaptMany(from: FullNameProps[]): FullNameDTO[] {
    return from.map((f) => this.adaptOne(f));
  }
}

describe('FullNameAdapter', () => {
  const adapter = new FullNameAdapter();

  it('should adapt a single object', () => {
    const input = { first: 'Maxwell', last: 'Silva' };
    const result = adapter.adaptOne(input);

    expect(result).toEqual({ fullName: 'Maxwell Silva' });
  });

  it('should adapt many objects', () => {
    const input = [
      { first: 'Ana', last: 'Costa' },
      { first: 'João', last: 'Oliveira' },
    ];

    const result = adapter.adaptMany(input);

    expect(result).toEqual([
      { fullName: 'Ana Costa' },
      { fullName: 'João Oliveira' },
    ]);
  });
});
