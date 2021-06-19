<template>
  <header>
    <div class="left">
      <div class="hamburger" @click="hamburger()" :class="{'active':isClass}">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <transition name="modal">
      <div id="overlay" @click.self="close" v-if="isClass">
      <nav class="menu" id="menu" v-if="isClass" >
        <ul class="menu-content">
          <li v-for="menu in menus" :key="menu.id" @click="isClass = false"><router-link :to="menu.href">
            {{ menu.title }}
          </router-link></li>
          <li>
            <a @click="logout()">ログアウト</a>
          </li>
        </ul>
      </nav>
      </div>
      </transition>
      <div class="header-logo">
        <h1>Rese</h1>
      </div>
    </div>
    <div class="center">
      <h2 v-if="gotAuth()">ログインしています</h2>
      <div class="unLog" v-else>
        <h2>ログインしていません</h2>
        <div class="wrap">
          <p>会員登録がお済みでない方</p>
          <button class="btn1" @click="$router.push({ name: 'Register' })">会員登録</button>
          <p>会員登録済みの方</p>
          <button class="btn2" @click="$router.push({ name: 'Login' })">ログイン</button>
        </div>
      </div>
    </div>
  </header>
</template>
<script>

export default {
  data() {
    return {
      isClass: false,
      menus:[
        { public: true, href:'/', title: 'ホーム(店舗一覧)'},
        {public: true, href:'/mypage', title: 'マイページ(ログイン後使用可)'},
        {public: true, href:'/register', title: '会員登録'},
        {public: true, href:'/login', title: 'ログイン'},
      ]
    };
  },
  
  methods: {
    hamburger() {
      this.isClass = !this.isClass;
    },
    logout() {
      this.$store.dispatch("logout",{
        auth: this.$store.state.auth
      });
      this.isClass = false;
      alert('ログアウトしました')
    },
    close() {
      this.isClass = false;
    },
  },
  computed: {
    gotAuth() {
      return function() {
        if (this.$store.state.auth == true) {
          return true
        } else {
          return false
        }
      }
    }
  }
}
</script>

<style scoped>
header {
  display: flex;
}
.left {
  display: flex;
}
.hamburger {
  margin: 40px 8px 0 100px;
  width: 35px;
  height: 35px;
  background-color: rgb(35, 92, 246);
  position: relative;
  border-radius: 3px;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
}
.hamburger span {
  left: 5px;
  display: block;
  height: 1px;
  position: absolute;
  background-color: white;
}
.hamburger span:nth-of-type(1) {
  top: 8px;
  width: 15px;
  transition: 0.3s;
}
.hamburger span:nth-of-type(2) {
  top: 16.5px;
  width: 25px;
  transition: 0.3s;
}
.hamburger span:nth-of-type(3) {
  top: 25px;
  width: 7px;
  transition: 0.3s;
}
/* ハンバーガーメニュー開いた時 */
.hamburger.active span:nth-of-type(1) {
  top: 16.5px;
  width: 25px;
  transition: 0.3s;
  transform: rotate(45deg);
}
.hamburger.active span:nth-of-type(2) {
  top: 16.5px;
  width: 25px;
  opacity: 0;
  transition: 0.3s;
}
.hamburger.active span:nth-of-type(3) {
  top: 16.5px;
  width: 25px;
  transition: 0.3s;
  transform: rotate(-45deg);
}
.menu {
  display: block;
  text-align: center;
  width: 280px;
  top: 75px;
  left: 100px;
  background: #fff;
  color: #333333;
  border-radius: 8px;
  box-shadow: 8px 8px 7px rgba(38, 98, 213, 0.3);
  position: fixed;
  transition: all 0.5s ease;
}
.menu-content li {
  text-align: left;
}
.menu-content li a {
  color: #333333;
  margin: 15px;
  padding: 5px;
  border-bottom: 0.5px solid #2662d5;
  text-decoration: none;
  display: block;
  cursor: pointer;
}
.center {
  margin-left: 25%;
  margin-top: 60px;
  margin-bottom: 60px;
}
.unLog {
  line-height: 1.3rem;
}
.wrap {
  display: flex;
  margin-bottom: 30px;
}
.wrap button {
  margin-right: 1rem;
  border-style: none;
  border-radius: 4px;
  padding: 5px 10px;
  margin-top: -5px;
}
.btn1 {
  color: #2662d5;
  background-color: #fff;
  
}
.btn2 {
  color: #fff;
  background-color: #2662d5;
}
/* modal */
.modal-enter,
.modal-leave-active {
  opacity: 0;
}
#overlay {
  z-index: 3;
  position:fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(77, 132, 250, 0.3);
  transition: all 0.5s ease;
}

/* header-logo */
.header-logo {
  margin: 40px 0;
  color: rgb(35, 92, 246);
  font-size: 35px;
}
/* レスポンシブ */
@media screen and (max-width: 768px) {
  .hamburger {
    margin: 30px 0 30px 60px;
  }
  .menu {
    top: 65px;
    left: 60px;
  }
  .header-logo {
    margin: 30px 5px;
  }
  .center {
    margin-left: 5%;
  }
  .wrap button {
    margin-left: 5px;
  }
}
@media screen and (max-width: 480px) {
  header {
    display: block;
  }
  .hamburger {
    margin: 20px 0 20px 30px;
  }
  .menu {
    top: 55px;
    left: 30px;
  }
  .header-logo {
    margin: 20px 5px;
  }
  .center {
    margin-left: 5%;
  }
  .wrap {
    display: block;
    margin-left: 20px;
  }
  .wrap button {
    margin-left: 65%;
    margin-top: 5px;
    margin-bottom: 30px;
  }
}
</style>