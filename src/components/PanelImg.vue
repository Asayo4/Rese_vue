<template>
  <div class="img">
    <img :src="`${url}`" />
  </div>
</template>

<script>
export default {
  props: {
    url: {
      type:String,
    }
  },
  data() {
    return {
      
    }
  },
  function () {
    
  }
}
</script>
<style scoped>
.img  img{
  border-radius: 5px 5px 0 0;
  width: 300px;
  height: auto;
}
</style>