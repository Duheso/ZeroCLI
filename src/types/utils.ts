/**
 * Deeply marks all properties of T as readonly.
 * Used to type immutable state slices passed through the app.
 */
export type DeepImmutable<T> = {
  readonly [P in keyof T]: T[P] extends object
    ? DeepImmutable<T[P]>
    : T[P]
}
