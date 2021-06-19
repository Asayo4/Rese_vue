<template>
  <div class="about">
    <div class="leftColumn">  
      <div class="shopName">
        <img  class="return" src="../assets/矢印形1.png" @click="returnToShops"/>
        <div class="nameOfShop">
          <div class="shop-name">
            <p>{{ shop_name }}</p>
          </div>
          <div class="stars">
            <p class="star">★</p>
            <p>{{ stars(shopRev) }}</p>
          </div>
        </div>
      </div>
      <div class="goToRev">
        <a class="goReview" @click="$router.push({ name: 'Review', params: {id: $route.params.id } })">レビューを見る/書く</a>
      </div>
      <div class="img">
        <Img :url="url" />
      </div>
      <div class="tags">
        <p>#{{ area_name }}</p>
        <p>#{{ genre_name }}</p>
      </div> 
      <p class="detail">{{ detail }}</p>
    </div>
    <div class="rightColumn">
      <ValidationObserver ref="observer" >
      <form @submit.prevent="Submit" >
          <h1 class="title">予約</h1>
          <div class="reservationInfo">
            <ValidationProvider name="ご予約日" rules="required" v-slot="{ errors }">
            <div class="reservationDate">
              <input type="date" class="date" v-model="date" name="today" id="today" :min="this_day" @input="inputDay" >
            </div>
            <span>{{ errors[0] }}</span>
            </ValidationProvider>
            <ValidationProvider name="ご予約時刻" rules="required" v-slot="{ errors }">
            <div class="time">
              <input type="time" id="time" v-model="time" step="1800" max="20:30" name="time" :min="minTime" >
              <span class="descTime">※ご予約は30分おきとなっております</span>
            </div>
            <p class="hiddenDesc">※ご予約は30分おきとなっております</p>
            <span>{{ errors[0] }}</span>
            </ValidationProvider>
            <ValidationProvider name="ご利用人数" rules="required" v-slot="{ errors }">
            <div class="reservationMember">
              <select  class="numOfUsers" v-model="num_of_users" @change="onSelect">
                <option selected disabled value="">ご利用人数</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
              <p>名様</p>
            </div>
            <span>{{ errors[0] }}</span>
            </ValidationProvider>
          </div>
        <div class="shopInfo">
          <div class="labelOfInfo">
            <p>Shop</p>
            <p>Date</p>
            <p>Time</p>
            <p>Number</p>
          </div>      
          <div class="contentsOfInfo">
            <p>{{ shop_name }}</p>
            <p>{{ date }}</p>
            <p>{{ time }}</p>
            <div class="wrapNumber">
              <p>{{ num_of_users }}</p>
              <p v-if="isActive"></p>
              <p v-else>名様</p>
            </div>
          </div>
        </div>
        <button class="Reservate" type="submit" name="submit" >予約する</button>
      </form>
      </ValidationObserver>
    </div>
  </div>
</template>

