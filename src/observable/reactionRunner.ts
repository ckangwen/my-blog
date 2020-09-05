/**
 * 注册当前正在运行的反应，以便在obj.key突变时再次排队
 */

const reactionStack = []
const ITERATION_KEY = Symbol('iteration key')
const connectionStore = new WeakMap()

export function registerRunningReactionForOperation(operation) {
  // get the current reaction from the top of the stack
  const runningReaction = reactionStack[reactionStack.length - 1]
  if (runningReaction) {
    registerReactionForOperation(runningReaction, operation)
  }
}

export function registerReactionForOperation(reaction, { target, key, type }) {
  if (type === 'iterate') {
    key = ITERATION_KEY
  }

  const reactionsForObj = connectionStore.get(target)
  let reactionsForKey = reactionsForObj.get(key)
}