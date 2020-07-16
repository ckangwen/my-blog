function* helloWorldGenerator() {
  yield 'hello';
  yield 'world';
  return 'ending';
}

const hw = helloWorldGenerator();
// Object [Generator] {}
console.log(hw);

let val
while ((val = hw.next()).value !== undefined) {
// { value: 'hello', done: false }
// { value: 'world', done: false }
// { value: 'ending', done: true }
  console.log(val)
}
