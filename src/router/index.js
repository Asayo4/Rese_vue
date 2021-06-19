import Vue from 'vue'
import VueRouter from 'vue-router'
import Shops from '../views/Shops.vue'
import Registration from '../views/Registration.vue'
import Thanks from '../views/Thanks.vue'
import Login from '../views/Login.vue'
import Mypage from '../views/Mypage.vue'
import ShopsDetail from '../views/ShopsDetail.vue'
import ReservationComp from '../views/ReservationComp.vue'
import NotFound from '../views/NotFound.vue'
import Review from '../views/Review.vue'
import store from '../store/index'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Shops',
    component: Shops,
    meta: {
      title: 'ホーム',
      desc: '店舗一覧'
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Registration,
    meta: {
      title: '会員登録',
      desc: '会員登録'
    }
  },
  {
    path: '/thanks',
    name: 'Thanks',
    component: Thanks,
    meta: {
      title: 'ご登録ありがとうございます',
      desc: 'ご登録ありがとうございます'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: 'ログイン',
      desc: 'ログイン'
    }
  },
  {
    path: '/mypage',
    name: 'Mypage',
    component: Mypage,
    meta: {
      title: 'マイページ',
      desc: 'マイページ',
      requiresAuth: true,
    }
  },
  {
    path: '/detail/:id',
    name: 'Detail',
    component: ShopsDetail,
    meta: {
      title: '店舗詳細',
      desc: '店舗詳細'
    }
  },
  {
    path: '/done',
    name: 'Done',
    component: ReservationComp,
    meta: {
      title: '予約完了',
      desc: '予約完了'
    }
  },
  {
    path: '/review/:id',
    name: 'Review',
    component: Review,
    meta: {
      title: 'レビュー',
      desc: 'レビュー'
    }
  },
  {
    path: '/*',
    name: 'NotFound',
    component: NotFound,
    meta: {
      title: 'お探しのページは見つかりませんでした',
      desc: 'お探しのページは見つかりませんでした'
    }
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (
    to.matched.some((record) => record.meta.requiresAuth) &&
    !store.state.auth
  ) {
    next({
      path: "/",
      query: {
        redirect: to.fullPath,
      },
    });
  } else {
    next();
  }
});

export default router
