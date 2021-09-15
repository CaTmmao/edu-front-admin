<template>
  <div>
    <h3>课程基础信息</h3>
    <el-divider></el-divider>

    <el-form :model="courseInfo" ref="courseBaseInfo" label-width="120px" style="margin-top: 30px">
      <el-form-item label="课程标题" prop="title"
                    :rules="[ { required: true, message: '请输入视频标题', trigger: ['blur', 'change']  } ]">
        <el-input style="width:500px" v-model="courseInfo.title"/>
      </el-form-item>

      <el-form-item label="课程分类">
        <div class="category">
          <el-cascader
              v-model="selectedCategoryValue"
              :options="categoryList"
              placeholder="请选择"
              @change="handleCategoryChange"></el-cascader>
        </div>
      </el-form-item>

      <el-form-item label="课程状态">
        <el-radio-group v-model="courseInfo.status">
          <el-radio :label="true">发布</el-radio>
          <el-radio :label="false">暂不发布</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="课程讲师">
        <el-select
            v-model="courseInfo.teacherId"
            placeholder="请选择">
          <el-option
              v-for="teacher in teacherList"
              :key="teacher.id"
              :label="teacher.name"
              :value="teacher.id"/>
        </el-select>
      </el-form-item>

      <el-form-item label="总课时">
        <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right"/>
      </el-form-item>

      <el-form-item label="课程简介">
        <el-input type="textarea" style="width:500px" v-model="courseInfo.description" placeholder=" "/>
      </el-form-item>

      <el-form-item label="课程封面">
        <upload ref="cover" :img-url="courseInfo.cover" tips="更换封面"
                height="300px" width="500px"
                :check-photo-if-valid="validateCover"
                v-on:file-change="handleCoverFileChange"
                v-on:url-change="handleCoverUrlChange"></upload>
      </el-form-item>

      <el-form-item label="课程价格">
        <el-input-number :precision="2" :step="0.01" :min="0" v-model="courseInfo.price" controls-position="right"
                         placeholder="免费课程请设置为0元"/>
        元
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import categoryApi from '@/api/category';
import teacherApi from '@/api/teacher';
import Upload from '@/components/UploadPhoto/index';
import ossApi from "@/api/oss";

const courseInfo = {
  // 标题
  title: '',
  // 二级分类ID
  categoryId: '',
  // 讲师ID
  teacherId: '',
  // 总课时
  lessonNum: 0,
  // 简介
  description: '',
  // 封面
  cover: 'https://edu-site.oss-cn-beijing.aliyuncs.com/0.jpeg',
  // 课程销售价格,设置为0时可免费观看
  price: 0,
  // 是否发布
  status: true
}

export default {
  components: {Upload},
  data() {
    return {
      // 课程信息
      courseInfo: {...courseInfo},
      // 封面的文件信息
      coverFile: null,
      // 讲师列表
      teacherList: [],
      // 分类列表
      categoryList: [],
      // 已选择的分类
      selectedCategoryValue: []
    }
  },
  created() {
    this.init()
  }
  ,
  methods: {
    // 数据初始化
    init() {
      this.getTeacherList()
      this.getAllCategoryList()
    },

    // 数据重置
    reset() {
      this.courseInfo = {...courseInfo}
    },

    // 初始化 courseInfo 对象
    initCourseInfo(data) {
      this.courseInfo = data
      // 初始化当前已被选择的分类的值
      this.selectedCategoryValue = [undefined, this.courseInfo.categoryId]
      this.$refs.cover.$set(this.$refs.cover, 'url', data.cover)
    },

    // 获取分类列表
    getAllCategoryList() {
      categoryApi.getAllCategoryList()
          .then(res => {
            let {data} = res
            data.forEach(item => {
              item.label = item.title

              item.children.forEach(item => {
                item.label = item.title
                item.value = item.id
              })
            })

            this.categoryList = data
          })
    },

    // 课程分类级联选择器 change 事件
    handleCategoryChange() {
      this.selectedCategoryValue.forEach(item => {
        if (item) {
          this.courseInfo.categoryId = item
        }
      })
    },

    /**
     * 封面 url 变更（存储在本地的地址）
     * @param url 封面url地址
     */
    handleCoverUrlChange(url) {
      this.courseInfo.cover = url
    },

    /**
     * 封面 file 变更
     * @param file 封面file信息
     */
    handleCoverFileChange(file) {
      this.coverFile = file
    },

    /**
     * 验证上传的封面是否合规
     * @param file 文件信息
     */
    validateCover(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      const typeIsImage = file.raw.type.indexOf("image") !== -1

      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
        return false
      } else if (!typeIsImage) {
        this.$message.error('只能上传图片')
        return false
      }

      return true
    },

    // 获取所有讲师
    getTeacherList() {
      teacherApi.getTeacherList()
          .then(res => {
            this.teacherList = res.data
          })
    },

    /**
     * 上传课程封面到OSS中
     * @param file 图片信息
     */
    async upload(file) {
      const formData = new FormData();
      formData.append('file', file)

      await ossApi.uploadPhoto(formData)
          .then(res => {
            this.courseInfo.cover = res.data
            this.coverFile = null
          })
    },

    // 验证数据
    validateCourseInfo() {
      this.$refs['courseBaseInfo'].validate((valid) => {
        if (!valid) {
          throw '课程基本信息请填写完整'
        }
      })
    },

    // 添加课程信息
    async add() {
      try {
        this.validateCourseInfo()

        if (this.coverFile) {
          await this.upload(this.coverFile)
        }

        return this.courseInfo
      } catch (e) {
        throw e
      }
    },

    // 更新课程信息
    async update() {
      try {
        this.validateCourseInfo()

        if (this.coverFile) {
          await this.upload(this.coverFile)
        }

        return this.courseInfo
      } catch (e) {
        throw e
      }
    }
  }
}
</script>

<style scoped>

</style>
