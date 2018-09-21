<template>
  <div style="width: 100%;height: 100%;position: relative;display: flex;
    align-items: center;    justify-content: center;overflow-y:scroll">
    <md-progress-bar style="position: absolute;    top: 0;    right: 0;    left: 0;" md-mode="indeterminate"
                     v-if="sending"/>
    <div style="max-width: 400px;width: 100%;padding-left: 5px;padding-right: 5px">
      <form novalidate class="md-layout">
        <md-card class="md-layout-item">
          <md-card-header>
            <div class="md-title">
              <div style="width: 100%;text-align: center">
                <div style="display: inline-block;width: 100px;height: 100px">
                  <img src="/static/img/icons/icon-512x512.png" width="100px" height="100px"/>
                </div>
              </div>
            </div>
          </md-card-header>

          <md-card-content>
            <md-field :class="getValidationClass('email')">
              <label>E-mail</label>
              <md-input type="email" name="email" autocomplete="email" v-model="form.email"
                        :disabled="sending"/>
              <span class="md-error" v-if="!$v.form.email.required">Обязательное поле</span>
              <span class="md-error" v-else-if="!$v.form.email.email">Неверный адрес электронной почты</span>
            </md-field>

            <md-field :class="getValidationClass('password')">
              <label>Пароль</label>
              <md-input type="password" name="password" v-model="form.password"
                        :disabled="sending"/>
              <span class="md-error" v-if="!$v.form.password.required">Обязательное поле</span>
              <span class="md-error" v-else-if="!$v.form.password.password">Минимальная длина пароля 6 символов</span>
            </md-field>
          </md-card-content>

          <md-card-actions>
            <div style="width: 100%;text-align: center;padding-bottom: 10px">
              <div style="display: inline-block">
                <div style="width: 100%;text-align: center">
                  <div style="display: inline-block;width: 100%">
                    <md-button @click="validateUser" class="md-raised md-primary"
                               style="display: block; width: 100%"
                               :disabled="sending">Войти
                    </md-button>
                  </div>
                </div>
                <div style="width: 100%;text-align: center;margin-top: 10pt">
                  <div style="display: inline-block">
                    <md-button style="display: block" :disabled="sending" @click="onCreateAccountButtonClick">Создать
                      аккаунт
                    </md-button>
                  </div>
                </div>
              </div>
            </div>
          </md-card-actions>
        </md-card>

        <md-snackbar :md-position="'center'" :md-duration="3000" :md-active.sync="showSnackbar" md-persistent>
          <span>Неверные логин или пароль</span>
        </md-snackbar>
      </form>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import firebase from 'firebase'

  import {validationMixin} from 'vuelidate'
  import {
    required,
    email,
    minLength
  } from 'vuelidate/lib/validators'

  export default {

    props: {},

    data() {
      return {
        form: {
          email: null,
          password: null
        },
        sending: false,
        showSnackbar: false,
        online: navigator.onLine
      }
    },
    mixins: [validationMixin],
    mounted() {
      this.$bus.$on('netWorkStatusChanged', online => this.online = online);
    },

    validations: {
      form: {
        password: {
          required,
          minLength: minLength(6)
        },
        email: {
          required,
          email
        }
      }
    },

    computed: {},

    methods: {
      validateUser() {
        this.$v.$touch();
        if (!this.$v.$invalid)
          this.signInWithPassword();
      },

      getValidationClass(fieldName) {
        const field = this.$v.form[fieldName];

        if (field) {
          return {
            'md-invalid': field.$invalid && field.$dirty
          }
        }
      },

      signInWithPassword() {
        this.sending = true;
        return firebase.auth().signInWithEmailAndPassword(this.form.email, this.form.password)
          .then((userData) => {
            this.sending = false;
            return userData;
          })
          .catch((error) => {
            this.sending = false;
            this.showSnackbar = true;
          });
      },

      onCreateAccountButtonClick() {
        this.$emit('createAccountButtonClicked');
      }
    }

  }
</script>

<style scoped>
  .md-card {
    box-shadow: none !important;
  }
</style>
