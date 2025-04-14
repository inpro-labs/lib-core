import { Result, Ok, Err, Combine } from '../../lib/core/result';

describe('Result', () => {
  const successValue = 42;
  const errorValue = new Error('Algo deu errado');

  it('should create a successful result with ok()', () => {
    const result = Result.ok(successValue);

    expect(result.isOk()).toBe(true);
    expect(result.isErr()).toBe(false);
    expect(result.unwrap()).toBe(successValue);
  });

  it('should create an error result with err()', () => {
    const result = Result.err(errorValue);

    expect(result.isOk()).toBe(false);
    expect(result.isErr()).toBe(true);
    expect(result.getErr()).toBe(errorValue);
  });

  it('should throw when unwrap() is called on an error result', () => {
    const result = Result.err(errorValue);

    expect(() => result.unwrap()).toThrow(errorValue);
  });

  it('should throw when unwrapErr() is called on a success result', () => {
    const result = Result.ok(successValue);

    expect(() => result.unwrapErr()).toThrow(
      'Tried to unwrapErr() on a successful Result',
    );
  });

  it('should return the value with expect() if ok', () => {
    const result = Result.ok('data');

    expect(result.expect('Deu ruim')).toBe('data');
  });

  it('should throw with custom message if expect() on err', () => {
    const result = Result.err(new Error('original'));

    expect(() => result.expect('Custom fail')).toThrow('Custom fail');
  });

  it('getErr() should return null on success', () => {
    const result = Result.ok('valid');

    expect(result.getErr()).toBeNull();
  });

  it('should throw when Result is instantiated with both value and error', () => {
    expect(() => new Result(successValue, errorValue)).toThrow(
      'Result cannot have both a value and and error',
    );
  });

  it('should throw when Result is instantiated without arguments', () => {
    expect(() => new Result(null, null)).toThrow(
      'Result must have a value or an error',
    );
  });
});

describe('Ok and Err helpers', () => {
  it('Ok() should return a successful result', () => {
    const result = Ok('yes');

    expect(result.isOk()).toBe(true);
    expect(result.unwrap()).toBe('yes');
  });

  it('Err() should return an error result', () => {
    const err = new Error('oops');
    const result = Err(err);

    expect(result.isErr()).toBe(true);
    expect(result.unwrapErr()).toBe(err);
  });
});

describe('Combine()', () => {
  it('should combine multiple ok results', () => {
    const r1 = Ok('a');
    const r2 = Ok('b');
    const r3 = Ok('c');

    const result = Combine([r1, r2, r3] as const);

    expect(result.isOk()).toBe(true);
    expect(result.unwrap()).toEqual(['a', 'b', 'c']);
  });

  it('should return first error result if any is an error', () => {
    const err = new Error('fail');
    const r1 = Ok('a');
    const r2 = Err(err);
    const r3 = Ok('c');

    const result = Combine([r1, r2, r3] as const);

    expect(result.isErr()).toBe(true);
    expect(result.unwrapErr()).toBe(err);
  });

  it('fromPromise() should return a successful result', async () => {
    const result = await Result.fromPromise(Promise.resolve('yes'));

    expect(result.isOk()).toBe(true);
    expect(result.unwrap()).toBe('yes');
  });

  it('fromPromise() should return an error result', async () => {
    const error = new Error('fail');

    const result = await Result.fromPromise(Promise.reject(error));

    expect(result.isErr()).toBe(true);
    expect(result.unwrapErr()).toBe(error);
  });
});
