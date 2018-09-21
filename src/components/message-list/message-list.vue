<template>
  <md-content style="overflow-y: auto; overflow-x: hidden; padding-right: 5pt;padding-left: 5pt;flex: 1; display: flex;
    flex-direction: column; background-color: #ECEFF1" ref="chatContainer" v-scroll="onScroll">
    <div style="width: calc(100% - 20px); font-size: 11pt;  font-weight: normal; margin: auto auto 10px;">

      <div v-if="!noMore&&!showNewMessagesLoadingSpinner"
           style="display: flex;  align-items: center; justify-content: center;margin-top: 40px">
        <md-progress-spinner :md-diameter="30" :md-stroke="3" md-mode="indeterminate"></md-progress-spinner>
      </div>

      <div style="height: 20px;width: 100%"></div>
      <div :style="{'visibility':message.isVisible||messagesArray.length-index<20?'':'hidden'}"
           v-for="(message,index) in messagesArray"
           style="margin-bottom: 5pt ;position: relative;" :id="message.id">
        <text-message v-if="message.type==='text'" :message="message" v-bind:key="message.id"
                      :userUID="userUID">
        </text-message>

        <poll-message v-if="message.type==='poll'" :message="message"
                      v-bind:key="message.id" :userUID="userUID" @messageUpdated="onMessageUpdated">
        </poll-message>
      </div>
      <div v-if="showNewMessagesLoadingSpinner"
           style="display: flex;  align-items: center;    justify-content: center;">
        <md-progress-spinner :md-diameter="30" :md-stroke="3" md-mode="indeterminate"></md-progress-spinner>
      </div>
    </div>
  </md-content>
</template>

<script>
  import Vue from 'vue'
  import TextMessage from '@/components/message-list/message/text-message.vue'
  import PollMessage from '@/components/message-list/message/poll-message.vue'
  import vuescroll from 'vue-scroll'

  const VueScrollTo = require('vue-scrollto');

  Vue.use(VueScrollTo);

  Vue.use(vuescroll);

  export default {

    props: {
      messages: {
        type: Object,
        default: () => {
        }
      },
      userUID: {
        type: String,
        default: null
      },
      scroll: {
        type: Boolean,
        default: false
      },
      showNewMessagesLoadingSpinner: {
        type: Boolean,
        default: false
      }
    },

    mounted() {
      this.loadMore();
    },

    data() {
      return {
        oldMessages: JSON.parse(JSON.stringify(this.messages)),
        prevScroll: 0,
        loading: false,
        noMore: false,
        ignoreScroll: false
      }
    },

    computed: {
      messagesArray() {
        return Object.keys(this.messages).map((key) => this.messages[key]).sort((a, b) => a.sendingTime - b.sendingTime);
      }
    },

    methods: {
      scrollToBottom() {
        const chatContainer = this.$refs.chatContainer.$el;
        chatContainer.scrollTop = chatContainer.scrollHeight;
      },
      loadMore() {
        this.loading = true;
        this.$emit('loadMore', (messagesCount) => {
          this.loading = false;
          this.noMore = messagesCount < 20;
        });
      },
      onScroll(e, position) {

        if (position.scrollTop < 50 && position.scrollTop - this.prevScroll < 10 && !this.loading &&
          !this.noMore && !this.ignoreScroll)
          this.loadMore();
        else this.ignoreScroll = false;

        this.prevScroll = position.scrollTop;
      },
      onMessageUpdated(message) {
        this.$emit('messageUpdated', message);
      }
    },

    components: {TextMessage, PollMessage},

    watch: {
      messages(newVal) {

        const showAllMessages = () => {
          setTimeout(() => {
            Object.keys(newVal).forEach((key) => Vue.set(newVal[key], 'isVisible', true));
          }, 0);
        };

        this.ignoreScroll = true;

        const oldValSize = Object.keys(this.oldMessages).length;
        const newValSize = Object.keys(newVal).length;

        let minMessage = Object.keys(this.oldMessages).map((key) => this.oldMessages[key])
          .sort((a, b) => a.sendingTime - b.sendingTime)[0];

        const maxMessageTime = (messages) => {
          const message = Object.keys(messages).map((key) => messages[key])
            .sort((a, b) => b.sendingTime - a.sendingTime)[0];
          return message ? message.sendingTime : 0;
        };

        const oldMessagesMaxTime = maxMessageTime(this.oldMessages);
        const newMessagesMaxTime = maxMessageTime(newVal);

        this.oldMessages = JSON.parse(JSON.stringify(this.messages));

        if (oldValSize < 20 || newMessagesMaxTime > oldMessagesMaxTime)
          setTimeout(() => {
            this.scrollToBottom();
            showAllMessages();
          }, 0);
        else {
          setTimeout(() => {
            if (!this.scroll)
              this.$scrollTo(document.getElementById(minMessage.id), 1, {
                container: this.$refs.chatContainer.$el,
                easing: null,
                offset: -0.5 * $(this.$refs.chatContainer.$el).height(),
                cancelable: false,
                x: false,
                y: true,
                onDone: showAllMessages
              });
            else
              showAllMessages();
          }, 0);
        }
      },

      scroll(newVal) {
        if (newVal) {
          setTimeout(() => {
            this.scrollToBottom()
          }, 0);
          setTimeout(() => {
            this.$emit('update:scroll', false);
          }, 1000);
        }
      }
    }

  }
</script>

<style scoped>

</style>
