<template>
  <md-dialog :md-active="isActive"
             :md-click-outside-to-close="false"
             :md-close-on-esc="false"
             :md-fullscreen="false" style="width: 80%;max-width: 400px">
    <md-dialog-title style="margin-bottom: 0">Ссылка</md-dialog-title>
    <div style="background-color: white;width: 100%;padding-right: 20px;padding-left: 20px">
      <md-field md-clearable style="margin-bottom: 10pt" :class="getValidationClass('link')">
        <md-input v-model="link"></md-input>
        <span class="md-error" v-if="!$v.link.url">Ссылка имеет неверный формат</span>
      </md-field>
    </div>

    <md-dialog-actions>
      <md-button class="md-primary" @click="closeDialog">Отмена</md-button>
      <md-button class="md-primary" @click="validateLink" :disabled="link==null||link===''">Прикрепить</md-button>
    </md-dialog-actions>
  </md-dialog>
</template>

<script>
  import Vue from 'vue'

  import {validationMixin} from 'vuelidate'
  import {url} from 'vuelidate/lib/validators'

  export default {

    props: {
      isActive: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        link: null
      }
    },

    validations: {
      link: {
        url
      }
    },

    mixins: [validationMixin],

    computed: {},

    methods: {
      closeDialog() {
        this.$emit('update:isActive', false);
        this.link = '';
      },

      onAddButtonClick() {
        this.$emit('linkIntroduced', this.link);
        this.closeDialog();
      },

      validateLink() {
        this.$v.$touch();
        if (!this.$v.$invalid)
          this.onAddButtonClick();
      },

      getValidationClass(fieldName) {
        const field = this.$v[fieldName];

        if (field) {
          return {
            'md-invalid': field.$invalid && field.$dirty
          }
        }
      },
    },

    components: {},

  }
</script>

<style scoped>

</style>
