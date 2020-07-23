import { isBrowser } from "./utils";

// TODO subs里有多个重复值
export default class Dep {
  constructor() {
    this.subs = new Set([]);
  }

  addSub(sub) {
    this.subs.add(sub);
  }
  removeSub(sub) {
    remove(this.subs, sub);
  }
  depend() {
    const target = Dep.target;
    if (target) {
      this.addSub(target);
    }
  }
  notify() {
    Array.from(this.subs).forEach(item => {
      item.update();
    });
  }
}

Dep.target = null;

function remove(arr, item) {
  // if (arr.length) {
  //   const index = arr.indexOf(item);
  //   if (index > -1) {
  //     return arr.splice(index, 1);
  //   }
  // }
  if (arr.has(item)) {
    arr.delete(item)
  }
}