<script>
import axios from "axios"
import Img from "../components/Img"
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
  components: {
    Img
  },
  props:{
    
  },
  data() {
    return {
      shop_name: "",
      area_name: "",
      genre_name: "",
      date: "",
      time: "",
      genre_id:"",
      detail:"",
      isActive: true,
      url:"",
      num_of_users:"",
      shopRev: "",
      this_day: "",
      minTime: "",
    }
  },
  async created() {
    const item = await axios.get(`https://still-coast-90539.herokuapp.com/api/shops/${this.$route.params.id}`);
    const shopData = item.data.data;
    console.log(shopData)
    for (let key in shopData)
    {this.shop_name = shopData[key].shop_name;
    this.area_name = shopData[key].area.area_name;
    this.genre_name = shopData[key].genre.genre_name;
    this.detail = shopData[key].detail;
    this.genre_id = shopData[key].genre_id;
    this.url = shopData[key].url
    this.shopRev = shopData[key].reviews;}

    //今日の日付を取得
    const today = new Date();
    today.setDate(today.getDate());
    const yyyy = today.getFullYear();
    const mm = ("0"+(today.getMonth()+1)).slice(-2);
    const dd = ("0"+today.getDate()).slice(-2);
    const thisDay = yyyy+'-'+mm+'-'+dd;
    this.this_day = thisDay;
    console.log(this.this_day)

    //翌日を取得
    const nextDay = new Date();
    nextDay.setDate(nextDay.getDate());
    const yyyy1 = nextDay.getFullYear();
    const mm1 = ("0"+(nextDay.getMonth()+1)).slice(-2);
    const dd1 = ("0"+(nextDay.getDate()+1)).slice(-2);
    const nextday = "'"+yyyy1+'-'+mm1+'-'+dd1+"'";
    console.log(nextday)


    //現在時刻を取得
    const now = new Date();
    now.setDate(now.getDate());
    const hour = now.getHours();
    const minute = now.getMinutes();
    const sec = now.getSeconds();
    const millsec = now.getMilliseconds();
    const justNow = yyyy+'-'+mm+'-'+dd+' '+hour+':'+minute+':'+sec+':'+millsec;
    const justTime = hour+':'+minute;
    console.log(justNow)
    console.log(justTime)

    
    
    

  },
  methods: {
    onSelect() {
      this.isActive = !this.isActive;
    },
    
    async Submit() {
      if (!this.$store.state.auth) {
        alert('ご予約はログイン後にご利用いただけます');
        return false;
      } else 
      {
        await axios.post("https://still-coast-90539.herokuapp.com/api/reservations", {
        date: this.date,
        time: this.time,
        num_of_users: this.num_of_users,
        user_id: this.$store.state.id,
        shop_id: this.$route.params.id
      })
      .then(res => {
        console.log(res);
      })
      this.$router.push({ name: 'Done' })
      }
      
    },
    returnToShops() {
      this.$router.push({ name: 'Shops' })
    },
    inputDay() {
      //今日ならば現在時刻より後、それ以外は10:00以降、20:30以降は最短日時は明日10:00以降
    console.log(this.date);
    console.log(this.this_day)
    let resrveDay = new Date(this.date);
    let toDay = new Date(this.this_day);
    
    if (resrveDay.getTime() > toDay.getTime()){
      this.minTime = "10:00"
    } 
    else /* if (resrveDay.getTime() === toDay.getTime()) */ {
      const now = new Date();
      now.setDate(now.getDate());
      const hour = now.getHours();
      const minute = now.getMinutes();
      //console.log(minute)
      if (hour < 10) {
      this.minTime = "10:00"
      } 
      else if (hour >= 20 && minute >= 30) {
      this.this_day = this.nextday
      }
      else if (0 <= minute && minute <= 29)
      {
        const MinTime = hour+':'+'30';
        this.minTime = MinTime;
        //console.log(this.minTime)
      } 
      else if (30 <= minute && minute <= 59){
        const MiniTime = (hour+1)+':'+'00';
        this.minTime = MiniTime;
        //console.log(this.minTime);
      }
    }
    },
  },
  computed: {    
    stars() {
      return function(reviews)
      {
          if (reviews.length !== 0)
          {const reviewSum = reviews.reduce(function(acc,curr) {
            return acc + curr.num_of_stars
          },0)
          console.log(reviewSum)
          const reviewAvr = reviewSum / reviews.length;
          return reviewAvr.toFixed(1)
          // ↑toFixed(1)で小数点第2位以下を四捨五入 
          }
      }
    },
    /* changed(){
      return function(date)
      {
        console.log(date)
        if (date == this.this_day) {
      this.minTime = this.justNow;
      } else {
      this.minTime = "10:00"
      }}
    } */
  },
   
};
</script>

