import { Operation, Raw, ReactionsForRaw, ReactionFunction } from './types';
import { registerReactionForOperation } from './store';
/**
 * 注册当前正在运行的反应，以便在obj.key突变时再次排队
 */

const reactionStack: ReactionFunction[] = []

const ITERATION_KEY = Symbol('iteration key')


export function registerRunningReactionForOperation(operation: Operation) {
  // get the current reaction from the top of the stack
  const runningReaction = reactionStack[reactionStack.length - 1]
  if (runningReaction) {
    registerReactionForOperation(runningReaction, operation)
  }
}

export function hasRunningReaction() {
  return reactionStack.length > 0
}

export function runAsReaction(reaction, fn, context, args) {
  // do not build reactive relations, if the reaction is unobserved
  if (reaction.unobserved) {
    return Reflect.apply(fn, context, args)
  }

  if (reactionStack.indexOf(reaction) === -1) {
    
  }
}