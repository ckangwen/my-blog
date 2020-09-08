import { VNodeData } from '../../types/vnode';
import { isDef } from '../../utils/is';
import { __DEV__, hasOwn, hyphenate } from '../../utils/utils';
import { formatComponentName } from '../../utils';

export function extractPropsFromVNodeData(data: VNodeData, Ctor: any, tag?: string) {
  const propOptions = Ctor.options.props
  if (!propOptions) return

  const res = {}
  const { attrs, props } = data
  if (isDef(attrs) || isDef(props)) {
    for (const key in propOptions) {
      /* 校验属性名 */
      const altKey = hyphenate(key)
      if (__DEV__) {
        const keyInLowerCase = key.toLowerCase()
        if (key !== keyInLowerCase && attrs && hasOwn(attrs, keyInLowerCase)) {
          console.warn(
            `Prop "${keyInLowerCase}" is passed to component ` +
            `${formatComponentName(tag || Ctor)}, but the declared prop name is` +
            ` "${key}". ` +
            `Note that HTML attributes are case-insensitive and camelCased ` +
            `props need to use their kebab-case equivalents when using in-DOM ` +
            `templates. You should probably use "${altKey}" instead of "${key}".`
          )
        }
      }

      checkProp(res, props, key, altKey, true) ||
      checkProp(res, attrs, key, altKey, false)
    }
  }

}


function checkProp (
  res: Object,
  hash: Object,
  key: string,
  altKey: string,
  preserve: boolean
): boolean {
  if (isDef(hash)) {
    if (hasOwn(hash, key)) {
      res[key] = hash[key]
      if (!preserve) {
        delete hash[key]
      }
      return true
    } else if (hasOwn(hash, altKey)) {
      res[key] = hash[altKey]
      if (!preserve) {
        delete hash[altKey]
      }
      return true
    }
  }
  return false
}
