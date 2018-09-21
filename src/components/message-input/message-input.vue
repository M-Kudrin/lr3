<template>
  <div style="width: 100%">
    <div style="width: 100%; height: 50px; display: inline-flex; align-items: center;
    overflow: hidden; border-top: 1px solid rgba(0,0,0, .26);  background: rgba(0,0,0, .01)">
      <md-button :disabled="!online" class="md-icon-button" @click="onAddButtonClick">
        <md-icon>attach_file</md-icon>
      </md-button>
      <md-field md-inline md-clearable>
        <md-input :placeholder="'Написать сообщение...'" v-model="inputMessage"
                  @keyup.enter.native="onSubmit"></md-input>
      </md-field>
      <md-button :disabled="!online" class="md-icon-button md-primary" @click="onSubmit">
        <md-icon>send</md-icon>
      </md-button>


      <md-dialog :md-active.sync="showDialog" :md-fullscreen="false">
        <md-list>
          <md-list-item @click="onAddPollClick">
            <span class="md-list-item-text">Опрос</span>
          </md-list-item>
          <md-list-item @click="onAddLinkClick">
            <span class="md-list-item-text">Ссылка</span>
          </md-list-item>
        </md-list>
      </md-dialog>

      <link-input-dialog :isActive.sync="showLinkInputDialog" @linkIntroduced="onLinkIntroduced"></link-input-dialog>
    </div>
    <div style="margin-left: 52px">
      <md-chip class="md-primary" @md-delete="onLinkDeleted(link)" md-deletable v-for="(link) in links" :key="link">
        {{getFileName(link)}}
      </md-chip>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'

  import LinkInputDialog from '@/components/link-input-dialog/link-input-dialog'

  import {getFileName} from '@@/commonUtils'

  export default {
    props: {},
    data() {
      return {
        inputMessage: null,
        showDialog: false,
        online: true,
        showLinkInputDialog: false,
        links: []
      }
    },
    computed: {},

    mounted() {
      this.$bus.$on('netWorkStatusChanged', online => this.online = online);
    },

    methods: {
      onSubmit() {
        if (this.inputMessage != null && this.inputMessage !== '') {
          this.$emit('messageEntered', {text: this.inputMessage, links: this.links});
          this.inputMessage = null;
          this.links = [];
        }
      },
      onAddButtonClick() {
        this.showDialog = true
      },
      onAddPollClick() {
        this.showDialog = false;
        this.$emit('createPoll');
      },

      onAddLinkClick() {
        this.showDialog = false;
        this.showLinkInputDialog = true;
      },
      onLinkIntroduced(link) {
        this.links.push(link);
      },
      onLinkDeleted(link) {
        this.links = this.links.filter(l => l !== link);
      },
      getFileName(link) {
        return getFileName(link);
      }
    },

    components: {LinkInputDialog}

  }
</script>

<style scoped>

</style>
