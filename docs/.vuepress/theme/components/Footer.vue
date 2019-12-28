<template>
  <div class="footer-wrapper">
    <footer class="footer">
      <div class="footer__github">
        <span>Github:</span>
        <a href="https://github.com/ckangwen" target="_blank">
          <i class="iconfont" v-html="icons.github"></i>
        </a>
      </div>
      <div class="footer__copyright" v-text="copyright"></div>
    </footer>
  </div>
</template>
<script>
export default {
  data() {
    return {
      icons: {
        github: "&#xe741;"
      }
    };
  },
  computed: {
    copyright() {
      return this.$site.themeConfig.footer.copyright;
    },
    social() {
      return this.$site.themeConfig.footer.social || [];
    }
  }
};
</script>
<style>
.footer-wrapper {
  width: 100%;
  box-shadow: 5px 0px 15px -2px rgba(0, 0, 0, 0.25);
}
.footer {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.footer__github .iconfont {
  font-size: 1.5em;
  margin-left: 1em;
}
.footer__copyright {
  padding: 10px 0;
}
</style>