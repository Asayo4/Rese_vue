<template>
  <div id="review">
    <div class="title-wrap">
      <h1 class="name" v-if="gotName()">{{ user_name }}さん</h1>
      <h1 class="name" v-else>ゲストさん</h1>
      <div class="title">
        <h1 @click="$router.push({ name: 'Detail', params: {id: $route.params.id} })">{{ shop_name }}</h1>
        <p>のレビュー</p>
        <div class="wrapStar">
          <span class="numStar">★</span>
          <p>{{ star_num(lists) }}</p>
        </div>
      </div>
    </div>
    <div class="wrap-collomun">
      <div class="left">
        <Img :url="url"/>
        <div class="tags">
          <p>#{{ area_name }}</p>
          <p>#{{ genre_name }}</p>
        </div>
        <p class="detail">{{ detail }}</p>
      </div>
      <div class="right">
        <div class="panels" v-if="gotReview">
          <div class="panel" v-for="list in lists" :key="list.id">
            <div class="panel-content">
              <div class="nickname">{{ list.user.nickname }}さん</div>
              <div class="num-of-star">
                <p class="star">★</p>
                <p class="starDsc">{{ list.num_of_stars }}</p>
              </div>
              <div class="review-content">
                <p>{{ list.review_content }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="nonReview" v-else>
          <p>まだレビューはありません。</p>
        </div>
      </div>
    </div>
    <div class="under">
      <div class="recommend">
        <p>レビューを投稿してくださる方はこちらから。</p>
        <p>※ログイン後にご投稿いただけます</p>
        <button @click="activate">{{ shop_name }}のレビューをする</button>
      </div>
      <div class="popup" v-show="isActive">
        <ValidationObserver ref="observer">
        <form @submit.prevent="Submit">
          <div>
            <div class="flat-title">
              <p class="review-title">ニックネーム</p>
            </div>
            <p class="attention">※このニックネームはレビュー内容とともに公開されます。</p>
            <div>
              <div class="nick-name">
                <p>{{ nickname }}さん</p>
              </div>
            </div>
            <div class="flat-title">
              <p class="review-title">評価</p>
              <p class="require">*</p>
            </div>
             <p class="attention">※5段階で総合的なおすすめ度をお示しください。</p>
             <ValidationProvider rules="required" v-slot="{ errors }">
            <div class="evaluation">
               <input id="star1" type="radio" name="star" value="5" v-model="num_of_stars" />
                <label for="star1"><span class="text">良い</span>★</label>
                <input id="star2" type="radio" name="star" value="4" v-model="num_of_stars" />
                <label for="star2"><span class="text"></span>★</label>
                <input id="star3" type="radio" name="star" value="3" v-model="num_of_stars" />
                <label for="star3"><span class="text"></span>★</label>
                <input id="star4" type="radio" name="star" value="2" v-model="num_of_stars" />
                <label for="star4"><span class="text"></span>★</label>
                <input id="star5" type="radio" name="star" value="1" v-model="num_of_stars" />
                <label for="star5"><span class="text">悪い</span>★</label>
              </div>
              <p>{{ errors[0] }}</p>
             </ValidationProvider>
            </div>
            <div>
              <div class="flat-title">
                <p class="review-title">レビューコメント</p>
                <p class="require">*</p>
               </div>
              <p class="attention">※255文字以内にてお願いいたします。</p>
              <ValidationProvider name="コメント" rules="required|min:1|max:255" v-slot="{ errors }">
              <textarea class="textarea" v-model="text"></textarea>
              <p>{{ errors[0] }}</p>
              </ValidationProvider>
            </div>
            <p class="attention">※アスタリスク(*)のついている項目は必須項目です。</p>
            <input class="send-review" type="submit"/>
          </form>
        </ValidationObserver>
          <button class="cancel-review" @click="unActivate">キャンセル</button>
        </div>
      </div>
  </div>
</template>

<script>
import Img from '../components/Img.vue'
import axios from 'axios'
import {  extend, localize, ValidationProvider, ValidationObserver } from 'vee-validate';
import ja from 'vee-validate/dist/locale/ja.json'
import * as rules from 'vee-validate/dist/rules'
import Vue from 'vue'

  for (let rule in rules) {
    extend(rule, rules[rule])
  }

localize('ja', ja);

Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)

