<template>
  <div>
    <div class="search">
      <div class="dropdown">
        <select class="area-search" name="area" v-model.number="area" >
          <option value="" selected>All area</option>
          <option value=4>東京都</option>
          <option value=14>大阪府</option>
          <option value=24>福岡県</option>
        </select>
        <select class="genre-search" name="genre" v-model.number="genre" >
          <option value="" selected>All genre</option>
          <option value=4>寿司</option>
          <option value=14>焼肉</option>
          <option value=24>居酒屋</option>
          <option value=34>イタリアン</option>
          <option value=44>ラーメン</option>
        </select>
      </div>
      <div class="name-search">
        <img src="../assets/虫眼鏡.png">
        <form class="search-form">
          <input class="search-form-input" type="search" placeholder="Search..." v-model="keyword" >
        </form>
      </div>
    </div>
    <div class="panels" >
      <div class="panel" v-for="list in selectedShop" :key="list.id">
          <div class="panelImg">
            <PanelImg :url="list.url" />
          </div>
          <div class="panel-content">
            <div class="wrap-title">
              <h1 class="panel-title">{{ list.shop_name }}</h1>
              <div class="starWrap">
                <p class="star">★</p>
                <p class="star-num">{{ star_num(list.reviews) }}</p>
              </div>
            </div>
            <div class="tags">
              <p class="area-tags">#{{ list.area.area_name }}</p>
              <p class="genre-tags">#{{ list.genre.genre_name }}</p>
            </div>
              <p class="detail">{{ list.detail | readMore(34,'...') }}</p>
          </div>
          <div class="flex">
            <div class="panel-link">
              <a @click="$router.push({ name: 'Detail', params: { id: list.id } })">詳しくみる</a>
            </div>
            <div class="toggleImgs">
              <img class="likeBtn" v-if="!isLike(list.likes)" src="../assets/ハート灰.png" @click="clickLike(list)" />
              <img v-else class="unlikeBtn" @click="clickUnLike(list)" src="../assets/ハート赤.png" />
            </div>
          </div>
      </div>
    </div>
  </div>
</template>
<script>
import PanelImg from '../components/PanelImg'
import axios from 'axios'
import Vue from 'vue'

//パネルの説明文(省略したもの)
//substring→stringオブジェクトの部分集合を返す
//suffix→「...」は接尾辞だと示している
Vue.filter('readMore', function (text, length, suffix) {
  return text.substring(0, length) + suffix
})

export default {
  data() {
    return {
      lists: [],
      keyword: "",
      area: "",
      genre: "",

    };
  },
  components: {
    PanelImg,
  },
  methods: {
    async clickLike(list) {
        if (!this.$store.state.auth) {
        alert('いいね登録機能はログイン後に使用できます');
        return false
      } else {
        await axios.post("https://still-coast-90539.herokuapp.com/api/likes", {
          user_id: this.$store.state.id,
          shop_id: list.id
        })
        .then((res) => {
          console.log(res);
          alert('いいねしました')
          //リロード処理
          location.reload();
        })
      }
    },
    clickUnLike(list) {
      if (confirm('いいねを削除しますか？')) {
        for (let i in list.likes)
        {
          axios.delete(`https://still-coast-90539.herokuapp.com/api/likes/${list.likes[i].id}`, {
            data:{
              user_id: this.$store.state.id,
              shop_id: list.likes[i].shop_id
            }
          })
          .then((res) => {
            console.log(res);
            alert('いいねを削除しました')
          //リロード処理
          location.reload();
          })
        }
      }
    },
  },
  async created() {
    const item = await axios.get("https://still-coast-90539.herokuapp.com/api/shops");
    const infoOfItem = item.data.data
    this.lists = infoOfItem;
    console.log(this.lists);
  },
  computed: {
    //いいねの切り替え
    isLike() {
        return function(likes) {
        //console.log(likes)
        if (likes.length === 0) {
          return false
          //↓ログイン前の場合の処理
        } else if (!this.$store.state.auth) {
          return false
        } else
        {const result = likes.some(function(like) {
          //console.log(like)
          return like.user_id === this.$store.state.id
        }, this)
        return result}
      }
    },
    // 検索機能
    selectedShop() {
      let data = this.lists;
      const that = this;
      //keyword
      if (this.keyword !== "") {
        data = data.filter(function (shop) {
          return shop.shop_name.indexOf(that.keyword) !== -1;
        });
      }
      //area
      if (this.area !== "") {
        data = data.filter(function (shop) {
          return shop.area_id === that.area;
        });
      }
      //genre
      if (this.genre != "") {
        data = data.filter(function (shop) {
          return shop.genre_id === that.genre;
        });
      }
      return data;
      //↓教材を参考にしたもの
      /* const shopsArray = [];
      if (this.keyword !== "") {
        for (const i in this.lists) {
          const shop = this.lists[i];
          if (shop.shop_name.indexOf(this.keyword) !== -1) {
            shopsArray.push(shop);
          }
        }
        return shopsArray;
      }

      if(this.area !== "") {
        for (const i in this.lists) {
          const shop = this.lists[i];
          if (shop.area_id === this.area) {
            shopsArray.push(shop);
          }
        }
        return shopsArray;
      }

      if(this.genre !== "") {
        for (const i in this.lists) {
          const shop = this.lists[i];
          if (shop.genre_id === this.genre) {
            shopsArray.push(shop);
          }
        }
        return shopsArray;
      }
      return this.lists; */
    },
    //評価の星の平均
    star_num() {
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
    }
  },
};
</script>


