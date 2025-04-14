import { ID } from '../domain';

type WithToObject = { toObject: () => unknown };

export function serializeProps<R extends Record<PropertyKey, unknown>>(
  props: Record<PropertyKey, unknown>,
): R {
  return Object.entries(props).reduce(
    (acc, [key, value]) => {
      if (value instanceof ID) {
        acc[key] = value.value();
      } else if (typeof (value as WithToObject)?.toObject === 'function') {
        acc[key] = (value as WithToObject).toObject();
      } else {
        acc[key] = value;
      }
      return acc;
    },
    {} as Record<PropertyKey, unknown>,
  ) as R;
}
