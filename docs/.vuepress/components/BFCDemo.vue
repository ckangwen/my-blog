<template>
  <div :style="{'overflow': 'hidden'}">
    <label for="toggler">
      修改父容器的overflow属性
      <input type="checkbox" id="toggler" @change="toggle"></input>
    </label>
    <br>
    <label for="float">
      修改父容器的float属性
      <input type="checkbox" id="float" @change="() => {this.flag = !this.flag}"></input>
    </label>

    <div class="box"  :style="{'overflow': flag ? 'hidden' : undefined }">
      <div class="float"  :style="{'float': withFloat ? 'left' : undefined }">This is a floated Box</div>
      <p>This is a content inside the container *****************************************</p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'BFCDemo',
  data() {
    return {
      flag: false,
      withFloat: true
    }
  },
  methods: {
    toggle() {
      this.flag = !this.flag
    }
  },
}
</script>
<style scoped>
  .box {
    background: #ccc;
    border: 3px solid green;
    margin-top: 10px;
  }
  .float {
    width: 200px;
    height: 150px;
    border: 1px solid green;
    background-color: #eee;
    padding: 10px;
    margin: 10px;
  }
</style>