<style scoped>
.about {
  display: flex;
  width: 100%;
}
.leftColumn {
  width: 40%;
  height: 80%;
  margin-left: 7%;
  margin-top: -2%;
}
.shopName {
  display: flex;
}
.return {
  width: 30px;
  height: 30px;
  border-radius: 5px;
  background: #fff;
  display: block;
  box-shadow: 2px 2px 3px rgb(134, 134, 134);
}
.return:before {
  content: "";
  display: inline-block;
  width: 30px;
  height: 30px;
  border-radius: 5px;
  background: url("../assets/矢印形1.png") no-repeat;
  background-size: contain;
  vertical-align: middle;
}
.nameOfShop {
  font-size: 25px;
  margin-left: 10px;
  margin-top: 3px;
  display: flex;
}
.shop-name {
  width: calc((1024px / 3) - 8rem);
}
.stars {
  display: flex;
  margin-left: 50px;
  margin-top: 0.3rem;
  font-size: 1.2rem;
  letter-spacing: 0.2rem;
}
.star {
  color: #ffcc00;
  font-size: 1.5rem;
  margin-top: -0.3rem;
}
.goToRev {
  margin-top: 20px;
  margin-left: 50%;
}
.goReview {
  border-style: none;
  color: #fff;
  background-color: rgb(35, 92, 246);
  border-radius: 5px;
  box-shadow: 3px 3px 5px slategray;
  font-size: 1rem;
  padding: 4px 8px;
  cursor: pointer;
}
.img {
  margin-top: 5%;
}
.tags{
  display: flex;
  margin: 20px 0;
  letter-spacing: 1px;
  font-size: 0.9rem;
}
.detail {
  line-height: 1.5rem;
  font-size: 0.9rem;
}
.rightColumn {
  background: rgb(35, 92, 246);
  width: 40%;
  height: 580px;
  margin-top: -5%;
  margin-left: 5%;
  color: #fff;
  border-radius: 8px;
  box-shadow: 3px 3px 4px rgb(134, 134, 134);
  position: relative;
}
.title {
  font-size: 1.5rem;
  letter-spacing: 2px;
  margin: 5%;
}
.reservationInfo {
  margin-left: 5%;
}
.date {
  height: 25px;
  width: 150px;
  border-radius: 5px;
  border-style: none;
}
.time {
  height: 25px;
  margin-top: 2%;
}
.descTime {
  font-size: 0.7rem;
}
.hiddenDesc {
  display: none;
}
.reservationMember {
  display: flex;
}
.numOfUsers {
  height: 25px;
  margin-top: 2%;
  border-radius: 5px;
}
.reservationMember p {
  height: 25px;
  margin-top: 16px;
}
.shopInfo {
  width: 80%;
  height: 200px;
  background: rgb(79, 123, 243);
  border-radius: 5px;
  margin-top: 30px;
  margin-left: 5%;
  display: flex;
}
.labelOfInfo {
  margin: 5%;
  line-height: 2.5rem;
}
.contentsOfInfo {
  margin: 5% 8%;
  line-height: 2.5rem;
}
.wrapNumber {
  display: flex;
}
.Reservate {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 50px;
  border-radius: 0 0 8px 8px;
  background: rgb(10, 14, 241);
  border-style: none;
  color: #fff;
  cursor: pointer;
}

@media screen and (max-width: 768px) {
  .shop-name {
    width: 10rem;
  }
  .goToRev {
    margin-left: 30%;
  }
  .goReview {
    position: static;
    margin-top: 3rem;
  }
  .rightColumn {
    height: 500px;
  }
}
@media screen and (max-width:480px) {
  .about {
    display: block;
  }
  .leftColumn {
    width: 80%;
    margin-left: 10%;
  }
  .nameOfShop {
    display: block;
  }
  .stars {
    margin-left: 100%;
  }
  .goToRev{
    margin-left: 40%;
  }
  .goReview {
    margin-top: 5rem;
  }
  .rightColumn {
    margin-top: 5%;
    width: 80%;
    margin-left: 10%;
    margin-bottom: 30px;
  }
  .title {
    font-size: 1.4rem;
    padding: 1rem 0;
  }
  .shopInfo {
    width: 90%;
  }
  .descTime {
    display: none;
  }
  .hiddenDesc {
    display: block;
    line-height: 1rem;
    font-size: 0.7rem;
  }
}
</style>