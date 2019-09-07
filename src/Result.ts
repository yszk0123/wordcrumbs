export interface Ok<T> {
  ok: true;
  val: T;
}

export interface Err<E> {
  ok: false;
  val: E;
}

export type Result<T, E> = Ok<T> | Err<E>;

export function createOk<T>(val: T): Ok<T> {
  return { ok: true, val };
}

export function createErr<E>(val: E): Err<E> {
  return { ok: false, val };
}

export function isOk<T, E>(result: Result<T, E>): result is Ok<T> {
  return result.ok;
}

export function isErr<T, E>(result: Result<T, E>): result is Err<E> {
  return !result.ok;
}
