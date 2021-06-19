<template>
  <div class="thanks">
    <div class="thankYou">
      <h1>会員登録ありがとうございます</h1>
      <button @click="$router.push({ name: 'Login' })">ログインする</button>
    </div>
  </div>
</template>

<script>

</script>

<style scoped>
.thanks {
  position: relative;
}
.thankYou {
  background: #fff;
  width: 300px;
  padding: 5%;
  box-shadow: 3px 3px 5px #919191 ;
  border-radius: 5px;
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translateY(0) translateX(-50%);
}
.thankYou h1 {
  font-weight: 80;
  text-align: center;
}
.thankYou button {
  margin: 15% 32% 0;
  background: rgb(35, 92, 246);
  color: #fff;
  border-style: none;
  padding: 2% 4%;
  border-radius: 3px;
}
@media screen and (max-width: 480px) {
  .thankYou {
    padding: 0;
  }
  .thankYou h1 {
    margin-top: 2rem;
  }
  .thankYou button {
    margin-bottom: 1.5rem;
  }
}
</style>