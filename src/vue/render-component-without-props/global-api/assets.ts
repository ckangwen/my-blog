import { ASSET_TYPES } from '../utils/constants';
import { isPlainObject, __DEV__, validateComponentName } from '../utils/utils';

export function initAssetRegisters(Vue) {
  ASSET_TYPES.forEach(type => {
    Vue[type] = function(id: string, definition?: any) {
      if (!definition) return this.options[type + 's'][id]
      if (__DEV__ && type === 'component') {
        validateComponentName(id)
      }
      if (type === 'component' && isPlainObject(definition)) {
        definition.name = definition.name || id
        definition = this.options._base.extend(definition)
      }
      if (type === 'directive' && typeof definition === 'function') {
        definition = { bind: definition, update: definition }
      }
      this.options[type + 's'][id] = definition
      return definition
    }
  })
}
