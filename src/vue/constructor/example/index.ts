import { Watcher } from '../observe/watcher';
import { observe } from '../observe/observer';
import Vue from '../instance/Vue';

// class Demo {
//   foo: any;
//   bar: any;
//   constructor() {
//     const bar = {
//       name: 'fafa',
//       age: 20
//     }
//     this.bar = bar
//     observe(this.bar)
//     this.foo = new Watcher(this, 'bar.name', (val, oldVal) => {
//       console.log('current value', val, 'old value', oldVal);
//     })
//   }
// }

// const demo = new Demo()
// console.log(`修改前: ${demo.bar.name}`);
// demo.bar.name = 'sfdf'
// console.log(`修改后: ${demo.bar.name}`);
new Vue({
  data() {
    return {
      name: 'tom'
    }
  },
  render(h) {
    const { name } = this
    return  (
      h('div', { attrs: { id: 'app2' } }, [
        h('p', {}, 'hello, ' + name),
        h('button', {}, 'click')
      ])
    )
  }
}).$mount('#app')