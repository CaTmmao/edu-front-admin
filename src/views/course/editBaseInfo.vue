<template>
  <div class="app-container">
    <Info ref="info" style="margin-bottom: 100px"></Info>
    <el-form label-width="120px">
      <el-form-item>
        <el-button type="primary" @click="update">更新</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Info from "./components/info"
import courseApi from '@/api/course';
import {Message} from "element-ui";

export default {
  components: {Info},
  async created() {
    await this.init()
  },
  methods: {
    // 数据初始化
    async init() {
      let {params} = this.$route
      if (params && params.id) {
        console.log(params.id)
        await courseApi.getCourseBaseInfoById(params.id)
            .then(res => {
              this.$refs.info.initCourseInfo(res.data)
            })
      }
    },

    // 更新课程
    async update() {
      try {
        let courseInfo = await this.$refs.info.update()
        courseApi.updateCourseBaseInfoById(courseInfo.id, courseInfo);
        this.$router.push("/course/list")
      } catch (e) {
        console.log(e)
        Message({
          message: "课程更新失败: " + e,
          type: 'error',
          duration: 5 * 1000
        })
      }
    }
  }
}
</script>
