<template>
  <div class="app-container">
    <Info ref="info" style="margin-bottom: 100px"></Info>
    <Chapter ref="chapter" style="margin-bottom: 100px"></Chapter>
    <el-form label-width="120px">
      <el-form-item>
        <el-button type="primary" @click="add">添加</el-button>
        <el-button type="plain" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Chapter from "./components/chapter"
import Info from "./components/info"
import courseApi from '@/api/course';
import {Message} from "element-ui";

export default {
  components: {Chapter, Info},
  data() {
    return {
      // 课程基本信息
      courseInfo: {},
      // 课程章节信息
      chapterList: {}
    }
  },
  methods: {
    // 添加课程
    async add() {
      try {
        this.courseInfo = await this.$refs.info.add()
        this.chapterList = await this.$refs.chapter.save()
        let data = {
          'courseBaseInfo': this.courseInfo,
          'chapterList': this.chapterList
        }
        courseApi.addCourse(data)
        .then(() => {

          this.$message({
            message: '课程添加成功',
            type: 'success'
          });
          this.$router.push("/course/list")
        })
      } catch (e) {
        console.log(e)
        Message({
          message: "课程添加失败: " + e,
          type: 'error',
          duration: 5 * 1000
        })
      }
    },

    // 重置数据
    reset() {
      this.$refs.info.reset()
      this.$refs.chapter.reset()
    }
  }
}
</script>

<style scoped>

</style>
