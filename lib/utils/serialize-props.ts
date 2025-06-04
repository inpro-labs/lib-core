import { ID } from '../domain';
type WithToObject = { toObject: () => unknown };

/**
 * Recursively walk through `value` and:
 * - if it’s an ID → return the primitive value
 * - if it’s a Date → return the Date object
 * - if it’s a Set → return an array of the serialized values
 * - if it’s a Map → return a plain object with the serialized values
 * - if it has `toObject()` → call that and then re-serialize the result
 * - if it’s an array → map each element through this same function
 * - if it’s a plain object (but not null) → walk each key
 * - otherwise → return the value “as is” (string, number, boolean, Date, etc.)
 */
function deepSerialize(value: unknown): unknown {
  if (value instanceof ID) {
    return value.value();
  }

  if (value instanceof Date) {
    return value;
  }

  if (value instanceof Set) {
    return Array.from(value).map((item) => deepSerialize(item));
  }

  if (value instanceof Map) {
    const obj: Record<string, unknown> = {};

    for (const [rawKey, rawVal] of value.entries()) {
      const keyStr = String(rawKey);

      obj[keyStr] = deepSerialize(rawVal);
    }

    return obj;
  }

  if (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as WithToObject).toObject === 'function'
  ) {
    const plain = (value as WithToObject).toObject();
    return deepSerialize(plain);
  }

  if (Array.isArray(value)) {
    return value.map((item) => deepSerialize(item));
  }

  if (typeof value === 'object' && value !== null) {
    const result: Record<string, unknown> = {};
    for (const key in value as Record<string, unknown>) {
      const v = (value as Record<string, unknown>)[key];

      result[key] = deepSerialize(v);
    }
    return result;
  }

  return value;
}

/**
 * Given an object of “raw props,” return them serialized for JSON:
 * - IDs turn into strings
 * - any nested entity/VO is turned into its own plain object
 * - arrays are walked recursively
 */
export function serializeProps<R extends Record<PropertyKey, unknown>>(
  props: Record<PropertyKey, unknown>,
): R {
  // Instead of reduce(), we do one “for…in” and call deepSerialize on each value.
  const output: Record<PropertyKey, unknown> = {};

  for (const key in props) {
    output[key] = deepSerialize(props[key]);
  }
  return output as R;
}
