import Vue from '../instance/Vue';
import { VueCtor } from '../instance/Vue';

const Comp = (Vue as VueCtor).component('hello-text', {
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


const vm = new Comp()
vm.$mount('#app')
console.log(vm);
