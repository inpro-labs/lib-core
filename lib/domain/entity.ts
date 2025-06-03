import { ID } from './id';
import { SettersAndGetters } from './setters-and-getters';
import { serializeProps } from '../utils/serialize-props';

/**
 * PlainEntity is a type that represents the plain object representation of an entity.
 * It is used to convert an entity to a plain object.
 * @template T - The type of the entity's properties.
 */
export type PlainEntity<T> = {
  [K in keyof T]: T[K] extends ID
    ? string
    : T[K] extends { toObject(): infer R }
      ? R
      : T[K] extends Date
        ? Date
        : T[K];
} & { id: string };

/**
 * Base class for domain entities.
 *
 * Represents an object with a unique identity and encapsulates behavior
 * related to equality, persistence state, and data representation.
 *
 * @template Props - The entity's properties.
 */
export class Entity<
  T extends object = Record<PropertyKey, any> & { id?: string | ID },
> extends SettersAndGetters<Omit<T, 'id'>> {
  /** The ID of the entity. */
  private readonly _id: ID;

  /**
   * Creates a new instance of the entity.
   *
   * @param props - The entity's properties, including an `id`.
   * @throws If the provided ID is invalid.
   */
  constructor(props: T & { id?: string | ID }) {
    let id: ID;

    if (props.id instanceof ID) {
      id = props.id;
    } else {
      id = ID.create(props.id as string).unwrap();
    }

    super({ ...props, id });

    this._id = id;
  }

  /**
   * Returns the entity's ID.
   *
   * @returns The entity's `ID` instance.
   */
  get id(): ID {
    return this._id;
  }

  /**
   * Determines if the entity is new based on the ID.isNew() method.
   *
   * @returns `true` if the ID is considered new, otherwise `false`.
   */
  public isNew(): boolean {
    return this._id.isNew();
  }

  /**
   * Compares this entity to another based on identity (ID).
   *
   * @param entity - The entity to compare against.
   * @returns `true` if the entities are the same instance or share the same ID.
   */
  /**
   * Performs a deep equality check between two value objects.
   *
   * @param entity - The entity to compare with.
   * @returns `true` if both entities have deeply equal properties.
   */
  public equals(entity: Entity<T>): boolean {
    return this._id.equals(entity._id);
  }

  /**
   * Converts the entity's properties to a plain JavaScript object.
   *
   * @param adapter - An optional adapter to transform the entity's properties.
   * @returns A shallow copy of the entity's properties.
   */
  public toObject(): PlainEntity<T> {
    const plainProps = serializeProps(
      this._props as Record<PropertyKey, unknown>,
    );

    return {
      ...plainProps,
      id: this._id.value(),
    } as PlainEntity<T>;
  }
  /**
   * Creates a deep clone of the entity.
   *
   * @returns A new instance of the entity with cloned properties.
   */
  public clone(): this {
    return new (this.constructor as new (props: T) => this)({
      ...this._props,
      id: this._id,
    } as T);
  }
}
