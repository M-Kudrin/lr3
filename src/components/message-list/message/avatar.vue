<template>
  <md-avatar class="md-avatar-icon" :style="{'background-color':backgroundColor}">{{user.login.charAt(0)}}</md-avatar>
</template>

<script>
  import Vue from 'vue'
  import {randomMaterialColor} from '@@/commonUtils'

  export default {

    props: {
      user: {
        type: Object,
        default: null
      }
    },

    computed: {
      backgroundColor() {
        return randomMaterialColor(this.user.uid);
      }
    },

  }
</script>
