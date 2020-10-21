<!--
 * @Author: Tan Xuan
 * @Date: 2020-03-16 10:00:27
 * @LastEditors: Tan Xuan
 * @LastEditTime: 2020-03-31 10:34:11
 * @Description: File content
 -->
<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
$green: #73a81b;
$blue: #1890ff;

.primary {
  color: $blue;
}
.success {
  color: $green;
}
</style>
