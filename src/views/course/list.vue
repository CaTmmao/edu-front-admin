<template>
  <div class="app-container">
    <!--条件筛选表单-->
    <el-form :inline="true">
      <el-form-item>
        <el-input v-model="condition.title" placeholder="课程名称"/>
      </el-form-item>

      <el-form-item>
        <el-select v-model="condition.status" clearable placeholder="课程状态">
          <el-option :value="false" label="未发布"/>
          <el-option :value="true" label="已发布"/>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-select v-model="condition.teacherId" clearable placeholder="讲师">
          <el-option
              v-for="teacher in teacherList"
              :key="teacher.id"
              :label="teacher.name"
              :value="teacher.id"/>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-date-picker
            v-model="condition.begin"
            type="datetime"
            placeholder="选择创建课程开始时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
            v-model="condition.end"
            type="datetime"
            placeholder="选择创建课程截止时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="00:00:00"
        />
      </el-form-item>
      <el-button type="primary" @click="getCourseListWithPageAndCondition()">查询</el-button>
      <el-button type="default" @click="resetData()">重置</el-button>
    </el-form>

    <!--表格-->
    <el-table
        v-loading="listLoading"
        element-loading-text="Loading"
        :data="list"
        border
        fit
        highlight-current-row>
      <el-table-column
          label="序号"
          width="70"
          align="center">
        <template slot-scope="scope">
          {{ (pageNum - 1) * pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="title" label="课程名称" width="300"/>

      <el-table-column label="课程状态" width="80">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status" type="success">已发布</el-tag>
          <el-tag v-else type="warning">未发布</el-tag>
        </template>
      </el-table-column>

      <!--      <el-table-column prop="categoryText" label="分类" width="170">-->
      <!--      </el-table-column>-->

      <el-table-column prop="teacherId" label="讲师" width="80">
        <template slot-scope="scope">
          {{ getTeacherNameByTeacherId(scope.row.teacherId) }}
        </template>
      </el-table-column>

      <el-table-column prop="lessonNum" label="课时数" width="80" align="center"/>
      <el-table-column prop="viewCount" label="浏览数量" width="100"/>
      <el-table-column prop="price" label="销售价格" width="80"/>

      <el-table-column label="操作" align="right">
        <template slot-scope="scope">
          <el-button size="mini" @click="editBaseInfo(scope.row.id)">编辑课程基本信息</el-button>
          <el-button size="mini" @click="editChapterInfo(scope.row.id)">编辑课程章节信息</el-button>
          <el-button
              size="mini"
              type="danger"
              @click="deleteCourseById(scope.$index,scope.row.id)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <el-pagination
        background
        :current-page="pageNum"
        :page-size="pageSize"
        :total="total"
        style="padding: 30px 0; text-align: center;"
        layout="prev, pager, next, jumper"
        @current-change="getCourseListWithPageAndCondition"
    />
  </div>
</template>

<script>
import courseApi from '@/api/course';
import teacherApi from '@/api/teacher';
import categoryApi from '@/api/category';

export default {
  data() {
    return {
      listLoading: true,
      list: null,
      // 每页显示的数量
      pageSize: 10,
      // 当前第几页，从 1 开始
      pageNum: 1,
      // 共有多少条
      total: 0,
      // 共有多少页
      totalPage: 0,
      // 分页时可筛选条件
      condition: {
        // 课程标题
        title: '',
        // 课程是否发布
        status: null,
        // 讲师ID
        teacherId: null,
        // 课程被创建的开始时间
        begin: null,
        // 课程被创建的结束时间
        end: null
      },
      // 讲师列表
      teacherList: []
    }
  },
  created() {
    this.getTeacherList()
    this.getCourseListWithPageAndCondition();
  },
  methods: {
    /**
     * 根据子分类ID获取完整分类信息
     * @param id 子分类ID
     * @return {AxiosPromise} 完整分类信息
     */
    async getCompleteCategory(id) {
      let result = ''

      // 获取当前分类信息
      await categoryApi.getCategoryById(id)
          .then(async res => {
            let category = res.data

            // 获取父级分类信息
            await categoryApi.getCategoryById(category.parentId)
                .then(res => {
                  result = res.data.title + '/' + category.title
                })
          })

      console.log(result)
      return result
    },

    /**
     * 根据讲师ID获取讲师名字
     * @param teacherId 讲师ID
     * @return 讲师名字
     */
    getTeacherNameByTeacherId(teacherId) {
      let result;

      this.teacherList.forEach(teacher => {
        if (teacher.id === teacherId) {
          result = teacher.name
        }
      })

      return result
    },

    // 获取讲师列表
    getTeacherList() {
      teacherApi.getTeacherList()
          .then(res => {
            this.teacherList = res.data
          })
    },

    /**
     * 获取分页后的课程列表（可筛选条件）
     * @param pageNum 当前第几页，从 1 开始
     * @return 课程列表
     */
    getCourseListWithPageAndCondition(pageNum = 1) {
      this.listLoading = true
      this.pageNum = pageNum

      let {pageSize, condition} = this
      courseApi.getCourseListWithPageAndCondition(pageNum, pageSize, condition)
          .then(async res => {
            this.list = res.data
            this.totalPage = res.totalPage
            this.total = res.total
            this.listLoading = false
          })
    },

    /**
     * 重置
     */
    resetData() {
      this.condition = {}
      this.getCourseListWithPageAndCondition();
    },

    /**
     * 删除课程
     * @param index 课程列表中的 index
     * @param id 课程ID
     */
    deleteCourseById(index, id) {
      this.$confirm('此操作将永久删除课程记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        courseApi.deleteTeacherById(id)
            .then(() => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });

              this.list.splice(index, 1);
            })
      })
    },

    /**
     * 编辑课程基本信息
     * @param courseId 课程ID
     */
    editBaseInfo(courseId) {
      this.$router.push({
        path: `/course/editBaseInfo/${courseId}`
      })
    },

    /**
     * 编辑课程章节信息
     * @param courseId 课程ID
     */
    editChapterInfo(courseId) {
      this.$router.push({
        path: `/course/editChapterInfo/${courseId}`
      })
    }
  }
}
</script>
