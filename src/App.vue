<template>
  <div id="app">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<style scoped>
@import "~@/assets/css/base.css";

#app {
  /* width: 100vw; */
  overflow-x: hidden;
}
</style>
