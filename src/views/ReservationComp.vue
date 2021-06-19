<template>
  <div class="done">
    <div class="done-card">
      <p>ご予約ありがとうございます</p>
      <button @click="$router.push({ name: 'Shops' })">ホームへ</button>
      <button @click="$router.push({ name: 'Mypage'})">マイページへ</button>
    </div>
  </div>
</template>
<style scoped>
.done-card {
  background: #fff;
  width: 300px;
  border-radius: 5px;
  margin-top: 5%;
  margin-left: 50%;
  transform: translateX(-50%);
  box-shadow: 3px 3px 3px #c2c2c2;
  padding: 4rem 3rem;
}
.done-card p {
  width: 75%;
  margin-left: 50%;
  transform: translateX(-50%);
}
.done-card button {
  border: none;
  border-radius: 3px;
  width: 6.5rem;
  line-height: 2.5rem;
  margin-left: 50%;
  transform: translateX(-50%);
  margin-top: 5%;
  background: rgb(35, 92, 246);
  color: #fff;
}
@media screen and (max-width: 480px) {
  .done-card {
    padding: 4rem 0;
  }
}
</style>