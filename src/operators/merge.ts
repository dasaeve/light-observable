import { Observable } from '../core/Observable'
import { Subscribable } from '../core/types.h'
import { Unary } from '../helpers/pipe'
import { merge as mergeObservable } from '../observable/merge'

export function merge<T>(): Unary<Subscribable<T>, Subscribable<T>>
export function merge<T, A>(arg1: Subscribable<A>): Unary<Subscribable<T>, Subscribable<T | A>>
export function merge<T, A, B>(
  arg1: Subscribable<A>,
  arg2: Subscribable<B>
): Unary<Subscribable<T>, Subscribable<T | A | B>>
export function merge<T, A, B, C>(
  arg1: Subscribable<A>,
  arg2: Subscribable<B>,
  arg3: Subscribable<C>
): Unary<Subscribable<T>, Subscribable<T | A | B | C>>
export function merge<T, A, B, C, D>(
  arg1: Subscribable<A>,
  arg2: Subscribable<B>,
  arg3: Subscribable<C>,
  arg4: Subscribable<D>
): Unary<Subscribable<T>, Subscribable<T | A | B | C | D>>
export function merge<T, A, B, C, D, E>(
  arg1: Subscribable<A>,
  arg2: Subscribable<B>,
  arg3: Subscribable<C>,
  arg4: Subscribable<D>,
  arg5: Subscribable<E>
): Unary<Subscribable<T>, Subscribable<T | A | B | C | D | E>>
export function merge(
  ...streams: Array<Subscribable<any>>
): Unary<Subscribable<any>, Observable<any>> {
  return (stream: Subscribable<any>) => {
    const allStreams = [stream].concat(streams)

    return mergeObservable.apply(null, allStreams)
  }
}
