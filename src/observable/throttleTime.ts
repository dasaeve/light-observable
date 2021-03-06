import { Observable } from '../core/Observable'
import { Subscribable } from '../core/types.h'
import { throttle } from '../helpers/throttle'
import { transform } from '../helpers/transform'

export const throttleTime = <T>(time: number, stream: Subscribable<T>): Observable<T> => {
  return transform(
    stream,
    throttle(time, (observer, value) => {
      observer.next(value)
    })
  )
}
