<template>
  <div v-if="poll">
    <md-subheader :style="{'color' : fontColor}" style="font-size: 12pt">{{poll.question}}</md-subheader>
    <div v-for="(option,index) in poll.options" v-bind:key="index" style="margin-left: 16px;">
      <p :style="{'color' : fontColor}" style="margin: 0 0;font-size: 12pt;
           display: inline-block;    padding-right: 50pt">
        {{option.value}}</p>
      <div style="align-items: center;   flex-direction: row;width: 100%">
        <poll-bar style="height: 8pt;width: calc(100% - 50pt);display: inline-block;"
                  :value="(getVotesCount(option)/totalVotes)*100"
                  :emptyColor="classes.includes('my')?'rgba(255,255,255,0.5)':'#ECEFF1'"
                  :color="classes.includes('my')?'white':'#448AFF'"></poll-bar>
        <div style="display: inline-block;margin-left: 5pt; font-size: 10pt;width: 40pt"
             :style="{'color' : fontColor}">
          {{formatPercentage(getVotesCount(option)/totalVotes)}} ({{getVotesCount(option)}})
        </div>
      </div>
    </div>
    <div style="margin-left: 16px;font-size: 10pt; padding-right: 20pt;" :style="{'color' : fontColor}">Проголосовало
      {{totalVotes}}
      человек{{getNumEnding(totalVotes,['','а',''])}}
    </div>
    <div style="width: 100%;text-align: center;margin-top: 10pt">
      <div style="display: inline-block">
        <md-button :disabled="!online" class="md-raised" :class="{'md-primary':!classes.includes('my')}"
                   :style="{'background-color': classes.includes('my')?'white':''}"
                   @click="onRemoveVoteButtonClick">Удалить голос
        </md-button>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'

  import {getNumEnding} from '@@/commonUtils'

  import PollBar from './poll-bar'

  import numeral from 'numeral';

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
        online: navigator.onLine
      }
    },

    mounted() {
      this.$bus.$on('netWorkStatusChanged', online => this.online = online);
    },

    computed: {
      totalVotes() {
        return [].concat.apply([], this.poll.options.map(o => o.voted).filter(v => v != null)).length;
      }
    },

    methods: {
      onRemoveVoteButtonClick() {
        this.$emit('removeVote')
      },

      getNumEnding(iNumber, aEndings) {
        return getNumEnding(iNumber, aEndings);
      },

      getVotesCount(option) {
        return (option && option.voted) ? option.voted.length : 0;
      },

      formatPercentage(number) {
        return numeral(number).format('0%');
      }
    },

    components: {PollBar},

  }
</script>

<style>

</style>
