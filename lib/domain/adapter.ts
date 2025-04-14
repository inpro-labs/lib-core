/**
 * Interface for transforming data from one shape to another.
 *
 * Useful for converting between layers (e.g., persistence, domain, DTOs, view models).
 *
 * @template From - The input type to adapt from.
 * @template To - The output type to adapt to.
 */
export interface Adapter<From, To> {
  /**
   * Transforms a single item from type `From` to type `To`.
   *
   * @param from - The source item to be adapted.
   * @returns The adapted item of type `To`.
   */
  adaptOne?(from: From): To;
  /**
   * Transforms a list of items from type `From[]` to type `To[]`.
   *
   * @param from - An array of source items to be adapted.
   * @returns An array of adapted items of type `To[]`.
   */
  adaptMany?(from: From[]): To[];
}
