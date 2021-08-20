<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacherInfo.name"/>
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number v-model="teacherInfo.sort" controls-position="right" :min="0"/>
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacherInfo.level" clearable placeholder="请选择">
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacherInfo.career"/>
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="teacherInfo.intro" :rows="10" type="textarea"/>
      </el-form-item>

      <el-form-item label="讲师头像">
        <upload :img-url="teacherInfo.avatar" v-on:file-change="handleAvatarFileChange"
                v-on:url-change="handleAvatarChange"></upload>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import api from '@/api/teacher';
import Upload from '@/components/Upload/index';

// 讲师信息
const teacherInfo = {
  // 讲师名称
  name: '',
  // 讲师排序
  sort: '0',
  // 讲师头衔
  level: 1,
  // 讲师简介
  intro: '',
  // 讲师资历
  career: '',
  // 讲师头像
  avatar: 'https://edu-site.oss-cn-beijing.aliyuncs.com/20212201335364831.jpg'
}

export default {
  components: {Upload},
  data() {
    return {
      // 讲师信息
      teacherInfo: {},
      // 头像文件
      avatarFile: null
    }
  },
  created() {
    this.init()
  },
  methods: {
    /**
     * 保存信息
     */
    async save() {
      if (this.$route.params && this.$route.params.id) {
        let id = this.$route.params.id

        if (this.avatarFile) {
          await this.upload(this.avatarFile)
        }

        this.updateTeacherById(id, this.teacherInfo);
      } else {
        if (this.teacherInfo.avatar != teacherInfo.avatar) {
          await this.upload(this.avatarFile)
        }

        this.addTeacher(this.teacherInfo)
      }
    },

    /**
     * 头像被更改了
     * @param url 头像存在本地的地址
     */
    handleAvatarChange(url) {
      this.teacherInfo.avatar = url
    },

    /**
     * 头像被更改了
     * @param file 文件信息
     */
    handleAvatarFileChange(file) {
      this.avatarFile = file
    },

    /**
     * 添加讲师
     * @param data 讲师信息
     */
    addTeacher(data) {
      api.addTeacher(data)
          .then(() => {
            this.$message({
              type: 'success',
              message: '添加成功!'
            });

            this.$router.push('/teacher/list')
          })
    },

    /**
     * 更新讲师信息
     * @param id 讲师ID
     * @param data 讲师信息
     */
    updateTeacherById(id, data) {
      api.updateTeacherById(id, data)
          .then(() => {
            this.$message({
              type: 'success',
              message: '更新成功!'
            });

            this.$router.push('/teacher/list')
          })
    },

    /**
     * 数据初始化
     */
    init() {
      let {params, query} = this.$route

      if (params && params.id) {
        this.teacherInfo = JSON.parse(query.data)
      } else {
        this.teacherInfo = {...teacherInfo}
      }
    },

    /**
     * 上传头像到OSS中
     * @param file 图片信息
     */
    async upload(file) {
      const formData = new FormData();
      formData.append('file', file)

      await api.uploadPhoto(formData)
          .then(res => {
            let {url} = res.data
            this.teacherInfo.avatar = url
          })
    }
  },
  watch: {
    $route() {
      this.init()
    }
  }
}
</script>
