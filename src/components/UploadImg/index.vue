<template>
  <div>
    <el-upload
      action="#"
      list-type="picture-card"
      :file-list="fileList"
      :http-request="onRequest"
      :on-change="onChange"
      :on-remove="onRemove"
      :on-preview="onPreview"
      :before-upload="beforeUpload"
      :limit="1"
      class="custom-upload"
      v-loading="loading"
      element-loading-text="上传中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.3)"
    >
      <!-- :class="fileList.length ? 'hide' : ''" -->
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="previewImgDialog">
      <img :src="imgUrl" />
    </el-dialog>
  </div>
</template>

<script>
// id：  AKIDQfeMnysVt1sSnshFWWFhtoRnsgDSQ7Zm
// key: 5vWrwlKdgU2KM8gz3qNfhW5PTHp8AwSi

import COS from 'cos-js-sdk-v5'
const cos = new COS({
  SecretId: 'AKIDQfeMnysVt1sSnshFWWFhtoRnsgDSQ7Zm',
  SecretKey: '5vWrwlKdgU2KM8gz3qNfhW5PTHp8AwSi',
})
// console.log(cos)
export default {
  name: 'UploadImg',

  data() {
    return {
      fileList: [],
      previewImgDialog: false,
      imgUrl: '',
      loading: false,
    }
  },

  created() {},

  methods: {
    onRequest({ file }) {
      this.loading = true
      cos.putObject(
        {
          Bucket: 'hmhr-31-1313341628' /* 必须 */,
          Region: 'ap-shanghai' /* 存储桶所在地域，必须字段 */,
          Key: file.name /* 必须 */,
          StorageClass: 'STANDARD',
          Body: file, // 上传文件对象
          onProgress: function (progressData) {
            console.log(JSON.stringify(progressData))
          },
        },
        (err, data) => {
          this.loading = false
          if (err || data.statusCode !== 200) {
            return this.$message.error('上传失败')
          }
          this.$emit('onSuccess', {
            url: 'https://' + data.Location,
          })
          this.$message.success('上传成功')
        },
      )
    },
    onChange(file, fileList) {
      this.fileList = fileList
    },
    onRemove(file, fileList) {
      this.fileList = fileList
    },
    onPreview(file) {
      this.previewImgDialog = true
      this.imgUrl = file.url
    },
    beforeUpload(file) {
      // 现在图片类型
      const types = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif']
      if (!types.includes(file.type)) {
        this.$message.error('请选择' + types.join('、') + '图片')
        return false
      }
      // 限制图片大小
      const masSize = 2 * 1024 * 1024
      if (file.size > masSize) {
        this.$message.error('选择的图片不能超出2mb')
        return false
      }
    },
  },
}
</script>

<style scoped lang="scss">
.custom-upload {
  width: 148px;
  height: 148px;
  overflow: hidden;
}
</style>
