import MyVue from "./index";

const instance = new MyVue({
  data: {
    name: "LeBron James"
  }
});

// 必须要手动添加data，因为需要相对于整个实例(MyVue)中查找出需要侦听的对象，需要先定位到data，再定位到name
instance.$watch("data.name", (vm, val, oldVal) => {
  console.log(val, oldVal);
});

instance.data.name = "Russell Westbrook";
console.log(instance.data.name);
