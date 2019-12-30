<template>
    <div v-if="$site.themeConfig.valine" id="comments"></div>
</template>

<script>
export default {
    mounted() {
        const Valine = require('valine')
        setTimeout(() => {
            new Valine({
                el: '#comments',
                appId: this.$site.themeConfig.valine.appId,
                appKey: this.$site.themeConfig.valine.appKey,
                visitor: true,
                recordIP: true,
            })
        }, 500);
    }
}
</script>

<style lang="stylus">
$containerBgColor = #f0f6f9
#comments
    background-color $containerBgColor
    padding-bottom 4em
    padding-left 20%
    > .vwrap
        background-color white
        border none
        border-radius 0
        padding 1em 2em

    > .vlist .vcard
        background-color white
        padding 1em 2em
    > .info
        display none
</style>