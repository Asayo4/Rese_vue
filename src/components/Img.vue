<template>
  <div class="img">
    <img :src="`${url}`" />
  </div>
</template>

<script>
export default {
  props: {
    url: String
  },
  data() {
    return {
    }
  },
  computed:{}
}
</script>
<style scoped>
.img img{
  width: 90%;
  height: auto;
}
</style>