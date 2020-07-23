import { isNode, isTextNode, isDirective } from "./utils";
const reg = /{{(.*)}}/;
export default class Compile {
  constructor(el, vm) {
    this.el = document.querySelector(el);
    this.vm = vm;
    this.fragment = null;
    this.init();
  }

  init() {
    if (!this.el) throw new Error("element not exist");
    this.fragment = nodeToFragment(this.el);
    this.compileElement(this.fragment);
    this.el.appendChild(this.fragment);
  }

  compileElement(el) {
    const childNodes = el.childNodes;
    Array.prototype.slice.call(childNodes).forEach(node => {
      const text = node.textContent;
      if (isNode(node)) {
        const attrs = node.attributes;
        Array.prototype.forEach.call(attrs, attr => {
          const attrName = attr.name;
          if (isDirective(attrName)) {
            const exp = attr.value;
            if (attrName === "v-model") {
              const propValue = this.vm.data[exp];
              node.value = propValue;
              this.vm.$watch(`data.${exp}`, (_, val) => {
                node.value = val;
              });

              node.addEventListener("input", e => {
                const newValue = e.target.value;
                if (newValue === propValue) return;

                this.vm.data[exp] = newValue;
              });
            }
          }
        });
      } else if (isTextNode(node) && reg.test(text)) {
        const exp = (reg.exec(text)[1]).trim();
        node.textContent = this.vm.data[exp];
        this.vm.$watch(`data.${exp}`, (_, val) => {
          node.textContent = val;
        });
      }
      if (node.childNodes && node.childNodes.length) {
        this.compileElement(node);
      }
    });
  }
}

function nodeToFragment(el) {
  const fragment = document.createDocumentFragment();
  let firstChild;
  while ((firstChild = el.firstChild)) {
    fragment.appendChild(firstChild);
  }
  return fragment;
}
