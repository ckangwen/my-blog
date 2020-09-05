import { Raw, Observable } from './types';
export const rawToProxy = new WeakMap<Raw, Observable>()
export const proxyToRaw = new WeakMap<Observable, Raw>()
