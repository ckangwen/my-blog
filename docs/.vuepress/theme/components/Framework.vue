<template>
    <div class="layout">
    <Hero/>
    <div class="container">
      <div class="page">
        <div class="page-left"></div>
        <div class="page-center content">
          <slot></slot>
          <slot name="pagination"/>
        </div>
        <div class="page-right"></div>
      </div>
    </div>
    <slot name="comment"></slot>
    <ClientOnly>
    <Footer/>
    </ClientOnly>
    <script src='//unpkg.com/valine/dist/Valine.min.js'></script>
  </div>
</template>

<script>
import Hero from "@parent-theme/components/Header/Hero.vue";
import PostList from "@parent-theme/components/PostList.vue";
import Page from "@parent-theme/components/ArticleDetail.vue";
import Footer from "./Footer";
export default {
    name: 'Framework',
    components: {
        Hero,
        PostList,
        Page,
        Footer
    }
}
</script>


<style src="@parent-theme/styles/index.styl" lang="stylus"></style>