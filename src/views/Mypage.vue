<template>
  <div class="mypage">
    <h1 class="name">{{ user_name }}さん</h1>
    <div class="wrap-column">
      <div class="left-column">
        <h1 class="title">予約状況</h1>
        <p class="desc">ご予約が複数ある場合、横にスクロールが可能です。<br>※ご予約日を過ぎるとオレンジ色になります。</p>
        <div class="wrap-reservation-card" v-if="gotReserve">
          <div class="reservation-card" v-for="(reservation,index) in reservations" :key="reservation.item.id" >
            <div class="reservation" :class="{'outOfRes':outRes.includes(reservation.item.id)}">
              <div class="clockAndNumber">
                <img class="clock" src="../assets/clock1.png" />
                <p class="reservationNumber">予約{{ index + 1 }}</p>
                <img class="cross" src="../assets/バツ1.png" @click="del(reservation)" />
              </div>
              <div class="reservationInfo">
                <div class="reservation-label">
                  <p>Shop</p>
                  <p>Date</p>
                  <p>Time</p>
                  <p>Number</p>
                </div>
                <div class="reservation-contents">
                  <p>{{ reservation.item.shop.shop_name }}</p>
                  <p>{{ reservation.item.date }}</p>
                  <p>{{ reservation.item.time }}</p>
                  <div class="Numbers">
                    <p>{{ reservation.item.num_of_users }}</p>
                    <span>名様</span>
                  </div>
                  <div class="update">
                    <input class="updateBtn" type="button" :v-model="index" @click="changeRes(reservation.item.id)" :value="`予約${ index + 1 }を変更する`"/>
                  </div>
                </div>
              </div>
            </div>
              <div class="changeReservation" :class="{ 'clickedRes':activeRes.includes(reservation.item.id)}" >
                <ValidationObserver ref="observer" >
                  <form @submit.prevent="Submit(reservation)" >
                    <h1 class="changeTitle">予約更新</h1>
                    <div class="changeReservationInfo">
                      <ValidationProvider name="ご予約日" rules="required" v-slot="{ errors }">
                        <div class="reservationDate">
                          <input type="date" class="date" v-model="date" name="today" id="today" :min="this_day" @input="inputDay" >
                        </div>
                        <span>{{ errors[0] }}</span>
                      </ValidationProvider>
                      <ValidationProvider name="ご予約時刻" rules="required" v-slot="{ errors }">
                        <div class="time">
                          <input type="time" id="time" v-model="time" step="1800" :min="minTime" max="20:30" name="time" >
                          <span class="descTime">※ご予約は30分おきとなっております</span>
                        </div>
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
                        <p>{{ reservation.item.shop.shop_name }}</p>
                          <p>{{ date }}</p>
                          <p>{{ time }}</p>
                          <div class="wrapNumber">
                            <p>{{ num_of_users }}</p>
                            <p v-if="isChange"></p>
                            <p v-else>名様</p>
                          </div>
                        </div>
                      </div>
                      <input class="Reservate" type="submit" name="submit" value="予約を更新する"/>
                    </form>
              </ValidationObserver>
              <button class="noChange" @click="noChange">予約更新をキャンセル</button>     
            </div>     
          </div>
        </div>
        <div class="disabled" v-else>
          <p>ご予約はまだありません。</p>
        </div>
      </div>
      <div class="right-column">
        <h1>お気に入り店舗</h1>
        <p class="desc2">お気に入りが複数ある場合、横にスクロールが可能です。</p>
        <div class="panels" v-if="gotLike" >
          <div class="panel" v-for="like in likes" :key="like.id" >
            <div class="panelImg">
              <PanelImg :url="like.shops[0].url" />
            </div>
            <div class="panel-content">
              <h1 class="panel-title">{{ like.shops[0].shop_name }}</h1>
              <div class="tags">
                <p class="area-tags">#{{ like.shops[0].area.area_name }}</p>
                <p class="genre-tags">#{{ like.shops[0].genre.genre_name }}</p>
              </div>
            </div>
            <div class="flex">
              <div class="panel-link">
                <a @click="$router.push({ name: 'Detail', params: { id: like.shops[0].id } })">詳しくみる</a>
              </div>
              <div class="toggleImgs">
                <img class="likeBtn" v-if="!isLike" src="../assets/ハート灰.png" />
                <img v-else class="unlikeBtn" @click="clickUnLike(like)" src="../assets/ハート赤.png" />
              </div>
            </div>
          </div>
        </div>
        <div class="disabled" v-else>
          <p>お気に入りはまだありません。</p>
        </div>
      </div>
    </div>
    <div class="under">
      <p class="reviewTitle">{{ user_name }}さんが投稿したレビュー</p>
      <p class="descReview">レビューが複数ある場合、横にスクロールが可能です。</p>
      <div class="reviewPanels" v-if="gotReview">
        <div class="reviewPanel" v-for="list in lists" :key="list.item.id">
          <div class="R-panel-content">
            <div class="nick-shop">
              <p class="nickname">{{ nickname }}さん</p>
              <p class="shopname">{{ list.shop.shop_name }}</p>
            </div>
            <div class="num-of-star">
              <p class="star">★</p>
              <p class="starDsc">{{ list.item.num_of_stars }}</p>
            </div>
            <div >
              <p class="review-content">{{ list.item.review_content }}</p>
            </div>
            <input class="reviewBtn" type="button" @click="changeRev(list.item.id)" value='レビューを更新/削除する' />
          </div>
          <div class="changeReview" :class="{clickedRev: activeRev.includes(list.item.id)}">
            <ValidationObserver ref="observer" >
              <form @submit.prevent="SubReview(lists)">
               <div>
                 <p class="shopNameTitle">{{ list.shop.shop_name }}のレビュー</p>
                 <div class="flat-title">
                  <p class="review-title">ニックネーム</p>
                </div>
                <p class="attention">※ニックネームは変更できません。</p>
                <p class="revNick">{{ nickname }}さん</p>
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
                  <textarea class="textarea"  v-model="list.item.review_content"></textarea>
                  <p>{{ errors[0] }}</p>
                </ValidationProvider>
              </div>
              <p class="attention">※アスタリスク(*)のついている項目は必須項目です。</p>
              <input class="send-review" type="submit"/>
            </form>
            </ValidationObserver>
            <button class="delReview" @click="delReview(list)">レビューを削除する</button>
            <button class="noChangeReview" @click="noChangeReview">レビュー更新をキャンセル</button>
          </div>
        </div>
      </div>
      
      <div class="disabled" v-else>
        <p>まだレビューをしたことがありません。</p>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import PanelImg from '../components/PanelImg'

