import Vue from '../instance/Vue';
import { VueCtor } from '../instance/Vue';

const Comp = (Vue as VueCtor).component('hello-text', {
  data() {
    return {
      text: 'I am hello-text component'
    }
  },
  methods: {
    onClick() {
      this.text = this.text + '... '
    }
  },
  render(h) {
    const { text, onClick } = this
    return (
      h('span', { on: { click: onClick } }, text)
    )
  }
})

const vm = new Vue({
  data() {
    return {
      name: '勒布朗'
    }
  },
  methods: {
    changeName() {
      this.name = this.name + "?"
    }
  },
  render(h) {
    const { name, changeName } = this
    return (
      h('div', { attrs: { id: 'app2' } }, [
        h('p', {}, 'hello, ' + name),
        h('hello-text'),
        h('button', { on: { click: changeName } }, 'click')
      ])
    )
  }
}).$mount('#app')

