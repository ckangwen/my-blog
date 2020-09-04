import { Watcher } from '../observe/watcher';
import { observe } from '../observe/observer';

class Demo {
  foo: any;
  bar: any;
  constructor() {
    const bar = {
      name: 'fafa',
      age: 20
    }
    this.bar = bar
    observe(this.bar)
    this.foo = new Watcher(this, 'bar.name', (val, oldVal) => {
      console.log('current value', val, 'old value', oldVal);
    })
  }
}

const demo = new Demo()
console.log(`修改前: ${demo.bar.name}`);
demo.bar.name = 'sfdf'
console.log(`修改后: ${demo.bar.name}`);
