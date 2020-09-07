import { VueCtor } from '../instance/Vue';
import { ExtendsApiOptions } from '../types/vue';
import { mergeOptions } from '../instance/helper/options';
import { hasOwn, ASSET_TYPES } from '../utils';
export function initExtend(Vue: VueCtor) {
  Vue.cid = 0
  let cid = 1
  Vue.extend = function(extendOptions: ExtendsApiOptions = {}) {
    const Super = this
    const name = extendOptions.name || (Super as VueCtor).options.name
    let Sub = extendClass(Super, Super.prototype, (key) => {
      return ['extend', 'mixin', 'use', ...ASSET_TYPES].indexOf(key) > -1
    })
    Sub.super = Super

    Sub.cid = ++cid
    Sub.options = mergeOptions(Super.options || {}, extendOptions)
    Sub.superOptions = Super.options
    Sub.extendOptions = extendOptions
    return Sub
  }
}

/* helper */

const defaultValidatePropKeyFn = val => true

function extendClass(
  Super: Function,
  proto: any,
  some: ((key: string) => boolean) = defaultValidatePropKeyFn,
  before?: Function
): any {
  function VueComponent () {
    typeof before === 'function' && before.bind(this)()

    if (proto && proto.constructor) {
	    return proto.constructor.apply(this, arguments);
    } else {
      return Super.apply(this, arguments);
    }
  }

  VueComponent.prototype = Object.create(Super.prototype)
  VueComponent.prototype.constructor = VueComponent
  if (proto) {
    for (const key in proto) {
      if (hasOwn(proto, key)) {
        if (some(key)) {
          VueComponent.prototype[key] = proto[key]
        }
      }
    }
  }

  return VueComponent
}
