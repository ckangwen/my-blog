import { initExtend } from './extend';
import { initAssetRegisters } from './assets';
import { ASSET_TYPES } from '../utils/constants';

export function initGlobalAPI(Vue) {
  Vue.options = Object.create(null)

  ASSET_TYPES.forEach(type => {
    Vue.options[type + 's'] = Object.create(null)
  })

  Vue.options._base = Vue

  initExtend(Vue)
  initAssetRegisters(Vue)
}
