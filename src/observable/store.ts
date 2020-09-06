import { Observable, Raw, Operation, ReactionsForRaw, ReactionFunction, ReactionsForKey, Key } from './types';
const connectionStore = new WeakMap<Raw, ReactionsForRaw>()
const ITERATION_KEY = Symbol('iteration key')

export function storeObservable(value: Raw) {
  connectionStore.set(value, new Map())
}

export function registerReactionForOperation(reaction: ReactionFunction, { target, key, type }: Operation) {
  /* reactionMapForRaw: key与对应的监听函数列表组成的Map */
  const reactionMapForRaw = connectionStore.get(target)
  /* 存放着监听函数列表 */
  let reactionSetForKey = reactionMapForRaw.get(key)
  if (!reactionSetForKey) {
    reactionSetForKey = new Set()
    reactionMapForRaw.set(key, reactionSetForKey)
  }

  if (!reactionSetForKey.has(reaction)) {
    reactionSetForKey.add(reaction)
    // reaction.cleaners.push(reactionSetForKey)
  }
}


/**
 *  根据key,type和原始对象 拿到需要触发的所有观察函数
 */
export function getReactionsForOperation ({ target, key, type }: Operation) {
  const reactionMapForTarget = connectionStore.get(target)
  const reactionSetForKey = new Set<ReactionFunction>()

  if (type === 'clear') {
    reactionMapForTarget.forEach((_, key) => {
      addReactionsForKey(reactionSetForKey, reactionMapForTarget, key)
    })
  } else {
    addReactionsForKey(reactionSetForKey, reactionMapForTarget, key)
  }

  
  if (type === 'add' || type === 'delete' || type === 'clear') {
    const iterationKey = Array.isArray(target) ? 'length' : ITERATION_KEY
    addReactionsForKey(reactionSetForKey, reactionMapForTarget, iterationKey)
  }

  return reactionSetForKey
}

function addReactionsForKey (reactionSetForKey: ReactionsForKey, reactionMapForTarget: ReactionsForRaw, key: Key) {
  const reactions = reactionMapForTarget.get(key)
  reactions && reactions.forEach(reactionSetForKey.add, reactionSetForKey)
}