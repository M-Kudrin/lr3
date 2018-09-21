<template>
  <div v-if="poll" :class="{'my':classes.includes('my')}">
    <div style="background-color: transparent">
      <md-subheader :style="{'color' : fontColor}" style="font-size: 12pt">{{poll.question}}</md-subheader>
      <div style="padding-top: 0;padding-bottom: 0;display: flex" v-for="(option,index) in poll.options"
           v-bind:key="index">
        <md-radio class="md-primary" v-model="selectedOption" :value="index"
                  style="margin-right: 20px;display: inline-block"/>
        <span style=" display: inline-flex; align-items: center;"
              :style="{'color' : fontColor}">{{option.value}}</span>
      </div>
      <div style="padding-top: 0;padding-bottom: 0">
        <div style="width: 100%;text-align: center">
          <div style="display: inline-block">
            <md-button :disabled="selectedOption == null||!online" class="md-raised"
                       :class="{'md-primary':!classes.includes('my')}"
                       :style="{'background-color': classes.includes('my')?'white':''}"
                       @click="onVoteButtonClick">Проголосовать
            </md-button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  import Vue from 'vue'

  export default {

    props: {
      poll: {
        type: Object,
        default: null
      },
      fontColor: {
        type: String,
        default: 'black'
      },
      classes: {
        type: Array,
        default: () => {
          return []
        }
      }
    },

    data() {
      return {
        selectedOption: null,
        online: navigator.onLine
      }
    },

    computed: {},

    methods: {
      onVoteButtonClick() {
        this.$emit('optionSelected', this.selectedOption);
      }
    },

    mounted() {
      this.$bus.$on('netWorkStatusChanged', online => this.online = online);
    },

    components: {},

  }
</script>

<style>
  .my .md-ripple.md-list-item-content .md-radio-container {
    border-color: white !important;
  }

  .my .md-radio.md-theme-default.md-checked.md-primary .md-radio-container:after {
    background-color: white !important;
  }

  .my .md-ripple.md-list-item-content .md-radio-container .md-ripple {
    color: white !important;
  }
</style>
