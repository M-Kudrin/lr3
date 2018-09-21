<template>
  <div style="width: 100%;height: 100%">
    <signin-dialog v-if="!showRegDialog" @createAccountButtonClicked="showRegDialog = true"></signin-dialog>
    <reg-dialog v-if="showRegDialog" @backButtonClicked="showRegDialog = false"></reg-dialog>
  </div>
</template>

<script>
  import Vue from 'vue'

  import SigninDialog from '@/components/signin-dialog/signin-dialog'
  import RegDialog from '@/components/reg-dialog/reg-dialog'

  export default {

    data() {
      return {
        showRegDialog: false
      }
    },
    components: {SigninDialog, RegDialog},

  }
</script>

<style scoped>

</style>
