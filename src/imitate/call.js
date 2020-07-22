/**
 * @param{Function} fn 被调用的函数
 * @param thisArg 指定的作用域，默认是window
 * @param args 指定的参数
 * @returns {*} 被调用的函数的返回值
 */
function fakeCall(fn, thisArg = window, ...args) {
  if (typeof fn !== "function") {
    throw new TypeError("fn should be a function");
  }
  const _key = Symbol();
  // 将fn指定为thisArg的属性的值，用以改变this指向
  thisArg[_key] = fn;
  // 调用指定的函数
  const result = thisArg[_key](...args);
  // 避免污染变量
  delete thisArg[_key];
  return result;
}

function Product(name, price) {
  this.name = name;
  this.price = price;
}

function Food(name, price) {
  // Product.call(this, name, price);
  fakeCall(Product, this, name, price)
  this.category = 'food';
}
// Food { name: 'cheese', price: 5, category: 'food' }
console.log(new Food('cheese', 5));
