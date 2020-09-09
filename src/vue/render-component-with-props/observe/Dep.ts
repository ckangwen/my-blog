import { Watcher } from './watcher';
import { remove } from '../utils/utils';
let uid = 0

export class Dep {
  static target?: Watcher
  id?: number
  subs?: Watcher[]

  constructor() {
    this.id = ++uid
    this.subs = []
  }

  addSub(sub: Watcher) {
    this.subs.push(sub)
  }
  removeSub(sub: Watcher) {
    remove(this.subs, sub)
  }
  /** 将自身(Dep)添加到Watcher */
  subscribe() {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }
  /**
   * 依赖的对象发生了变化，通知依赖进行更新
   * 遍历Watcher实例数组，调用update方法
   * */
  notify() {
    const subs = this.subs.slice()
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}

Dep.target = null

const targetStack = []

export function pushTarget(target?: Watcher) {
  targetStack.push(target)
  Dep.target = target
}
export function popTarget() {
  targetStack.pop()
  Dep.target = null
}