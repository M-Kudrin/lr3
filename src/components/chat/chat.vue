<template>
  <div class="page-container" style="height: 100%;width: 100%;position: fixed">
    <md-app md-mode="fixed" style="height: 100%; border: 1px solid rgba(0,0,0,.12)">

      <md-app-toolbar class="md-primary">
        <span class="md-title">Smack</span>
        <div class="md-toolbar-section-end">
          <md-menu>
            <md-button md-menu-trigger class="md-icon-button">
              <md-icon>more_vert</md-icon>
            </md-button>
            <md-menu-content>
              <md-menu-item @click="signOut">Выход</md-menu-item>
            </md-menu-content>
          </md-menu>
        </div>
      </md-app-toolbar>

      <md-app-content style="padding: 0">
        <div :style="{'height': messagesListHeight+'px' }"
             style="display: flex;   flex-direction: column;">
          <message-list :scroll.sync="scrollToBottom"
                        :showNewMessagesLoadingSpinner="showNewMessagesLoadingSpinner"
                        :messages="messages"
                        :userUID="this.user.uid"
                        @loadMore="onLoadMore"
                        @messageUpdated="onMessageUpdated"></message-list>
          <message-input @messageEntered="onMessageEntered" @createPoll="onCreatePoll"></message-input>
        </div>

      </md-app-content>
    </md-app>

    <create-poll-dialog :isActive.sync="showCreatePollDialog" @pollCreated="onPollCreated">
    </create-poll-dialog>
  </div>
</template>

<style scoped>

</style>