export default {
  data() {
    return{
      lists: [],
      shop_name: "",
      area_name: "",
      genre_name: "",
      detail: "",
      url: "",
      user_name: "",
      isActive: false,
      text: "",
      num_of_stars: "",
      gotReview: [],
      nickname: ""
    }
  },
  components: {
    Img,
  },
  async created() {
    const item = await axios.get(`https://still-coast-90539.herokuapp.com/api/shops/${this.$route.params.id}`);
    const shopData = item.data.data;
    for (let key in shopData)
    {this.shop_name = shopData[key].shop_name;
    this.area_name = shopData[key].area.area_name;
    this.genre_name = shopData[key].genre.genre_name;
    this.detail = shopData[key].detail;
    this.url = shopData[key].url}
    
    const user = await axios.get(`https://still-coast-90539.herokuapp.com/api/users/${this.$store.state.id}`)
    const userData = user.data.data
    console.log(userData);
    this.user_name = userData.user_name;
    this.nickname = userData.nickname;

    
    /* const today = new Date();
    today.setDate(today.getDate());
    const yyyy = today.getFullYear();
    const mm = ("0"+(today.getMonth()+1)).slice(-2);
    const dd = ("0"+today.getDate()).slice(-2);
    document.getElementById("today").min = yyyy+'-'+mm+'-'+dd; */
    

    const review = await axios.get(`https://still-coast-90539.herokuapp.com/api/reviews/shop?shop_id=${this.$route.params.id}`)
    this.lists = review.data.data;
    console.log(this.lists)
    if (this.lists.length !== 0) {
      this.gotReview = true;
    } else {
      this.gotReview = false;
    }
    
  },
  methods: {
    activate() {
      this.isActive = true;
    },
    unActivate() {
      this.isActive = false;
    },
    async Submit() {
      if (!this.$store.state.auth) {
        alert('レビューはログイン後にお願いいたします');
        return false;
      } else {
        await axios.post("https://still-coast-90539.herokuapp.com/api/reviews", {
          shop_id: this.$route.params.id,
          user_id: this.$store.state.id,
          review_content: this.text,
          num_of_stars: this.num_of_stars,
        })
        .then((res) => {
          console.log(res);
          alert('レビューしていただき誠にありがとうございます。');
          location.reload();
        })
      }
    },
  },
  computed: {
    star_num() {
      return function(lists)
      {
          if (lists.length !== 0)
          {const reviewSum = lists.reduce(function(acc,curr) {
            return acc + curr.num_of_stars
          },0)
          console.log(reviewSum)
          const reviewAvr = reviewSum / this.lists.length;
          return reviewAvr.toFixed(1)
          // ↑toFixed(1)で小数点第2位以下を四捨五入 
          }
      }
    },
    gotName() {
      return function()
      {
        if (this.$store.state.auth == true) {
          return true
        } else {
          return false
        }
      }
    }
  },
}
</script>

<style scoped>
.name {
  margin: 0 0 0 85%;
}
.title {
  margin-left: 5%;
  display: flex;
  margin-bottom: 20px;
}
.title h1 {
  font-size: 1.5rem;
  color: rgb(11, 11, 223);
  border-bottom: 5px solid royalblue;
  border-top: solid 5px royalblue;
  padding: 0 5px;
  cursor: pointer;
}
.title p {
  margin-top: 0.5rem;
}
.wrapStar {
  display: flex;
  margin-left: 20px;
}
.numStar {
  color: #ffcc00;
  font-size: 1.2rem;
  margin-top: 0.2rem;
}
.wrap-collomun {
  display: flex;
}
.left {
  width: 30%;
  margin-left: 5%;
}
.tags {
  display: flex;
  margin: 5px;
}
.detail {
  width: 90%;
  line-height: 1.5rem;
}
/* review-panel */
.right {
  display: flex;
  overflow: scroll;
  width: 55%;
  margin-left: 30px;
}
.panels {
  display: flex;
  overflow: scroll;
  margin: 30px 0;
}
.panel-content {
  width: 250px;
  height: 200px;
  background-color: #fff;
  border-radius: 8px;
  margin:  0 10px 0 10px;
  padding: 20px;
  box-shadow: 5px 5px 6px slategrey;
  overflow: scroll;
}
.nickname {
  padding: 20px;
}
.num-of-star {
  display: flex;
  padding: 0 0 20px 20px;
}
.star {
  font-size: 1.2rem;
  color: #ffcc00;
}
.starDsc {
  margin-top: 0.2rem;
  margin-left: 5px;
}
.review-content {
  width: 80%;
  margin-left: 10%;
  line-height: 1.4rem;
}
.under {
  margin-left: 35%;
  margin-top: -10px;
  background-color: ghostwhite;
  width: 350px;
  height: 120px;
  border-radius: 8px;
  box-shadow: 5px 5px 6px gray;
}
.recommend  {
  padding: 15px;
  margin-bottom: 30px;
}
.recommend p {
  font-size: 0.9rem;
  text-align: center;
  line-height: 1.2rem;
}
.recommend button {
  border-style: none;
  color: #fff;
  background-color: rgb(0, 0, 253);
  border-radius: 5px;
  padding: 5px 10px;
  margin: 10px 80px;
  cursor: pointer;
}
.popup {
  position: absolute;
  width: 350px;
  top: 35px;
  height: 657px;
  background-color: floralwhite;
  border-radius: 8px;
  box-shadow: 5px 5px 6px gray;
}
.flat-title {
  display: flex;
}
.review-title {
  font-size: 1.1rem;
  margin-left: 20px;
  margin-top: 20px;
}
.require {
  font-size: 1.1rem;
  color: crimson;
  margin-top: 20px;
}
.attention {
  font-size: 0.9rem;
  width: 280px;
  margin: 10px calc((100% - 280px) / 2);
  line-height: 1.2rem;
}
.inputNickname {
  margin-left: 18px;
  width: 310px;
}
.nick-name {
  margin: 30px;
  text-align: center;
}

