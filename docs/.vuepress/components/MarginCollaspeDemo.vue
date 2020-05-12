<template>
  <div class="container">
    <div v-if="demo === '1'" class="demo1">
      <p class="outline">第一行</p>
      <p class="outline">第二行</p>
    </div>

    <div v-if="demo === '2'" class="demo2">
      <div class="controls">
        <div>
          <input type="radio" id="none" name="control" @change="() => { this.setOthers() }">
          <label for="none">清除设置</label>
        </div>
        <div>
          <input type="radio" id="bfc" name="control" @change="() => { this.setOthers('bfc') }">
          <label for="bfc">父元素设置为BFC元素</label>
        </div>
        <div>
          <input type="radio" id="padding" name="control" @change="() => { this.setOthers('padding') }">
          <label for="padding">父元素设置paddingTop为10px</label>
        </div>
        <div>
          <input type="radio" id="border" name="control" @change="() => { this.setOthers('border') }">
          <label for="border">父元素设置borderTop为10px</label>
        </div>
        <div>
          <input type="radio" id="element" name="control" @change="() => { this.setOthers('element') }">
          <label for="element">父元素与第一个子元素之间插入一个行内元素</label>
        </div>
      </div>
      <div class="header-container" :style="style">
        <span v-if="element">I am a inline-block element</span>
        <h2>Margin Collpase</h2>
      </div>
    </div>

    <div v-if="demo === '3'" class="demo3">
      <div class="father">
        <p class="outline">第一行，高度为27px</p>
        <div class="son"></div>
        <p class="outline">第二行，高度为27px</p>
      </div>
    </div>
  </div>
</template>
<script>

const properties = ['bfc', 'padding', 'border', 'element']
export default {
  name: 'MarginCollapseDemo',
  data() {
    return {
      bfc: false,
      padding: false,
      border: false,
      element: false,
    }
  },
  computed: {
    style() {
      return {
        overflow: this.bfc ? 'hidden': undefined,
        padding: this.padding ? '10px': undefined,
        border: this.border ? '10px solid red': undefined,
      }
    }
  },
  methods: {
    setOthers(prop) {
      if (prop) {
        this[prop] = !this[prop]
      }
      properties.filter(t => {
        if (t !== prop) {
          this[t] = false
        }
      })
    }
  },
  props: {
    demo: String
  }
}
</script>
<style scoped>
  .container {
    overflow: hidden;
    margin-top: 25px;
    background-color: #f6f5ec;
  }
  .controls {
    background-color: #fff;
    border-radius: 10px;
    border: 1px solid;
  }
  .demo1 p:nth-child(1) {
    margin-bottom: 50px;
  }
  .demo1 p:nth-child(3) {
    margin-top: 30px;
  }
  .demo2 .header-container {
    background: url('https://cdn.pixabay.com/photo/2020/04/18/17/17/fantasy-5060076_960_720.jpg');
    width: 100%;
    min-height: 200px;
    color: #fff;
  }
  .demo2 .header-container > h2 {
    margin-top: 100px;
  }

  .demo3 .father {
    overflow: hidden;
  }
  .father p {
    margin: 0;
  }
  .demo3 .son {
    margin-top: 40px;
    margin-bottom: 10px;
  }
  .outline {
    outline: 1px solid;
  }
</style>
