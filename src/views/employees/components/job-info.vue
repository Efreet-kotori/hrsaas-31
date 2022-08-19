<template>
  <div>
    <i
      @click="$router.push('/employees/print/' + userId +'?type=job')"
      class="el-icon-printer"
    ></i>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userId: this.$route.params.id,
    }
  },

  created() {},

  methods: {},
}
</script>

<style scoped></style>
