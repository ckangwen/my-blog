import { isBrowser } from "./utils";

export default class Dep {
  constructor() {
    this.subs = [];
  }

  addSub(sub) {
    this.subs.push(sub);
  }
  removeSub(sub) {
    remove(this.subs, sub);
  }
  depend() {
    const target = isBrowser ? window.target : Dep.target;
    if (target) {
      this.addSub(target);
    }
  }
  notify() {
    const subs = this.subs.slice();
    subs.forEach(item => {
      item.update();
    });
  }
}

Dep.target = null;

function remove(arr, item) {
  if (arr.length) {
    const index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1);
    }
  }
}
