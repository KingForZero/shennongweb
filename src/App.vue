<template>
  <div id="app">
    <router-view/>
    <div style="text-align: center">
      <a rel="nofollow" href="http://www.beian.miit.gov.cn" target="_blank">豫ICP备19006687号</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
  @import "./font/font.css";
  #app {
    /*font-family: 'Avenir', Helvetica, Arial, sans-serif;*/
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    /*text-align: center;*/
    /*color: #2c3e50;*/
    /*margin-top: 60px;*/
    /*font-family: Source;*/
    font-family: source-hanSansCN-medium;

  }

</style>
