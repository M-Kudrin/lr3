<template>
    <div style="position: relative" :style="{'background-color':emptyColor}">
      <div :style="{'width': value+'%', 'background-color':color}" style="position: absolute;height: 100%"></div>
    </div>
</template>

<script>
  import Vue from 'vue'

  export default {

    props: {
      value: {
        type: Number,
        default: 50
      },
      color: {
        type: String,
        default: 'red'
      },
      emptyColor: {
        type: String,
        default: 'white'
      }
    },

    data() {
      return {}
    }

  }
</script>

<style scoped>

</style>
