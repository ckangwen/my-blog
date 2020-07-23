import observe from "./observe";
import Watcher from "./watcher";
import Compile from "./compile";

export default class MyVue {
  constructor(options) {
    const { data, methods, el } = options;
    this.data = data;
    this.el = el;

    observe(this.data);
    new Compile(this.el, this);
  }

  $watch(exp, cb) {
    return new Watcher(this, exp, cb);
  }
}
