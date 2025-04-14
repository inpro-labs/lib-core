import { Entity } from '../domain/entity';
import { ID } from '../domain/id';
import { ValueObject } from '../domain/value-object';

export type Plainify<T> = T extends
  | string
  | number
  | boolean
  | bigint
  | symbol
  | null
  | undefined
  ? T
  : T extends Date
    ? Date
    : T extends ID
      ? string
      : T extends ValueObject<infer V>
        ? Plainify<V>
        : T extends Entity<infer V>
          ? Plainify<V> & { id: string }
          : T extends Array<infer U>
            ? Plainify<U>[]
            : T extends Record<any, any>
              ? { [K in keyof T]: Plainify<T[K]> }
              : T;

export type IdentifiablePlainify<T> = Plainify<Omit<T, 'id'>> & { id: string };
