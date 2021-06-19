import axios from 'axios';
import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import router from '../router';

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    auth: "",
    id: "",
    
  },
  mutations: {
    auth(state, payload) {
      state.auth = payload;
    },
    user(state, payload) {
      state.id = payload
    },
    logout(state, payload) {
      state.auth = payload;
    },
    
  },
  actions: {
    async login({ commit }, { email, password }) {
      const responseLogin = await axios.post(
        "https://still-coast-90539.herokuapp.com/api/login",
        {
          email: email,
          password: password,
        }
      );
      console.log(responseLogin);
      commit("auth", responseLogin.data.auth);
      commit("user", responseLogin.data.id);
      router.replace("/")
    },
    logout({ commit }) {
      axios
        .post("https://still-coast-90539.herokuapp.com/api/logout", {
          auth: this.state.auth,
        })
        .then((response) => {
          console.log(response);
          commit("logout", response.data.auth);
          router.replace("/");
        })
        .catch((error) => {
          console.log(error);
        });
    },
    
  },
  modules: {
  },
  
 
});
