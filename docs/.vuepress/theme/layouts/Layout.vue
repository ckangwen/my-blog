<template>
  <Framework>
    <PostList />
    <Pagination prev-text="上一页" next-text="下一页" slot="pagination"/>
  </Framework>
</template>

<script>
import Framework from '@theme/components/Framework.vue'
import PostList from '@parent-theme/components/PostList.vue'
export default {
  name: "Layout",
  components: {
    Framework,
    PostList,
    Pagination: () => import('@parent-theme/components/Pagination.vue'),
  },
};
</script>
<style>
  .logo__desc-title,
  .logo__desc-subtitle,
  .nav-links > .nav-links__item > a,
  .article__title > div> a,
  .footer > * {
    font-family: 'Fira Code' ,'Source Han Sans HW SC';
  }
</style>