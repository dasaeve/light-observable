import $$observable from 'symbol-observable'
import { pipe, Unary } from '../helpers/pipe'
import { ObservableSubscription } from './ObservableSubscription'
import { FromInput, PartialObserver, Subscribable, Subscriber } from './types.h'

const fromArray = <T>(arrayLike: ArrayLike<T>): Subscriber<T> => {
  return (observer) => {
    for (const item of arrayLike as T[]) {
      if (observer.closed) {
        return
      }
      observer.next(item)
    }

    observer.complete()
  }
}

export class Observable<T> implements Subscribable<T> {
  static of(): Observable<any>
  static of<A>(a: A): Observable<A>
  static of<A, B>(a: A, b: B): Observable<A | B>
  static of<A, B, C>(a: A, b: B, c: C): Observable<A | B | C>
  static of<A, B, C, D>(a: A, b: B, c: C, d: D): Observable<A | B | C | D>
  static of<A, B, C, D, E>(a: A, b: B, c: C, d: D, e: E): Observable<A | B | C | D | E>
  static of(...items: any[]) {
    const C = typeof this === 'function' ? this : Observable

    return new C(fromArray(items))
  }

  static from<A>(ish: FromInput<A>) {
    const C = typeof this === 'function' ? this : Observable
    const error = `${ish} is not an object`

    if (ish == null) {
      throw new TypeError(error)
    }

    if ((ish as any)[$$observable]) {
      const observable = (ish as any)[$$observable]()

      if (Object(observable) !== observable) {
        throw new TypeError(error)
      }

      if (isObservable(observable) && observable.constructor === C) {
        return observable as Observable<A>
      }

      return new C<A>((observer) => observable.subscribe(observer))
    }

    if (Symbol.iterator && (ish as any)[Symbol.iterator]) {
      return new C(fromArray((ish as any)[Symbol.iterator]()))
    }

    // For old browsers that doesn't support @@iterator
    /* istanbul ignore next */
    if (Array.isArray(ish)) {
      return new C<A>(fromArray(ish))
    }

    throw new TypeError(ish + ' is not observable')
  }

  private _source: Subscriber<T>

  constructor(source: Subscriber<T>) {
    // This check should stay in case if the ES6->ES5 transpiling is enabled.
    /* istanbul ignore next */
    if (!isObservable(this)) {
      throw new TypeError('Observable cannot be called as a function')
    }

    if (typeof source !== 'function') {
      throw new TypeError('Observable initializer must be a function')
    }

    this._source = source
  }

  subscribe(
    next?: PartialObserver<T> | ((value: T) => void),
    error?: (reason: any) => void,
    complete?: () => void
  ) {
    let observer: any
    if (typeof next !== 'object' || next === null) {
      observer = {
        next,
        error,
        complete
      }
    } else {
      observer = next
    }

    return new ObservableSubscription(observer, this._source)
  }

  pipe(): Observable<T>
  pipe<A>(op1: Unary<Observable<T>, A>): A
  pipe<A, B>(op1: Unary<Observable<T>, A>, op2: Unary<A, B>): B
  pipe<A, B, C>(op1: Unary<Observable<T>, A>, op2: Unary<A, B>, op3: Unary<B, C>): C
  pipe<A, B, C, D>(
    op1: Unary<Observable<T>, A>,
    op2: Unary<A, B>,
    op3: Unary<B, C>,
    op4: Unary<C, D>
  ): D
  pipe<A, B, C, D, E>(
    op1: Unary<Observable<T>, A>,
    op2: Unary<A, B>,
    op3: Unary<B, C>,
    op4: Unary<C, D>,
    op5: Unary<D, E>
  ): E
  pipe<A, B, C, D, E, F>(
    op1: Unary<Observable<T>, A>,
    op2: Unary<A, B>,
    op3: Unary<B, C>,
    op4: Unary<C, D>,
    op5: Unary<D, E>,
    op6: Unary<E, F>
  ): F
  pipe<A, B, C, D, E, F, G>(
    op1: Unary<Observable<T>, A>,
    op2: Unary<A, B>,
    op3: Unary<B, C>,
    op4: Unary<C, D>,
    op5: Unary<D, E>,
    op6: Unary<E, F>,
    op7: Unary<F, G>
  ): G
  pipe<A, B, C, D, E, F, G, H>(
    op1: Unary<Observable<T>, A>,
    op2: Unary<A, B>,
    op3: Unary<B, C>,
    op4: Unary<C, D>,
    op5: Unary<D, E>,
    op6: Unary<E, F>,
    op7: Unary<F, G>,
    op8: Unary<G, H>
  ): H
  pipe<A, B, C, D, E, F, G, H, I>(
    op1: Unary<Observable<T>, A>,
    op2: Unary<A, B>,
    op3: Unary<B, C>,
    op4: Unary<C, D>,
    op5: Unary<D, E>,
    op6: Unary<E, F>,
    op7: Unary<F, G>,
    op8: Unary<G, H>,
    op9: Unary<H, I>
  ): I
  pipe(...operators: Array<Unary<any, any>>): any {
    return pipe.apply(null, operators)(this)
  }

  [$$observable]() {
    return this
  }
}

function isObservable(x: any): x is Observable<any> {
  return x instanceof Observable
}
