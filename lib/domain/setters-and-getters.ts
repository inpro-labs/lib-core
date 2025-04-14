export class SettersAndGetters<T extends object = object> {
  /** Internal properties of the entity, including its ID. */
  protected _props: T;

  /**
   * Creates a new instance of the entity.
   *
   * @param props - The entity's properties, including an `id`.
   * @throws If the provided ID is invalid.
   */
  constructor(props: T) {
    this._props = props;
  }

  /**
   * Returns the entity's properties.
   *
   * @returns The entity's properties.
   */
  get props(): T {
    return this._props;
  }

  /**
   * Sets a property on the entity.
   *
   * @param key - The key of the property to set.
   * @param value - The value to set the property to.
   */
  protected set<K extends keyof T>(key: K, value: T[K]): void {
    this._props[key] = value;
  }

  /**
   * Gets a property from the entity.
   *
   * @param key - The key of the property to get.
   * @returns The value of the property.
   */
  public get<K extends keyof T>(key: K): T[K] {
    return this._props[key];
  }
}
