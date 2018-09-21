<template>
  <md-dialog :md-active="isActive" :md-click-outside-to-close="false" :md-close-on-esc="false" style="overflow-y:auto">
    <md-dialog-title>Опрос</md-dialog-title>
    <div style="padding-bottom: 20px;background-color: white;width: 100%;padding-right: 20px;padding-left: 20px">

      <md-field md-clearable style="margin-bottom: 12px">
        <label>Тема</label>
        <md-input v-model="question"></md-input>
      </md-field>

      <md-field md-clearable style="margin-bottom: 12px" v-for="(option,index) in options" v-bind:key="index">
        <label>Вариант ответа {{index+1}}</label>
        <md-input v-model="option.value"></md-input>
      </md-field>
    </div>

    <md-dialog-actions>
      <md-button class="md-primary" @click="closeDialog">Отмена</md-button>
      <md-button class="md-primary" @click="onSubmitButtonClick">Создать опрос</md-button>
    </md-dialog-actions>
  </md-dialog>
</template>

<script>
  import Vue from 'vue'

  import {validationMixin} from 'vuelidate'
  import {
    required,
    minLength,
    maxLength
  } from 'vuelidate/lib/validators'

  export default {

    props: {
      isActive: {
        type: Boolean,
        default: false
      }
    },

    mixins: [validationMixin],
    data() {
      return {
        question: null,
        options: this.createDefaultOptions()
      }
    },

    validations: {
      question: {
        required
      }
    },

    computed: {},

    methods: {

      onSubmitButtonClick() {

        this.$emit('pollCreated', {
          question: this.question,
          options: this.options.map(o => o.value).filter(v => v != null && v !== '')
        });

        this.closeDialog();
      },
      closeDialog() {
        this.$emit('update:isActive', false);
        this.options = this.createDefaultOptions();
        this.question = '';
      },
      createDefaultOptions() {
        return [{value: ''}, {value: ''}, {value: ''}]
      }
    },

    components: {},

    watch: {
      options: {
        handler: function (val, oldVal) {
          if (val.length > 7) return;
          if (val.map(o => o.value).every(v => v != null && v !== ''))
            this.options.push({value: ''});
        },
        deep: true
      }
    }
  }
</script>

<style scoped>

</style>
