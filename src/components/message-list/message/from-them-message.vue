<template>
  <div style="display: flex">
    <div style="margin-top: 13pt; margin-right: 5px;">
      <avatar :user="author"></avatar>
    </div>
    <div>
      <div style="font-size: 9pt;font-weight: 600;margin-left: 5px">{{author.login}}</div>
      <div class="from-them" style="display: inline-block;word-wrap: break-word; line-height: 24px;
    position: relative; padding: 10px 20px; background: white; border-radius: 25px; color: black;">
        <div style="margin: 0;padding: 0">
          <slot></slot>
        </div>
      </div>
      <div
        style="clear: both; text-align: left; font-size: 8pt; word-wrap: break-word; line-height: 24px;margin-left: 5px">
        {{humanizeTime(time)}}
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import Avatar from './avatar'
  import {humanizeTime} from '@@/timeUtils.js'

  export default {

    props: {
      time: {
        type: Number,
        default: 0
      },
      author: {
        type: Object,
        default: null
      },
    },

    data() {
      return {}
    },

    methods: {
      humanizeTime(time) {
        return humanizeTime(time);
      }
    },

    components: {Avatar}
  }
</script>

<style scoped>

</style>
