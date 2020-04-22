<template>
  <div>
    <div class="container one">
      <span class="float">float left Item</span>
      <div>
        <h3>No BFC</h3>
        <p>***********************************</p>
      </div>
    </div>
    <div class="container one">
      <span class="float">float left Item</span>
      <div>
        <h3>No BFC</h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis ex a laudantium harum eum sed, molestias eos suscipit iste magni, aut perferendis commodi! Nostrum, quae cupiditate assumenda nihil eum in. Nostrum, quae cupiditate assumenda nihil eum in. Nostrum, quae cupiditate assumenda nihil eum in</p>
      </div>
    </div>

    <div class="container two">
      <span class="float">float left Item</span>
      <div>
        <h3>overflow: hidden</h3>
        <p>***********************************</p>
      </div>
    </div>
    <div class="container two">
      <span class="float">float left Item</span>
      <div>
        <h3>overflow: hidden</h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis ex a laudantium harum eum sed, molestias eos suscipit iste magni, aut perferendis commodi! Nostrum, quae cupiditate assumenda nihil eum in. Nostrum, quae cupiditate assumenda nihil eum in. Nostrum, quae cupiditate assumenda nihil eum in</p>
      </div>
    </div>

    <div class="container three">
      <span class="float">float left Item</span>
      <div>
        <h3>display: inline-block</h3>
        <p>***************************************</p>
      </div>
    </div>

    <div class="container three">
      <span class="float">float left Item</span>
      <div>
        <h3>display: inline-block</h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis ex a laudantium harum eum sed, molestias eos suscipit iste magni, aut perferendis commodi! Nostrum, quae cupiditate assumenda nihil eum in. Nostrum, quae cupiditate assumenda nihil eum in. Nostrum, quae cupiditate assumenda nihil eum in</p>
      </div>
    </div>

    <div class="container four">
      <span class="float">float left Item</span>
      <div>
        <h3>display: table-cell</h3>
        <p>***************************************</p>
      </div>
    </div>

    <div class="container four">
      <span class="float">float left Item</span>
      <div>
        <h3>display: table-cell</h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis ex a laudantium harum eum sed, molestias eos suscipit iste magni, aut perferendis commodi! Nostrum, quae cupiditate assumenda nihil eum in. Nostrum, quae cupiditate assumenda nihil eum in. Nostrum, quae cupiditate assumenda nihil eum in</p>
      </div>
    </div>

    <div class="container five">
      <span class="float">float left Item</span>
      <div>
        <h3>display: table</h3>
        <p>***************************************</p>
      </div>
    </div>

    <div class="container five">
      <span class="float">float left Item</span>
      <div>
        <h3>display: table</h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis ex a laudantium harum eum sed, molestias eos suscipit iste magni, aut perferendis commodi! Nostrum, quae cupiditate assumenda nihil eum in. Nostrum, quae cupiditate assumenda nihil eum in. Nostrum, quae cupiditate assumenda nihil eum in</p>
      </div>
    </div>

    <div class="container six">
      <span class="float">float left Item</span>
      <div>
        <h3>display: table</h3>
        <p>***************************************</p>
      </div>
    </div>

    <div class="container six">
      <span class="float">float left Item</span>
      <div>
        <h3>display: table</h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis ex a laudantium harum eum sed, molestias eos suscipit iste magni, aut perferendis commodi! Nostrum, quae cupiditate assumenda nihil eum in. Nostrum, quae cupiditate assumenda nihil eum in. Nostrum, quae cupiditate assumenda nihil eum in</p>
      </div>
    </div>


  </div>
</template>
<style scoped>
  .container {
    background: #ddd;
    margin: 10px 0;
  }
  .float {
    float: left;
    background: #000;
    color: #fff;
    padding: 10px;
  }
  .one div {
    background: #fedcbd;
  }
  .two div {
    overflow: hidden;
    background: #87843b;
  }
  .three div {
    display: inline-block;
    background: #f391a9;
  }
  .four div {
    display: table-cell;
    width: 9999px;
    background: #dea32c;
  }
  .five div {
    display: table;
    table-layout: fixed;
    background: #6f599c;
  }
  .six div {
    display: flex;
    flex-flow: column wrap;
    table-layout: fixed;
    background: #cde6c7;
  }
</style>