<style scoped>
.search {
  display: flex;
  background: white;
  height: 45px;
  width: 450px;
  margin-left: 50%;
  border-radius: 3px;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
  margin-top: -5%;
}
.dropdown {
  display: flex;
  height: 2rem;
  margin: 5px;
}
.area-search {
  border-right: 2px solid #c0c0c0;
  border-top: none;
  border-bottom: none;
  border-left: none;
  background: white;
  width: 100px;
}
.genre-search {
  border-right: 2px solid #c0c0c0;
  border-top: none;
  border-bottom: none;
  border-left: none;
  background: white;
  width: 100px;
}
.name-search {
  display: flex;
}
.name-search img {
  width: 35px;
  height: 35px;
  margin-top: 5px;
  margin-right: 10px;
}
.search-form-input {
  border: hidden;
  line-height: 40px;
  width: 191px;
}
.panels {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  margin: 2% 8%;
}
.panel {
  width: 300px;
  background: #fff;
  border-radius: 0  0 5px 5px;
  box-shadow: 4px 5px 5px #a3a3a3;
  margin: 10px 5px;
}
.panelImg{
  max-width: 100%;
  border-radius: 5px 5px 0 0;
  height: auto;
}
.panel-content{
  padding: 20px;
}
.wrap-title {
  display: flex;
}
.panel-title{
  font-size: 20px;
  width: 120px;
}
.starWrap {
  display: flex;
  margin-left: 70px;
}
.star {
  color: sandybrown;
  font-size: 1.2rem;
}
.star-num {
  margin-top: 0.2rem;
}
.tags {
  display: flex;
  margin-top: 15px;
}
.area-tags {
  font-size: 12px;
  margin-right: 10px;
}
.genre-tags {
  font-size: 12px;
}
.detail {
  font-size: 14px;
  padding: 0.5rem 0;
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
  margin-left: 100px;
  display: block;
}
.unlikeBtn {
  width: 20px;
  height: 20px;
  margin-top: 2px;
  margin-left: 100px;
  display: block;
}
/* tablet */
@media screen and (max-width: 768px) {
  .search {
    margin-left: calc((100% - 450px) / 2);
    margin-top: 0;
  }
}
/* mobile */
@media screen and (max-width: 480px){
  .search {
    margin-left: calc(50% - 150px);
    justify-content: center;
    width: 300px;
  }
  .area-search {
    width: 70px;
  }
  .genre-search {
    width: 75px;
  }
  .name-search img {
    width: 20px;
    height: 20px;
    margin: 10px 0;
  }
  .search-form-input {
    width: 120px;
  }
  .panels{
    justify-content: center;
    margin: auto;
    display: block;
  }
  .panel {
    margin: 10px 0 10px calc(50% - 150px);
  }
}
</style>