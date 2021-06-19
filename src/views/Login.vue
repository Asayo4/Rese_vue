<template>
  <div class="login">
    <div class="login-card">
      <div class="title">
        <p>Login</p>
      </div>
      <ValidationObserver ref="observer" >
      <form @submit.prevent="onSubmit" class="insertInfo" >
        <ValidationProvider name="メールアドレス" rules="required|email" v-slot="{ errors }">
        <div class="wrap-email">
          <img class="email-icon" src="../assets/mail1.png" />
          <input class="email" type="email" placeholder="Email" v-model="email" />
        </div>
        <span>{{ errors[0] }}</span>
        </ValidationProvider>
        <ValidationProvider rules="required|password" v-slot="{ errors }" name="パスワード">
        <div class="wrap-password">
          <img class="password-icon" src="../assets/pass1.png" />
          <input class="password" type="password"   placeholder="Password" v-model="password" autocomplete="new-password" />
        </div>
        <span>{{ errors[0] }}</span>
        </ValidationProvider>
        <div class="login-button">
          <button type="submit" name="submit"  class="login-btn">ログイン</button>
        </div>
      </form>
      </ValidationObserver>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { ValidationProvider, extend } from 'vee-validate';
import { localize } from 'vee-validate';
import ja from 'vee-validate/dist/locale/ja.json';
import { required } from 'vee-validate/dist/rules';

extend('required', required);
localize('ja', {
    ja
  });
Vue.component('ValidationProvider', ValidationProvider);

export default {
  data() {
    return {
      email: "",
      password: "",
    }
  },
  methods: {
    onSubmit() {
     this.$store.dispatch("login", {
        email: this.email,
        password: this.password
      });
    },
  }
}
</script>

<style scoped>
.login-card {
  width: 300px;
  background: #fff;
  border-radius: 5px;
  margin-top: 5%;
  margin-left: 50%;
  transform: translateX(-50%);
  box-shadow: 3px 3px 3px #c2c2c2;
}
.login-card span {
  text-align: center;
}
.title {
  background: rgb(35, 92, 246);
  padding: 5%;
  color: #fff;
  border-radius: 5px 5px 0 0 ;
}
.wrap-email {
  display: flex;
  margin-top: 5%;
  margin-left: 8%;
}
.email-icon {
  width: 2.5rem;
  height: 3rem;
}
.email {
  border-top: none;
  border-left: none;
  border-right: none;
  border-bottom: 1px solid;
  height: 1.5rem;
  line-height: 0.9rem;
  width: 75%;
  margin-top: 2%;
}
.wrap-password {
  display: flex;
  margin-top: 5%;
  margin-left: 8%;
}
.password-icon {
  width: 2rem;
  height: 2rem;
  margin: 0 5px;
}
.password {
  border-top: none;
  border-left: none;
  border-right: none;
  border-bottom: 1px solid;
  height: 1.5rem;
  line-height: 0.9rem;
  width: 75%;
  margin-top: 2%;
}
.login-btn {
  border: none;
  border-radius: 3px;
  width: 5rem;
  line-height: 1.5rem;
  margin: 5% 5% 5% 70%;
  background: rgb(35, 92, 246);
  color: #fff;
}
</style>