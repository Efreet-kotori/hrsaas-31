<template>
  <div class="dashboard-container">
    <div class="app-container">
      <upload-excel :beforeUpload="excelSuccess" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },

  created() {},

  methods: {
    excelSuccess() {
      const maxSize = true
      if (maxSize) {
        return false
      }
      console.log('22')
    },
  },
}
</script>

<style scoped></style>
