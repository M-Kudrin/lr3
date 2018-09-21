<template>
  <div v-if="message" style=" width: 100%">
    <FromMeMessage v-if="message.author.uid===userUID" :time="message.sendingTime">
      <slot>
        <p style="margin: 0;line-height: 1.15">
          {{message.value.text}}
        </p>
        <div style="margin-top: 10px" v-if="message.value.links">
          <md-chip :md-disabled="!online" @click="onLinkClick(link)" style="background-color: white;cursor: pointer"
                   v-for="(link) in message.value.links" :key="link">
            {{getFileName(link)}}
          </md-chip>
        </div>
      </slot>
    </FromMeMessage>
    <FromThemMessage v-else :time="message.sendingTime" :author="message.author" >
      <slot>
        <p style="margin: 0;line-height: 1.15">
          {{message.value.text}}
        </p>
        <div style="margin-top: 10px" v-if="message.value.links">
          <md-chip :md-disabled="!online" @click="onLinkClick(link)" style="cursor: pointer" class="md-primary"
                   v-for="(link) in message.value.links"
                   :key="link">
            {{getFileName(link)}}
          </md-chip>
        </div>
      </slot>
    </FromThemMessage>

  </div>
</template>

<script>
  import Vue from 'vue'

  import FromMeMessage from '@/components/message-list/message/from-me-message.vue'
  import FromThemMessage from '@/components/message-list/message/from-them-message.vue'

  import {getFileName} from '@@/commonUtils'

  export default {
    props: {
      message: {
        type: Object,
        default: null
      },
      userUID: {
        type: String,
        default: null
      }
    },

    data() {
      return {
        showOpenFileLinkDialog: false,
        online: navigator.onLine
      }
    },

    mounted() {
      this.$bus.$on('netWorkStatusChanged', online => this.online = online);
    },

    components: {
      FromMeMessage, FromThemMessage
    },

    methods: {
      getFileName(link) {
        return getFileName(link);
      },
      onLinkClick(link) {
        if (!this.online) return;
        window.open(link, '_blank')
      }
    }
  }
</script>

<style>

</style>
