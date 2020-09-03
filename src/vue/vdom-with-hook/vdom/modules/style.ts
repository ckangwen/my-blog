import { VNode } from '../vnode';
import { isDef, toObject, cached, camelize, hyphenate } from '../../utils';

function updateStyle (oldVnode: VNode, vnode: VNode) {
  const data = vnode.data
  const oldData = oldVnode.data
  const oldStyle = oldData.normalizedStyle || {}

  if (!isDef(data.style) && !isDef(oldData.style)) return
  const el = vnode.elm as Element
  const newStyle = normalizeStyleBinding(vnode.data.style) || {}
  /* 记录之前的style */
  vnode.data.normalizedStyle = newStyle

  let name, cur
  for (name in oldStyle) {
    if (!isDef(newStyle[name])) {
      setProp(el, name, '')
    }
  }
  for (name in newStyle) {
    cur = newStyle[name]
    if (cur !== oldStyle[name]) {
      setProp(el, name, cur == null ? '' : cur)
    }
  }
}


export default {
  create: updateStyle,
  update: updateStyle
}

/*******  style helper *******/

const cssVarRE = /^--/
const importantRE = /\s*!important$/
const setProp = (el, name, val) => {
  /* istanbul ignore if */
  if (cssVarRE.test(name)) {
    el.style.setProperty(name, val)
  } else if (importantRE.test(val)) {
    el.style.setProperty(hyphenate(name), val.replace(importantRE, ''), 'important')
  } else {
    const normalizedName = normalize(name)
    if (Array.isArray(val)) {
      for (let i = 0, len = val.length; i < len; i++) {
        el.style[normalizedName] = val[i]
      }
    } else {
      el.style[normalizedName] = val
    }
  }
}

const vendorNames = ['Webkit', 'Moz', 'ms']

let emptyStyle
const normalize = cached(function (prop) {
  emptyStyle = emptyStyle || document.createElement('div').style
  prop = camelize(prop)
  if (prop !== 'filter' && (prop in emptyStyle)) {
    return prop
  }
  const capName = prop.charAt(0).toUpperCase() + prop.slice(1)
  for (let i = 0; i < vendorNames.length; i++) {
    const name = vendorNames[i] + capName
    if (name in emptyStyle) {
      return name
    }
  }
})

function normalizeStyleBinding (bindingStyle: any): Object {
  if (Array.isArray(bindingStyle)) {
    return toObject(bindingStyle)
  }
  if (typeof bindingStyle === 'string') {
    return parseStyleText(bindingStyle)
  }
  return bindingStyle
}
const parseStyleText = function (cssText) {
  const res = {}
  const listDelimiter = /;(?![^(]*\))/g
  const propertyDelimiter = /:(.+)/
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      const tmp = item.split(propertyDelimiter)
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim())
    }
  })
  return res
}