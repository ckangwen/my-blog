import observe from "./observe";
import Watcher from "./watcher";

export default class MyVue {
  constructor(options) {
    const { data, methods, el } = options;
    this.data = data;

    observe(this.data);
  }

  $watch(exp, cb) {
    return new Watcher(this, exp, cb);
  }
}
