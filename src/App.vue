<template>
  <div id="app">
    <transition name="fade">
      <Splash v-show="showApp"></Splash>
    </transition>
    <mu-appbar style="width: 100%;" color="primary">
      Interview
    </mu-appbar>
    <div id="nav">
      <router-link :to="MAINROUTER">目录</router-link> |
      <router-link :to="ABOUTROUTER">随机</router-link>
    </div>
    <router-view/>
  </div>
</template>
<script>
import Splash from '@/views/Splash/Splash'
export default {
  components: {
    Splash
  },
  mounted: function () {
    this.$store.dispatch('GET_TABLE_NAME').then(() => {
      this.showApp = false
    })
  },
  data () {
    return {
      showApp: true
    }
  }
}
</script>
<style lang="scss">
.fade-enter-active, .fade-leave-active {
  transition: opacity 3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
