<template>
  <div id="splash">
    <img src="../../assets/splash.png" style="width: 100%;height: 100%">
  </div>
</template>

<script>
export default {
  name: 'Splash',
  data () {
    return {
      option_value: 'android_low'
    }
  }
}
</script>

<style scoped>
#splash{
  position:fixed;
  top :0;
  left :0;
  z-index :6;
  width :100%;
  height :100%;
  box-sizing :border-box;
}

</style>
