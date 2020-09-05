import { Observable, Raw } from './types';
const connectionStore = new WeakMap<Raw, Observable>()

export function storeObservable(value: Raw) {
  connectionStore.set(value, new Map() as Observable)
}
