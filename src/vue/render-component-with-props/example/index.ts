import Vue from '../instance/Vue';
import { VueCtor } from '../instance/Vue';

const Comp = (Vue as VueCtor).component('hello-text', {
  data() {
    return {
      text: 'I am hello-text component'
    }
  },
  props: {
    msg: {
      type: String
    }
  },
  methods: {
    onClick() {
      this.text = this.text + '... '
    }
  },
  render(h) {
    const { text, onClick, msg } = this
    return (
      h('div', {}, [
        h('p', { on: { click: onClick } }, text),
        h('p', { on: { click: onClick } }, `props msg: ${msg}`)
      ])
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
        h('hello-text', { props: { msg: 'msg from parent' } }),
        h('button', { on: { click: changeName } }, 'click')
      ])
    )
  }
}).$mount('#app')
// new Vue({
//   data() {
//     return {
//       text: 'text'
//     }
//   },
//   computed: {
//     computedText() {
//       return '??' + this.text + '??'
//     }
//   },
//   methods: {
//     changeText() {
//       this.text = this.text + '!!'
//     }
//   },
//   render(this: any, h: Function) {
//     const { text, computedText, changeText } = this

//     return h(
//       'div', {}, [
//         h('p', {}, [computedText]),
//         h('p', {}, [text]),
//         h('button', { on: { click: changeText } }, 'changeText'),
//       ]
//     )
//   }
// })
//   .$mount('#app')

