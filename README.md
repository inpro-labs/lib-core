# @inpro-labs/core

Utility types and base classes shared across the project.

## Documentation

### Core

#### `Result<T, E extends Error>`
A wrapper that represents either a success or an error.

Methods include:
- `unwrap()` – returns the success value or throws the error.
- `unwrapErr()` – returns the error value or throws if the result is a success.
- `expect(message)` – like `unwrap` but allows a custom error message or object.
- `isOk()` – returns `true` when the result is successful.
- `isErr()` – returns `true` when the result is an error.
- `getErr()` – returns the error or `null` if successful.
- `Result.fromPromise(promise)` – converts a `Promise` into a `Result`.
- `Result.ok(value)` – creates a successful result.
- `Result.err(error)` – creates an error result.
- `Result.catch(fn, error?)` – runs a function and wraps its outcome in a `Result`.
- Helper functions `Ok(value)`, `Err(error)` and `Combine(results)` are provided.

### Domain

#### `ID`
Represents a unique identifier.

- `ID.create(id?)` – returns a `Result` containing a new `ID` instance.
- `equals(other)` – compares two IDs.
- `value()` – returns the underlying string value.
- `isNew()` – indicates whether the ID was generated and not yet persisted.

#### `Entity<T>`
Base class for domain entities.

- `constructor(props)` – creates an entity with an ID and properties.
- `id` – getter for the entity ID.
- `isNew()` – checks if the entity is new.
- `equals(entity)` – compares entities by ID.
- `toObject()` – converts the entity to a plain object.
- `clone()` – deep clones the entity.

#### `Aggregate<T>`
Derived from NestJS `AggregateRoot` and represents a domain aggregate.

- `constructor(props)`
- `id` – getter for the aggregate ID.
- `props` – getter for the aggregate properties.
- `protected set(key, value)` – update a property internally.
- `get(key)` – access a property.
- `isNew()` – checks if the aggregate is new.
- `equals(aggregate)` – compares aggregates by ID.
- `toObject()` – converts the aggregate to a plain object.
- `clone()` – deep clones the aggregate.

#### `ValueObject<T>`
Immutable object defined solely by its values.

- `constructor(props)`
- `props` – getter for the value object's properties.
- `equals(vo)` – deep equality check.
- `toObject()` – returns a plain object representation.
- `clone()` – deep clones the value object.

#### `SettersAndGetters<T>`
Utility base that stores properties and provides helpers.

- `constructor(props)`
- `props` – getter for stored properties.
- `protected set(key, value)` – set a property internally.
- `get(key)` – retrieve a property value.

