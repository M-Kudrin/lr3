<template>
  <div style="width: 100%; height: 100%;background-color: white">
    <network-status-watcher></network-status-watcher>
    <div v-if="!user&&!noAuthorized" style="width: 100%;height: 100%;display: flex;
    align-items: center; justify-content: center;overflow:hidden">
      <grid-loader :loading="true" :color="'#448AFF'"></grid-loader>
    </div>
    <chat :db="db" :user="user" v-if="user&&!noAuthorized"></chat>
    <auth v-if="!user&&noAuthorized"></auth>
    <md-snackbar :md-position="'center'" :md-duration="3000000" :md-active="!online" :disabled="true" md-persistent>
      <span>Нет подключения</span>
    </md-snackbar>
  </div>
</template>

<script>
  import Vue from 'vue'
  import firebase from 'firebase';
  import fireBaseConfig from '@/config/firebase-config'

  import NetworkStatusWatcher from '@/components/network-status-watcher/network-status-watcher'
  import Chat from "@/components/chat/chat"
  import Auth from '@/components/auth/auth'

  import GridLoader from 'vue-spinner/src/RiseLoader.vue'

  const db = firebase.initializeApp(fireBaseConfig).database();
  import {fireBaseUsersPath} from '@/config/config.js'

  export default {

    props: {},

    data() {
      return {
        db: db,
        user: null,
        noAuthorized: false,
        online: navigator.onLine
      }
    },

    mounted() {
      const user = localStorage.getItem('user');
      if (user)
        this.user = JSON.parse(user);
      else this.noAuthorized = true;

      firebase.auth().onAuthStateChanged(user => {
        if (!this.online) return;
        if (!user) {
          this.noAuthorized = true;
          this.user = null;
          localStorage.removeItem('user');
        } else {
          this.db.ref(fireBaseUsersPath + "/" + user.uid).on('value', (snapshot) => {
            if (snapshot.val()) {
              this.user = {
                uid: user.uid,
                login: snapshot.val().login
              };
              localStorage.setItem('user', JSON.stringify(this.user));
              this.noAuthorized = false;
            }
          });
        }
      });

      this.$bus.$on('netWorkStatusChanged', online => this.online = online);
    },

    computed: {},

    components: {
      Chat, Auth, GridLoader, NetworkStatusWatcher
    },

  }
</script>

