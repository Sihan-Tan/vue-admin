<!--
 * @Author: Tan Xuan
 * @Date: 2020-03-16 10:00:27
 * @LastEditors: Tan Xuan
 * @LastEditTime: 2020-10-12 15:56:53
 * @Description: File content
 -->
<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="keepAlivePages">
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.path
    },
    keepAlivePages() {
      return this.$store.getters.keepAlivePages
    }
  }
}
</script>

<style scoped>
.app-main {
  height: calc(100vh - 110px);
  box-sizing: border-box;
  margin: 30px;
  padding: 26px;
  font-size: 18px;
  position: relative;
  background-color: #ffffff;
  overflow-y: auto;
}
.fixed-header + .app-main {
  padding-top: 50px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
