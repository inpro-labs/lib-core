import { ID } from '../domain/id'; // ajuste conforme sua pasta/id

export type DeepPlain<T> = T extends ID
  ? string
  : T extends { toObject(): infer R }
    ? R
    : T extends Date
      ? Date
      : T extends Array<infer U>
        ? DeepPlain<U>[]
        : T extends object
          ? { [K in keyof T]: DeepPlain<T[K]> }
          : T;

/**
 * PlainAggregate is a type that represents the plain object representation of an aggregate.
 * It is used to convert an aggregate to a plain object.
 * @template T - The type of the aggregate's properties.
 */
export type PlainAggregate<T extends { id?: string | ID }> = T extends ID
  ? string
  : T extends { toObject(): infer R }
    ? R
    : T extends Date
      ? Date
      : T extends Array<infer U>
        ? DeepPlain<U>[]
        : T extends object
          ? { [K in keyof T]: DeepPlain<T[K]> }
          : T;
