/**
 * Creates a frozen constant object with additional helpers for accessing its keys and values.
 *
 * Useful for defining enum-like constants that are immutable and provide utility lists.
 *
 * @template T - The shape of the constant object.
 * @param value - The constant object to freeze.
 * @returns The frozen object, augmented with `values` and `keys` arrays.
 *
 * @example
 * const Status = createConstant({
 *   ACTIVE: "active",
 *   INACTIVE: "inactive",
 * });
 *
 * // Access individual values:
 * Status.ACTIVE; // "active"
 *
 * // Get all values:
 * Status.values; // ["active", "inactive"]
 *
 * // Get all keys:
 * Status.keys; // ["ACTIVE", "INACTIVE"]
 */
export const createConstant = <T extends Record<string, unknown>>(
  value: T,
): T & {
  values: (typeof value)[keyof typeof value][];
  keys: (keyof typeof value)[];
} => {
  const freezedValue = Object.freeze(value);

  const values = Object.values(freezedValue);
  const keys = Object.keys(freezedValue);

  return Object.freeze({
    ...freezedValue,
    values,
    keys,
  });
};
