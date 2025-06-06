import { AggregateRoot } from '@nestjs/cqrs';
import { ID } from './id';
import { serializeProps } from '../utils/serialize-props';
import type { PlainAggregate } from '../utils/deep-plain';

/**
 * Base class for domain aggregates.
 *
 * Extends NestJS CQRS's `AggregateRoot` to support event sourcing and encapsulates
 * properties and behavior related to a domain aggregate's identity and state.
 *
 * @template T - The type of the aggregate's properties.
 */
export class Aggregate<
  T extends object = Record<PropertyKey, unknown> & { id?: string | ID },
> extends AggregateRoot {
  /** Internal properties of the aggregate, including its ID. */
  private _props: T;
  /** The ID of the aggregate. */
  private readonly _id: ID;

  /**
   * Creates a new instance of the aggregate.
   *
   * @param props - The aggregate's properties, including an `id`.
   */
  constructor(props: T & { id?: string | ID }) {
    super();

    let id: ID;

    if (props.id instanceof ID) {
      id = props.id;
    } else {
      id = ID.create(props.id as string).unwrap();
    }
    this._props = { ...props };
    this._id = id;
  }

  /**
   * Returns the aggregate's ID.
   *
   * @returns The `ID` instance of this aggregate.
   */
  get id(): ID {
    return this._id;
  }

  /**
   * Returns the aggregate's properties.
   *
   * @returns The aggregate's properties.
   */
  get props(): T {
    return this._props;
  }

  /**
   * Sets a property on the aggregate.
   *
   * @param key - The key of the property to set.
   * @param value - The value to set the property to.
   */
  protected set<K extends keyof Omit<T, 'id'>>(key: K, value: T[K]): void {
    if (key === 'id') {
      throw new Error('Cannot set the ID of the aggregate');
    }

    this._props[key] = value;
  }

  /**
   * Gets a property from the aggregate.
   *
   * @param key - The key of the property to get.
   * @returns The value of the property.
   */
  public get<K extends keyof Omit<T, 'id'>>(key: K): T[K] {
    if (key === 'id') {
      return this._id as T[K];
    }

    return this._props[key];
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
   * Compares this aggregate to another based on identity (ID).
   *
   * @param aggregate - The aggregate to compare against.
   * @returns `true` if the aggregates are the same instance or share the same ID.
   */
  public equals(aggregate: Aggregate<T>): boolean {
    return this._id.equals(aggregate.id);
  }

  /**
   * Converts the aggregate's properties to a plain JavaScript object.
   *
   * @returns A shallow copy of the aggregate's properties.
   */
  public toObject(): PlainAggregate<T> {
    const plainProps = serializeProps(
      this._props as Record<PropertyKey, unknown>,
    );

    return {
      ...plainProps,
      id: this._id.value(),
    } as PlainAggregate<T>;
  }

  /**
   * Creates a deep clone of the aggregate.
   *
   * @returns A new instance of the aggregate with cloned properties.
   */
  public clone(): this {
    return new (this.constructor as new (props: T) => this)(this._props);
  }
}
