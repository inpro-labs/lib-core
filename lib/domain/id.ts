import { Result } from '../core';

/**
 * Represents a unique identifier (UUID) for domain entities or aggregates.
 *
 * Supports automatic ID generation and comparison logic.
 */
export class ID {
  /** Indicates whether this ID was auto-generated (i.e., not persisted yet). */
  private _isNew = false;

  /** The underlying UUID value of the ID. */
  private _value: string;

  /**
   * Private constructor. Use `ID.create()` to instantiate.
   *
   * @param value - Optional UUID string. If omitted, a new UUID is generated.
   */
  private constructor(value?: string) {
    if (value) {
      this._isNew = false;
      this._value = value;
    } else {
      this._isNew = true;
      this._value = crypto.randomUUID();
    }
  }

  /**
   * Factory method to create an `ID` instance wrapped in a `Result`.
   *
   * @param id - Optional UUID string.
   * @returns A `Result` wrapping a new `ID` instance.
   */
  static create(id?: string): Result<ID, Error> {
    return Result.ok(new ID(id));
  }

  /**
   * Checks if this ID is equal to another.
   *
   * @param id - The ID instance to compare with.
   * @returns `true` if the underlying values match, otherwise `false`.
   */
  public equals(id: ID): boolean {
    return this.value() === id.value();
  }

  /**
   * Returns the string value of the ID.
   *
   * @returns The UUID as a string.
   */
  public value(): string {
    return this._value;
  }

  /**
   * Indicates whether the ID was newly generated (i.e., not from persistence).
   *
   * @returns `true` if the ID is new, otherwise `false`.
   */
  public isNew(): boolean {
    return this._isNew;
  }
}
