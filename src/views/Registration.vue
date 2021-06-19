<template>
  <div class="register-page">
    <div class="register-card">
      <div class="title">
        <p>Registration</p>
      </div>
      <ValidationObserver ref="observer" >
      <form class="insertInfo" @submit.prevent="auth" >
        <ValidationProvider name="ユーザーネーム" rules="required|min:2|max:50" v-slot="{ errors }">
        <div class="wrap-user">
          <img class="user-icon" src="../assets/user1.png" />
          <input class="user-name" placeholder="Username" v-model="user_name" >
        </div>
        <span>{{ errors[0] }}</span>
        </ValidationProvider>
        <ValidationProvider name="ニックネーム" rules="required|min:2|max:50" v-slot="{ errors }">
        <div class="wrap-nick">
          <img class="nick-icon" src="../assets/question1.png" title="レビューをする際のニックネームをご入力ください。このニックネームは後から変更できません。" />
          <input class="nick-name" placeholder="Nickname" v-model="nickname" >
        </div>
        <span>{{ errors[0] }}</span>
        </ValidationProvider>
        <ValidationProvider name="email" rules="required|email" v-slot="{ errors }">
        <div class="wrap-email">
          <img class="email-icon" src="../assets/mail1.png" />
          <input class="email" type="email" placeholder="Email" v-model="email">
        </div>
        <span>{{ errors[0] }}</span>
        </ValidationProvider>
        <ValidationProvider name="パスワード" rules="required|min:4|max:30" v-slot="{ errors }">
        <div class="wrap-password">
          <img class="password-icon" src="../assets/pass1.png" />
            <input class="password" type="password"   placeholder="Password" v-model="password"  autocomplete="new-password" >
        </div>
        <span>{{ errors[0] }}</span>
        </ValidationProvider>
        <div class="registration-button">
          <input class="registration-btn" type="submit" name="submit" value="登録">
        </div>
      </form>
      </ValidationObserver>
    </div>
  </div>
</template>

<script>

import axios from 'axios'
import Vue from 'vue'
import { ValidationProvider, extend, ValidationObserver } from 'vee-validate';
import { localize } from 'vee-validate';
import ja from 'vee-validate/dist/locale/ja.json';
import { required, min, max} from 'vee-validate/dist/rules';

extend('required', required);
extend('min', min);
extend('max', max);
localize('ja', {
    ja
  });
Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);

export default {
  data() {
    return {
        user_name: "",
        email: "",
        password: "",
        nickname: ""
    }
  },
  methods:{
    auth() {
      axios.post("https://still-coast-90539.herokuapp.com/api/register", {
          user_name: this.user_name,
          password: this.password,
          email: this.email,
          nickname: this.nickname
        })
        this.$router.push({ name: 'Thanks' })
    },
  }
}


</script>


<style scoped>
.register-card {
  width: 300px;
  background: #fff;
  border-radius: 5px;
  margin-top: 5%;
  margin-left: 50%;
  transform: translateX(-50%);
  box-shadow: 3px 3px 3px #c2c2c2;
}
.register-card span {
  text-align: center;
}
.title {
  background: rgb(35, 92, 246);
  padding: 5%;
  color: #fff;
  border-radius: 5px 5px 0 0 ;
}
.wrap-user {
  display: flex;
  margin-top: 5%;
  margin-left: 8%;
}
.user-icon {
  width: 2rem;
}
.user-name {
  border-top: none;
  border-left: none;
  border-right: none;
  border-bottom: 1px solid;
  height: 1rem;
  line-height: 0.9rem;
  width: 70%;
  margin-top: 2%;
}
.wrap-nick {
  display: flex;
  margin-top: 5%;
  margin-left: 8%;
}
.nick-icon {
  width: 2rem;
}
.nick-name {
  border-top: none;
  border-left: none;
  border-right: none;
  border-bottom: 1px solid;
  height: 1rem;
  line-height: 0.9rem;
  width: 70%;
  margin-top: 2%;
}
.wrap-email {
  display: flex;
  margin-top: 5%;
  margin-left: 8%;
}
.email-icon {
  width: 2rem;
}
.email {
  border-top: none;
  border-left: none;
  border-right: none;
  border-bottom: 1px solid;
  height: 1rem;
  line-height: 0.9rem;
  width: 70%;
  margin-top: 2%;
}
.wrap-password {
  display: flex;
  margin-top: 5%;
  margin-left: 8%;
}
.password-icon {
  width: 1.5rem;
  margin: 0 5px 0 3px;
}
.password {
  border-top: none;
  border-left: none;
  border-right: none;
  border-bottom: 1px solid;
  height: 1rem;
  width: 70%;
  margin-top: 2%;
}
.registration-btn {
  border: none;
  border-radius: 3px;
  width: 3rem;
  line-height: 1.5rem;
  margin: 5% 5% 5% 75%;
  background: rgb(35, 92, 246);
  color: #fff;
}
</style>