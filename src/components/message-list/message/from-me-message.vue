<template>
  <div>
    <div style="word-wrap: break-word; line-height: 24px;  position: relative;padding: 10px 20px;
    color: white;  background: #448AFF;  border-radius: 25px;  float: right;">
      <div style="margin: 0;padding: 0">
        <slot></slot>
      </div>
    </div>
    <div
      style="clear: both; text-align: right; font-size: 8pt; word-wrap: break-word; line-height: 24px;margin-right: 5px">
      {{humanizeTime(time)}}
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {humanizeTime} from '@@/timeUtils.js'

  export default {
    props: {
      time: {
        type: Number,
        default: 0
      }
    },

    data() {
      return {}
    },

    methods: {
      humanizeTime(time) {
        return humanizeTime(time);
      }
    }
  }
</script>

<style scoped>

</style>
