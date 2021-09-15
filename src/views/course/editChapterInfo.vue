<template>
  <div class="app-container">
    <Chapter ref="chapter" v-on:init-chapter-list="getChapterListInfo" style="margin-bottom: 100px"></Chapter>
  </div>
</template>

<script>
import Chapter from "./components/chapter"
import courseApi from '@/api/course';
import chapterApi from '@/api/chapter';
import {Message} from "element-ui";

export default {
  components: {Chapter},
  created() {
    this.getChapterListInfo()
  },
  methods: {
    // 获取课程章节列表信息
    getChapterListInfo() {
      chapterApi.getCourseChapterListByCourseId(this.$route.params.id)
          .then(res => {
            this.$refs.chapter.setModeToUpdate()
            this.$refs.chapter.setChapterList(res.data)
          })
    }
  }
}
</script>

<style scoped>

</style>
