export const formatComponentName = vm => {
  if (vm.$root === vm) {
    return 'root instance'
  }
  const name = vm._isVue
    ? vm.$options.name || vm.$options._componentTag
    : vm.name
  return name ? `component ${name}` : `anonymous component`
}
