export type Dictionary<T> = { [key: string]: T }

export type ErrorHandler = (err: Error) => void

export type RouterMode = 'hash' | 'history' | 'abstract'
