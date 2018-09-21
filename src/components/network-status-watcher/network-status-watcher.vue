<template>

</template>

<script>
  import Vue from 'vue'

  export default {

    props: {},

    data() {
      return {
        online: navigator.onLine
      }
    },

    mounted() {
      setInterval(() => {
        this.online = navigator.onLine;
      }, 1000)
    },


    watch: {
      online(newVal) {
        this.$bus.$emit('netWorkStatusChanged', newVal)
      }
    }
  }
</script>

<style scoped>

</style>
