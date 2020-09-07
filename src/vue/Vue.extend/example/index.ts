import Vue from '../instance/Vue';
import { VueCtor } from '../instance/Vue';

// new Vue({
//   data() {
//     return {
//       name: 'tom'
//     }
//   },
//   methods: {
//     changeName() {
//       this.name = this.name + '?'
//     }
//   },
//   render(h) {
//     const { name, changeName } = this
//     return  (
//       h('div', { attrs: { id: 'app2' } }, [
//         h('p', {}, 'hello, ' + name),
//         h('button', { on: { click: changeName } }, 'click')
//       ])
//     )
//   }
// }).$mount('#app')

const Extended = (Vue as VueCtor).extend({
  data() {
    return {
      text: 'hello'
    }
  },
  render(h) {
    const { text } = this
    return (
      h('span', text)
    )
  }
})
const vm = new Extended()
vm.$mount('#app')
