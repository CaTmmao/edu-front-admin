<!--上传图片组件-->
<template>
  <div>
    <div class="upload">
      <el-upload
          v-show="false"
          action="#"
          list-type="picture-card"
          :http-request="uploadImage"
          :show-file-list="false"
          :on-change="handleChange">
      </el-upload>

      <div class="img-wrapper">
        <img :src="url" alt="">
        <el-button size="small" type="primary" @click="showUploadDialog">更换头像</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  // 接受父组件的值
  props: ['imgUrl'],
  data() {
    return {
      url: ''
    }
  },
  created() {
    this.init()
  },
  methods: {
    /**
     * 数据初始化
     */
    init() {
      if (this.imgUrl) {
        this.url = this.imgUrl
      }
    },

    uploadImage(param) {
      this.$emit('file-change', param.file);
    },

    showUploadDialog() {
      document.querySelector("input[type=file]").click();
    },

    handleChange(file) {
    let {url} = file
      this.url = url
      this.$emit('url-change', file.url);
    }
  }
}
</script>

<style scoped lang="scss">
.upload {
  .img-wrapper {
    display: flex;
    align-items: center;

    img {
      margin-top: 20px;
      margin-right: 20px;
      width: 148px;
      height: 148px;
    }
  }
}
</style>
