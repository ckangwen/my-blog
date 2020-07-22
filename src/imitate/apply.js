/**
 * @param{Function} fn 被调用的函数
 * @param thisArg 指定的作用域，默认是window
 * @param argsArray 指定的参数
 * @returns {*} 被调用的函数的返回值
 */
function fakeApply(fn, thisArg = window, argsArray = []) {
  if (typeof fn !== "function") {
    throw new TypeError("fn should be a function");
  }
  if (!Array.isArray(argsArray)) {
    throw new Error("argsArray should be a array");
  }
  if (!thisArg) {
    thisArg = window || {};
  }
  const _key = Symbol();
  // 将fn指定为thisArg的属性的值，用以改变this指向
  thisArg[_key] = fn;
  // 调用指定的函数
  const result = thisArg[_key](...argsArray);
  // 避免污染变量
  delete thisArg[_key];
  return result;
}
const numbers = [5, 6, 2, 3, 7];

const max = fakeApply(Math.max, null, numbers);
console.log(max); // 7
