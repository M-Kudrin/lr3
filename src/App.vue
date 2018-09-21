<template>
  <main-component></main-component>
</template>

<script>
  import Vue from 'vue'
  import VueMaterial from 'vue-material'

  Vue.use(VueMaterial);

  import 'vue-material/dist/vue-material.min.css'
  import 'vue-material/dist/theme/default.css'

  import MainComponent from '@/components/main/main.vue'

  export default {
    name: 'app',
    components: {MainComponent}
  }
</script>
