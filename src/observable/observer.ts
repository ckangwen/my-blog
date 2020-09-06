import { runAsReaction } from './reactionRunner';
const IS_REACTION = Symbol('is reaction')

export function observe(fn, options = {}) {
  const reaction = fn[IS_REACTION]
    ? fn
    : function reaction() {
      return runAsReaction(reaction, fn, this, arguments)
    }

  // save the fact that this is a reaction
  reaction[IS_REACTION] = true
  return reaction
}