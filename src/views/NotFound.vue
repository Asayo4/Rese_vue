<template>
  <div id="NotFound">
    <h1>404 Not found.</h1>
    <p>お探しのページは見つかりませんでした。</p>
    <button @click="$router.push({ name: 'Shops' })">Topへ戻る</button>
  </div>
</template>

<script>

export default {}
</script>

<style scoped>
#NotFound {
  text-align: center;
  padding: 30px ;  
  background: cornflowerblue;
}
#NotFound h1 {
  color: aliceblue;
  font-size: 2rem;
  margin-bottom: 8px;
}
#NotFound p {
  margin-bottom: 2rem;
}
#NotFound button {
  border-radius: 3px;
  border-style: none;
  background: oldlace;
}
</style>