/* 星で評価 */
.evaluation {
  display: flex;
  flex-direction: row-reverse;
  justify-content: center;
  margin: 10px 0;
}
.evaluation input[type='radio']{
  display: none;
}
.evaluation label{
  position: relative;
  padding: 10px 10px 0;
  color: darkgray ;
  cursor: pointer;
  font-size: 1.5rem;
}
.evaluation label .text{
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  text-align: center;
  font-size: 12px;
  color: gray;
}
.evaluation label:hover,
.evaluation label:hover ~ label,
.evaluation input[type='radio']:checked ~ label{
  color: #ffcc00;
}
.textarea {
  width: 310px;
  height: 80px;
  margin: 18px;
}
.send-review {
  border-style: none;
  color: #fff;
  background-color: rgb(0, 0, 253);
  height: 50px;
  width: 350px;
  cursor: pointer;
}
.cancel-review {
  border-style: none;
  color: #fff;
  background-color: darkcyan;
  height: 50px;
  width: 350px;
  border-radius: 0 0 8px 8px;
  cursor: pointer;
  margin-bottom: 30px;
}
@media screen and (max-width: 768px) {
  .name {
    margin: 0 0 0 70%;
  }
  .wrap-collomun {
    display: block;
  }
  .left {
    width: 80%;
    margin: 10px 12.5%;
  }
  .right {
    width: 90%;
    display: flex;
    margin-left: 5%;
    height: 200px;
  }
  .panel-content {
    height: 90px;
  }
  .nonReview {
    background-color: aliceblue;
    height: 50px;
    line-height: 50px;
    text-align: center;
    justify-content: center;
    margin-top: 110px;
  }
  .under {
    margin-left: calc((100% - 350px) / 2);
  }
  .popup {
    position: static;
    margin-top: -30px;
  }
}
@media screen and (max-width: 480px) {
  .name {
    margin-left: 45%;
  }
  .right {
    display: block;
    height: 180px;
    margin-bottom: 30px;
  }
  .panel-content {
    width: 240px;
    margin: 0;
    margin-left: calc((90% - 246px) / 2);
    margin-right: 10px;
    margin-bottom: 15px;
  }
  .nickname {
    padding: 10px;
  }
  .under {
    width: 300px;
    margin-left: calc((100% - 300px) / 2);
    margin-top: 0;
    height: 170px;
  }
  .recommend {
    margin-bottom: 50px;
  }
  .recommend button {
    align-content: center;
  }
  .popup {
    width: 300px;
    margin-left: calc((100% - 300px) / 2);
  }
  .inputNickname {
    width: 200px;
    margin-left: calc((100% - 200px) / 2);
  }
  .textarea {
    width: 200px;
    margin-left: calc((100% - 200px) / 2);
  }
  .send-review {
    width: 300px;
    margin-left: calc((100% - 300px) / 2);
  }
  .cancel-review {
    width: 300px;
    margin-left: calc((100% - 300px) / 2);
    margin-bottom: 20px;
  }
}
</style>