/** 原始值 */
export type Raw = object

/** 响应式转换后的值 */
export type Observable = object

/** 对象key值的所有形式 */
export type Key = string | number | symbol

type OperationType =
  | "get"
  | "iterate"
  | "add"
  | "set"
  | "delete"
  | "clear"
  | "has"

export type Operation = {
  target?: Raw
  key?: Key
  receiver?: Observable
  type?: OperationType
}
// reactionForRaw的key为对象key值 value为这个key值收集到的Reaction集合
export type ReactionsForRaw = Map<Key, ReactionsForKey>

// key值收集到的Reaction集合
export type ReactionsForKey = Set<ReactionFunction>

// 收集响应依赖的的函数
export type ReactionFunction = Function & {
  cleaners?: ReactionsForKey[]
  unobserved?: boolean
}