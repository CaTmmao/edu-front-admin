<!--上传视频组件-->
<template>
  <div>
    <div class="upload">
      <el-upload
          ref="upload"
          :show-file-list="false"
          action="#"
          :auto-upload="false"
          :on-change="handleChange">
        <el-button size="small" type="primary">上传视频</el-button>
        <el-tooltip placement="right-end">
          <div slot="content">最大支持1M(太大要钱)，<br>
            支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br>
            GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br>
            MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br>
            SWF、TS、VOB、WMV、WEBM 等视频格式上传
          </div>
          <i class="el-icon-question"/>
        </el-tooltip>
      </el-upload>
    </div>
    <div>
    <span v-show="fileInfo.name">
      {{ fileInfo.name }}
      <i class="el-icon-delete" @click="removeVideo"/>
      </span>
    </div>
  </div>
</template>

<script>
const fileInfo = {name: '', file: null}
export default {
  // 接受父组件的值
  props: {
    // 视频上传之前的验证方法
    checkVideoIfValid: {
      type: Function,
      default() {
        return () => {
          return true
        }
      }
    }
  },
  data() {
    return {
      fileInfo: {...fileInfo}
    }
  },
  methods: {
    /**
     * 文件数据初始化
     */
    fileInit(value) {
      if (value && value.videoOriginalName) {
        this.$set(this.fileInfo, 'name', value.videoOriginalName)
        this.$set(this.fileInfo, 'file', value)
      } else {
        this.fileInfo = {...fileInfo}
      }
    },

    handleChange(newFile) {
      if (this.checkVideoIfValid(newFile)) {
        this.fileInfo.name = newFile.name
        this.fileInfo.file = newFile
        this.$emit('video-change', newFile.raw);
      }
    },

    // 删除视频
    removeVideo() {
      this.$confirm('确定删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.fileInfo = {...fileInfo}
        this.$emit('video-change', {});
      })
    }
  }
  ,
  watch: {
    file(value) {
      this.fileInit(value)
    }
  }
}
</script>

<style scoped lang="scss">
.upload {
  .el-icon-question {
    margin-left: 10px;
  }
}

.el-icon-delete {
  cursor: pointer;
}
</style>
