<!--上传图片组件-->
<template>
  <div>
    <div class="upload">
      <div class="img-wrapper">
        <img :src="url" alt="" :style="imgWidthAndHeightCss">
        <el-button size="small" type="primary" @click="showUploadDialog">{{ tips }}</el-button>
      </div>
      <el-upload
          v-show="false"
          action="#"
          list-type="picture-card"
          :http-request="uploadImage"
          :show-file-list="false"
          :on-change="handleChange">
      </el-upload>
    </div>
  </div>
</template>

<script>
export default {
  // 接受父组件的值
  props: {
    // 图片地址
    imgUrl: {
      type: String
    },
    // 图片宽度
    width: {
      type: String
    },
    // 图片高度
    height: {
      type: String
    },
    // 上传图片按钮的提示信息
    tips: {
      type: String
    },
    // 图片上传之前的验证方法
    checkPhotoIfValid: {
      type: Function,
      default() {
        return () => {
          return true
        }
      }
    }
  },
  computed: {
    // 设置图片的长度和宽度
    imgWidthAndHeightCss() {
      return `height: ${this.height}; width: ${this.width}`
    }
  },
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
      if (this.checkPhotoIfValid(file)) {
        let {url} = file
        this.url = url
        this.$emit('url-change', url);
      }
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
    }
  }
}
</style>
