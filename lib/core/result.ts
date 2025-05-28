/**
 * A wrapper to represent the result of an operation that can succeed or fail.
 *
 * This is a functional alternative to using `try/catch` blocks.
 *
 * @template T - The success value type.
 * @template E - The error type (extends Error).
 */
export class Result<T = unknown, E extends Error = Error> {
  #value: T | E;
  #isSuccess: boolean;

  /**
   * Internal constructor. Use `Result.ok()` or `Result.err()` to instantiate.
   *
   * @param value - The value (success or error).
   * @param isSuccess - Whether this is a success result.
   */
  constructor(value: T | E, isSuccess: boolean) {
    this.#value = value;
    this.#isSuccess = isSuccess;
  }

  /**
   * Returns the success value or throws the error if it's an error result.
   *
   * @returns The success value.
   * @throws The error value if this result is an error.
   */
  unwrap(): T {
    if (this.isOk()) {
      return this.#value as T;
    }

    throw this.#value as E;
  }

  /**
   * Returns the error value or throws an error if it's a successful result.
   *
   * @returns The error value.
   * @throws If this result is a successful result.
   */
  unwrapErr(): E {
    if (this.isErr()) {
      return this.#value as E;
    }

    throw new Error('Tried to unwrapErr() on a successful Result');
  }

  /**
   * Returns the success value or throws a custom error message if it's an error.
   *
   * @param msg - The error message or an error instance.
   * @returns The success value.
   * @throws An error with the provided message if this is an error result.
   */
  expect(msg: string | E): T {
    if (this.isOk()) {
      return this.#value as T;
    }

    if (msg instanceof Error) {
      throw msg;
    }

    throw new Error(msg);
  }

  /**
   * Checks whether this result is a success.
   *
   * @returns `true` if the result is OK.
   */
  isOk(): this is Result<T, never> {
    return this.#isSuccess;
  }

  /**
   * Checks whether this result is an error.
   *
   * @returns `true` if the result is an error.
   */
  isErr(): this is Result<never, E> {
    return !this.#isSuccess;
  }

  /**
   * Returns the error if present, otherwise `null`.
   *
   * @returns The error value or null.
   */
  getErr(): E | null {
    return this.isErr() ? (this.#value as E) : null;
  }

  /**
   * Creates a `Result` from a `Promise`.
   *
   * @template T - The type of the success value.
   * @template E - The type of the error value (extends Error).
   * @param promise - The promise to convert.
   * @returns A `Promise` that resolves to a `Result`.
   */
  static async fromPromise<T, E extends Error>(
    promise: Promise<T>,
  ): Promise<Result<T, E>> {
    try {
      const value = await promise;
      return Ok(value);
    } catch (error) {
      return Err(error as E);
    }
  }

  /**
   * Creates a successful result.
   *
   * @param value - The success value.
   * @returns A `Result` representing success.
   */
  static ok<T>(value: T): Result<T> {
    return new Result<T, never>(value, true);
  }

  /**
   * Creates an error result.
   *
   * @param error - The error value.
   * @returns A `Result` representing failure.
   */
  static err<E extends Error>(error: E): Result<never, E> {
    return new Result<never, E>(error, false);
  }

  /**
   * Creates a result from a function that may throw an error.
   *
   * @param fn - The function to execute.
   * @param error - The error to return if the function throws an error.
   * @returns A `Result` representing the result of the function.
   */
  static catch<T, E extends Error>(fn: () => T, error?: E): Result<T, E> {
    try {
      return Ok(fn());
    } catch (err) {
      return Err(error ?? (err as E));
    }
  }
}

/**
 * Helper function to create a successful result.
 *
 * @param value - The success value.
 * @returns A `Result` representing success.
 */
export function Ok<T>(value: T): Result<T, never> {
  return new Result<T, never>(value, true);
}

/**
 * Helper function to create an error result.
 *
 * @param error - The error value.
 * @returns A `Result` representing failure.
 */
export function Err<E extends Error>(error: E): Result<never, E> {
  return new Result<never, E>(error, false);
}

/**
 * Combines an array of `Result` objects into a single `Result` object.
 */
type ResultArray<T extends readonly unknown[], E extends Error> = {
  [K in keyof T]: Result<T[K], E>;
};

export function Combine<T extends readonly unknown[], E extends Error>(
  results: ResultArray<T, E>,
): Result<T, E> {
  const values: unknown[] = [];

  for (const result of results) {
    if (result.isErr()) {
      return Err(result.unwrapErr());
    }
    values.push(result.unwrap());
  }

  return Ok(values as unknown as T);
}
