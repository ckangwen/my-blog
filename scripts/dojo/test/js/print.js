dojo.provide('print')
dojo.require('word')
Node.print = function() {
  document.write('this is a ' + Node.type + ' Node')
}