export default {
  components: {
    PanelImg
  },
  props:{
  },
  data() {
    return {
      likes: [],
      reservations: [],
      user_name: "",
      like:"",
      shop:"",
      date: "",
      time: "",
      num_of_users: "",
      isChange: true,
      value: "",
      gotLike: [],
      gotReserve: [],
      gotReview: [],
      lists: [],
      text: "",
      num_of_stars: "",
      nickname: "",
      minTime: "",
      activeRes: [],
      activeRev: [],
      key: "",
      this_day: "",
      outRes: [],
    }
  },
  beforeCreate() {
  },
  async created() {
    //user_name&nicknameを取り出す
    const user = await axios.get(`https://still-coast-90539.herokuapp.com/api/users/${this.$store.state.id}`)
    const userData = user.data.data
    console.log(userData);
    this.user_name = userData.user_name
    this.nickname = userData.nickname

    //reservationsテーブルからデータを取り出す
    const reservationShopData = await axios.get(`https://still-coast-90539.herokuapp.com/api/reservations?user_id=${this.$store.state.id}`) 
    this.reservations = reservationShopData.data.data;
    if (this.reservations.length !== 0) {
      this.gotReserve = true;
    } else {
      this.gotReserve = false;
    }


   
    //likesテーブルからデータを取り出す
    const likeShopData = await axios.get(`https://still-coast-90539.herokuapp.com/api/likes?user_id=${this.$store.state.id}`)  
    this.likes = likeShopData.data.data;
    console.log(this.likes);
    if (this.likes.length !== 0) {
      this.gotLike = true;
    } else {
      this.gotLike = false;
    }
    
    //今日の日付を取得
    const today = new Date();
    today.setDate(today.getDate());
    const yyyy = today.getFullYear();
    const mm = ("0"+(today.getMonth()+1)).slice(-2);
    const dd = ("0"+today.getDate()).slice(-2);
    const thisDay = yyyy+'-'+mm+'-'+dd;
    this.this_day = thisDay;
    console.log(this.this_day)

    //期限切れ予約のクラス名を変更するための炙り出し
    let reserveDate = [];
    for(let i in this.reservations)
    {
      reserveDate[i] = this.reservations[i].item;
      console.log(reserveDate)
      for (let index in reserveDate)
      {let ReserveDate = reserveDate[index].date;
      console.log(ReserveDate)
      if(ReserveDate < thisDay){
        this.outRes.push(reserveDate[index].id);
        console.log(this.outRes)
      }
      }
    }

    //自分がしたレビューを取り出す
     const review = await axios.get(`https://still-coast-90539.herokuapp.com/api/reviews?user_id=${this.$store.state.id}`)
    this.lists = review.data.data;
    console.log(this.lists)
    console.log(this.lists.length)
    if (this.lists.length !== 0) {
      this.gotReview = true;
    } else {
      this.gotReview = false;
    }
    const nextDay = new Date();
    nextDay.setDate(nextDay.getDate());
    const yyyy1 = nextDay.getFullYear();
    const mm1 = ("0"+(nextDay.getMonth()+1)).slice(-2);
    const dd1 = ("0"+(nextDay.getDate()+1)).slice(-2);
    const nextday = "'"+yyyy1+'-'+mm1+'-'+dd1+"'";
    console.log(nextday)
  },
  methods: {
    del(reservation) {
      if (confirm('予約を削除しますか？')) {
      axios.delete(`https://still-coast-90539.herokuapp.com/api/reservations/${reservation.item.id}`,{
        data: reservation.item
      })
      .then((res) => {
      console.log(res);
      alert('予約を削除しました')
      location.reload();
      })
      }
    },
    clickUnLike(like) {
      if (confirm('いいねを削除しますか？')) {
      axios.delete(`https://still-coast-90539.herokuapp.com/api/likes/${like.item.id}`, {
        data: like.item
      })
      .then((res) => {
        console.log(res);
        alert('いいねを削除しました')
        location.reload();
      })}
    },
    onSelect() {
      this.isChange = !this.isChange;
    },
    noChange() {
      location.reload();
    },
    async Submit(reservation) {
      if (confirm('予約を更新しますか？')) {
        await axios.put(`https://still-coast-90539.herokuapp.com/api/reservations/${reservation.item.id}`, {
          date: this.date,
          time: this.time,
          num_of_users: this.num_of_users,
          user_id: this.$store.state.id,
        })
        .then(res => {
          console.log(res);
          alert('正常に予約が更新されました')
          location.reload();
        })
      }
    },
    changeRes (key){
      this.activeRes.push(key)
      console.log(this.activeRes)
    },
    changeRev (key) {
      this.activeRev.push(key)
      console.log(this.activeRev)
    },
    async SubReview(list) {
      if (confirm('レビューを更新しますか？')) {
        await axios.put(`https://still-coast-90539.herokuapp.com/api/reviews/${list.item.id}`, {
          num_of_stars: this.num_of_stars,
          review_content: this.text,
          user_id: this.$store.state.id
        })
        .then((res) => {
          console.log(res);
          alert('正常にレビューが更新されました')
          location.reload;
        })
      }
    },
    noChangeReview() {
      location.reload();
    },
    delReview(list) {
      if (confirm('レビューを削除しますか？')) {
      axios.delete(`https://still-coast-90539.herokuapp.com/api/reviews/${list.item.id}`, {
        data: list
      })
      .then((res) => {
        console.log(res);
        alert('レビューを削除しました')
        location.reload();
      })}
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
    isLike() {
      let user_id = this.$store.state.id
      const result = this.likes.some(function (like) {
        console.log(like.item.user_id)
        //↓の「=」を、比較演算子の「===」に変更
       return like.item.user_id === user_id
      });
      //console.log(result)
      return result
    }, 
  },
  
}
</script>

<style scoped>
.name {
  position: relative;
  font-size: 1.7rem;
  margin-left: 55%;
  margin-bottom: 20px;
  margin-top: -40px;
}
.wrap-column {
  display: flex;
  width: 100%;
  height: 800px;
}
.left-column {
  margin-left: 8%;
  width: 40%;
  margin-right: 8%;
  position: relative;
}
.title {
  font-size: 1.3rem;
  padding-bottom: 30px;
}
.wrap-reservation-card {
  display: flex;
  overflow-x: scroll;
  height: 335px;
}
.wrap-reservation-card::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
.wrap-reservation-card::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background-color: rgb(167, 187, 241);
}
.wrap-reservation-card::-webkit-scrollbar-track {
  border-radius: 5px;
  background-color: rgba(167, 187, 241, 0.3)
}
.desc {
  margin-bottom: 5px;
}
.reservation-card {
  margin: 0 5px;
}
.reservation {
  color: #fff;
  background: rgb(35, 92, 246);
  width: 380px;
  height: 300px;
  border-radius: 8px;
  box-shadow: 3px 3px 5px slategray;
}
.outOfRes {
  color: aliceblue;
  background-color: tomato;
}
.clockAndNumber {
  display: flex;
  padding-top: 5%;
  margin-left: 5%;
}
.clock {
  width: 1.4rem;
}
.reservationNumber {
  margin-left: 5%;
  line-height: 1.3rem;
  font-size: 0.9rem;
}
.cross {
  width: 1.4rem;
  margin-left: auto;
  margin-right: 20px;
}
.reservationInfo {
  display: flex;
}
.reservation-label {
  margin: 5%;
  line-height: 2.5rem;
  padding-bottom: 5%;
}
.reservation-contents {
  margin: 5%;
  line-height: 2.5rem;
}
.Numbers {
  display: flex;
}
.right-column {
  width: 40%;
}
.right-column h1 {
  padding-bottom: 30px;
  font-size: 1.3rem;
}
.panels {
  display: flex;
  overflow-x: scroll;
}
.panels::-webkit-scrollbar{
  width: 10px;
  height: 10px;
}
.panels::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background-color: rgb(167, 187, 241);
}
.panels::-webkit-scrollbar-track {
  border-radius: 5px;
  background-color: rgba(167, 187, 241, 0.3)
}
.panel {
  width: 300px;
  background: #fff;
  border-radius: 5px;
  box-shadow: 4px 5px 5px #a3a3a3;
  margin: 10px 5px;
  height: 350px;
}
.panelImg{
  max-width: 100%;
  height: auto;
}
.panel-content{
  padding: 20px 0 5px 20px;
}
.panel-title{
  font-size: 1.5rem;
}
.tags {
  display: flex;
  margin-top: 10px;
}
.area-tags {
  font-size: 12px;
  margin-right: 10px;
}
.genre-tags {
  font-size: 12px;
}
.flex {
  display: flex;
  position: relative;
}
.panel-link {
  background: rgb(35, 92, 246);
  color: #fff;
  font-size: 14px;
  border-radius: 5px;
  text-align: center;
  margin-left: 5%;
  margin-bottom: 7%;
  padding: 10px 20px;
  cursor: pointer;
}
.likeBtn {
  width: 25px;
  height: 25px;
  margin-top: 2px;
  margin-left: 40%;
  display: block;
}
.unlikeBtn {
  width: 20px;
  height: 20px;
  margin-top: 2px;
  margin-left: 40%;
  display: block;
}
.updateBtn {
  margin-top: 30px;
  margin-left: -120px;
  width: 380px;
  height: 50px;
  border-radius: 0 0 8px 8px;
  background: rgb(10, 14, 241);
  border-style: none;
  color: #fff;
  cursor: pointer;
}
/* 予約更新 */
.changeReservation {
  background: rgb(167, 187, 241);
  width: 380px;
  height: 500px;
  margin-top: -25%;
  margin-left: 0;
  color: rgb(17, 54, 219);
  border-radius: 8px;
  box-shadow: 3px 3px 3px gray;
  position: absolute;
  left: 100%;
  display: none;
  z-index: 1;
}
.clickedRes {
  display: block;
  }
