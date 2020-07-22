function fakeNew(Constructor, ...args) {
  let obj = new Object();
  obj.__proto__ = Constructor.prototype;
  const result = Constructor.call(obj, ...args);
  return typeof result === "object" && result !== null ? result : obj;
}

function Animal(name) {
  this.name = name
}

const animal = fakeNew(Animal, 'panda');
console.log(animal);