<script>
  import Vue from 'vue'
  import MessageInput from '@/components/message-input/message-input.vue'
  import MessageList from '@/components/message-list/message-list.vue'
  import CreatePollDialog from '@/components/poll/create-poll-dialog.vue'

  import firebase from 'firebase'

  import {fireBaseMessagesPath, fireBaseUsersPath} from '@/config/config.js'

  export default {
    props: {
      db: {type: Object, default: null},
      user: {type: Object, default: null}
    },
    data() {
      return {
        messages: {},
        messagesLimit: 21,
        showCreatePollDialog: false,
        online: navigator.onLine,
        windowHeight: window.innerHeight,
        lastOfflineMessageTime: Date.now(),
        scrollToBottom: false,
        showNewMessagesLoadingSpinner: false
      }
    },

    mounted() {
      this.$bus.$on('netWorkStatusChanged', online => this.online = online);
      this.$nextTick(() => {
        window.addEventListener('resize', () => {
          this.windowHeight = window.innerHeight
        });
      });

      this.setMessagesStorageListeners();
    },

    computed: {
      messagesListHeight() {
        return this.windowHeight - 64;
      },
      messageStorage() {
        return this.db.ref(fireBaseMessagesPath)
      },
      lastMessageTime() {
        const lastMessageTime = Math.min.apply(Math, Object.values(this.messages).map(({sendingTime}) => sendingTime));
        return lastMessageTime > 0 && lastMessageTime < Date.now() ? lastMessageTime : Date.now();
      },

      firstMessageTime() {
        const firstMessageTime = Math.max.apply(Math, Object.values(this.messages).map(({sendingTime}) => sendingTime));
        return firstMessageTime > 0 && firstMessageTime < Date.now() ? firstMessageTime : Date.now();
      },

    },
    methods: {

      readMessagesFromIndexDB(onMessagesRead, limit) {

        this.$db.messages.orderBy('sendingTime')
          .and(x => x.sendingTime < this.lastMessageTime).reverse().limit(limit)
          .toArray().then(messages => {
          messages.forEach(message => {
            Vue.set(this.messages, message.id, {
              id: message.id,
              sendingTime: message.sendingTime,
              value: JSON.parse(message.value),
              author: {
                uid: message.authorUID,
                login: message.authorLogin
              },
              type: message.type
            });
          });
          this.lastOfflineMessageTime = this.firstMessageTime;
          onMessagesRead(messages.length);
        })
      },

      saveMessageToIndexDB({id, sendingTime, value, author, type}) {
        this.$db.messages.put({
          id,
          sendingTime,
          type,
          value: JSON.stringify(value),
          authorUID: author.uid,
          authorLogin: author.login
        })
      },

      signOut() {
        firebase.auth().signOut();
      },


      onMessageEntered(message) {
        this.saveMessage('text', message)
      },

      saveMessage(type, value) {
        this.messageStorage.push().set({
          type,
          value,
          sendingTime: Date.now(),
          author: this.user
        })
      },

      addEntity(entity) {
        Vue.set(this.messages, entity.id, entity);
        this.saveMessageToIndexDB(entity);
      },

      onLoadMore(onMessagesLoaded) {
        this.loadMessages((messagesCount) => {
          onMessagesLoaded(messagesCount);
        });
      },

      messageToEntity(id, {sendingTime, value, author, type}) {
        return {id, sendingTime, value, author, type}
      },

      loadMessages(onMessagesLoaded) {
        if (this.online)
          if (Object.keys(this.messages).length < 2) {
            this.showNewMessagesLoadingSpinner = true;
            this.readMessagesFromIndexDB((size) => {
              this.scrollToBottom = true;

              const messagesLoadedListener = (snapshot) => {
                this.showNewMessagesLoadingSpinner = false;
                const val = snapshot.val();
                if (val) {
                  $.each(val, (key, value) => {
                    this.addEntity(this.messageToEntity(key, value));
                  });
                  this.scrollToBottom = true;
                }
                onMessagesLoaded(Object.keys(this.messages).length);
              };

              if (size > 0)
                this.messageStorage.orderByChild("sendingTime").startAt(this.firstMessageTime)
                  .once("value", messagesLoadedListener);
              else this.messageStorage.orderByChild("sendingTime").endAt(this.lastMessageTime).limitToLast(this.messagesLimit)
                .once("value", messagesLoadedListener);
            }, this.messagesLimit)
          }
          else
            this.messageStorage.orderByChild("sendingTime").endAt(this.lastMessageTime).limitToLast(this.messagesLimit)
              .once("value", (snapshot) => {
                const val = snapshot.val();
                if (val)
                  $.each(val, (key, value) => {
                    this.addEntity(this.messageToEntity(key, value));
                  });
                onMessagesLoaded(val != null ? Object.keys(val).length : 0);
              });
        else
          this.readMessagesFromIndexDB(onMessagesLoaded, this.messagesLimit)
      },

      setMessagesStorageListeners() {
        if (this.messageStorage !== null) {

          const onMessageAddOrUpdate = (data) => {
            const message = this.messageToEntity(data.key, data.val());
            message.isVisible = true;
            this.addEntity(message);
          };

          this.messageStorage.limitToLast(20).on('child_added', onMessageAddOrUpdate);

          this.messageStorage.on('child_changed', onMessageAddOrUpdate);

          this.messageStorage.on('child_removed', (data) => {
            Vue.delete(this.messages, data.key);
          });
        }
      },

      onCreatePoll() {
        this.showCreatePollDialog = true;
      },
      onPollCreated({question, options}) {
        this.saveMessage('poll', {
          question,
          options: options.map(o => ({
            'value': o,
            'voted': []
          }))
        })
      },
      onMessageUpdated({id, sendingTime, value, author, type}) {
        this.messageStorage.child(id).set({sendingTime, value, author, type})
      }
    },

    components: {MessageInput, MessageList, CreatePollDialog},

    watch: {
      online(newVal) {
        if (newVal) {
          this.showNewMessagesLoadingSpinner = true;
          this.messageStorage.orderByChild("sendingTime").startAt(this.lastOfflineMessageTime)
            .once("value", (snapshot) => {
              this.showNewMessagesLoadingSpinner = false;
              const val = snapshot.val();
              if (val) {
                $.each(val, (key, value) => {
                  this.addEntity(this.messageToEntity(key, value));
                });
                this.scrollToBottom = true;
              }
            });
        }
      }
    }
  }
</script>