.changeTitle {
  font-size: 1.2rem;
  letter-spacing: 2px;
  margin-left: 5%;
  padding-top: 5%;
  padding-bottom: 5%;
}
.changeReservationInfo {
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
  background: aliceblue;
  border-radius: 5px;
  margin-top: 3%;
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
.noChange {
  position: absolute;
  bottom: 50px;
  width: 100%;
  height: 50px;
  background: rgb(27, 83, 146);
  border-style: none;
  color: #fff;
  cursor: pointer;
}
/* review */
.under {
  width: 80%;
  margin-left: 10%;
  height: 300px;
}
.reviewTitle {
  margin: 0 50px;
  margin-top: -370px;
  font-size: 1.2rem;
  font-weight: bolder;
}
.descReview {
  margin-left: 5%;
  margin-top: 30px;
  margin-bottom: 10px;
}
.reviewPanels {
  display: flex;
  overflow-x: scroll;
}
.reviewPanels::-webkit-scrollbar{
  width: 10px;
  height: 10px;
}
.reviewPanels::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background-color: rgb(167, 187, 241);
}
.reviewPanels::-webkit-scrollbar-track {
  border-radius: 5px;
  background-color: rgba(167, 187, 241, 0.3)
}
.reviewPanel {
  width: 250px;
  background-color: #fff;
  border-radius: 8px;
  height: 170px;
  margin:  10px 10px 10px 0;
  box-shadow: 5px 5px 6px slategrey;
  position: relative;
}
.nick-shop {
  display: flex;
}
.nickname {
  padding: 20px 10px 0 20px;
}
.shopname {
  padding: 20px 10px 0 5px;
}
.num-of-star {
  display: flex;
  padding: 0 0 5px 20px;
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
  width: 85%;
  height: 50px;
  margin: 10px 0 10px 7.5%;
  overflow-y: scroll;
}
.review-content::-webkit-scrollbar {
  width: 8px;
  height: 5px;
}
.review-content::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background-color: rgb(167, 187, 241);
}
.review-content::-webkit-scrollbar-track {
  border-radius: 5px;
  background-color: rgba(167, 187, 241, 0.3)
}
.reviewBtn {
  width: 250px;
  height: 40px;
  border-radius: 0 0 8px 8px;
  border: none;
  background-color: rgb(10, 14, 241);
  color: #fff;
  text-align: center;
  margin-top: 0px;
  cursor: pointer;
}
.disabled {
  background-color: rgb(217, 217, 255);
  height: 50px;
  line-height: 50px;
  text-align: center;
  margin: 10px 0;
}
/* レビュー更新 */
.changeReview {
  position: fixed;
  width: 320px;
  bottom: 50px;
  left: calc(50% - 160px);
  height: 650px;
  background-color: floralwhite;
  border-radius: 8px;
  box-shadow: 5px 5px 6px gray;
  display: none;
  z-index: 1;
}
.clickedRev {
  display: block;
}
.shopNameTitle {
  text-align: center;
  margin: 20px 0 0 0;
  font-size: 1.4rem;
  font-weight: bold;
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
.revNick {
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
  width: 300px;
  height: 80px;
  margin: 5px;
}
.send-review {
  border-style: none;
  color: #fff;
  background-color: rgb(0, 0, 253);
  height: 50px;
  width: 320px;
  cursor: pointer;
  position: absolute;
  bottom: 0;
  border-radius: 0 0 8px 8px;
}
.delReview {
  position: absolute;
  bottom: 100px;
  left: 0%;
  width: 100%;
  height: 50px;
  background-color: rgb(179, 19, 19);
  border: none;
  color: #fff;
  cursor: pointer;
}
.noChangeReview {
  position: absolute;
  bottom: 50px;
  left: 0%;
  width: 100%;
  height: 50px;
  background-color: rgb(27, 83, 146);
  border: none;
  color: #fff;
  cursor: pointer;
}
@media screen and (max-width: 768px) {
  .desc {
    margin-bottom: 20px;  
  }
  .desc2 {
    margin-bottom: 10px; 
  }
  .wrap-reservation-card {
    height: 380px;
  }
  .reservation {
    width: 300px;
    height: 350px;
    margin: 0 5px;
  }
  .panels {
    height: 390px;
  }
  .updateBtn {
    width: 300px;
    margin-left: -109px;
    margin-top: 88px;
  }
  .changeReservation {
    width: 300px;
  }
  .reviewTitle {
    margin-top: -300px; 
  }
  .reviewPanel {
    height: 200px;
    margin-bottom: 40px;
  }
  .reviewBtn {
    margin-top: 31px;
  }
  .changeReview {
    top: 125px;
  }
  .under {
    margin-bottom: 50px;
  }
}

@media screen and (max-width: 480px) {
  .name {
    position: static;
    margin-left: 0;
    font-size: 1.3rem;
    text-align: center;
    margin-top: 10px;
  }
  .wrap-column {
    display: block;
    height: auto;
  }
  .left-column {
    width: 80%;
    margin-left: 10%;
    margin-top: 5%;
  }
  .wrap-reservation-card {
    height: 390px;
  }
  .title {
    font-size: 1.2rem;
    padding-bottom: 0.5rem;
  }
  .desc {
    font-size: 0.8rem;
  }
  .changeReservation {
    left: calc(50% - 150px);
  }
  .reservation-card {
    margin: 10px 10px 10px 0;
  }
  .reservation {
    width: 260px;
    margin-bottom: 10px;
  }
  .updateBtn {
    width: 260px;
    margin-left: -103px;
    margin-top: 90px;
  }
  .right-column {
    width: 80%;
    margin-left: 10%;
  }
  .right-column h3 {
    font-size: 1.2rem;
    padding-bottom: 0.5rem;
  }
  .right-column {
    margin-top: 30px;
  }
  .panel {
    margin: 10px 10px 10px 0;
  }
  .reviewTitle {
    margin: 0 20px;
    margin-top: 30px;
  }
  .changeReview{
    top: 800px;
  }
}
</style>