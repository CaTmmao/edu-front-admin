<template>
  <div class="app-container">
    <!--查询表单-->
    <el-form :inline="true">
      <el-form-item>
        <el-input v-model="condition.name" placeholder="讲师名"/>
      </el-form-item>

      <el-form-item>
        <el-select v-model="condition.level" clearable placeholder="讲师头衔">
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>

      <el-form-item label="添加时间">
        <el-date-picker
            v-model="condition.begin"
            type="datetime"
            placeholder="选择开始时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
            v-model="condition.end"
            type="datetime"
            placeholder="选择截止时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="00:00:00"
        />
      </el-form-item>

      <el-button type="primary" icon="el-icon-search" @click="getTeacherListWithPageAndCondition()">查询</el-button>
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

      <el-table-column prop="name" label="名称" width="80"/>

      <el-table-column label="头衔" width="80">
        <template slot-scope="scope">
          {{ scope.row.level === 1 ? '高级讲师' : '首席讲师' }}
        </template>
      </el-table-column>

      <el-table-column prop="intro" label="资历"/>

      <el-table-column prop="createTime" label="添加时间" width="160"/>

      <el-table-column prop="sort" label="排序" width="60"/>

      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button
              size="mini"
              @click="editTeacher(scope.row)">修改
          </el-button>
          <el-button
              size="mini"
              type="danger"
              @click="deleteTeacherById(scope.$index,scope.row.id)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <el-pagination
        :current-page="pageNum"
        :page-size="pageSize"
        :total="total"
        style="padding: 30px 0; text-align: center;"
        layout="prev, pager, next, jumper"
        @current-change="getTeacherListWithPageAndCondition"
    />
  </div>
</template>

<script>
import api from '@/api/teacher';

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
      totalPage: null,
      // 分页时可筛选条件
      condition: {
        // 讲师头衔
        level: null,
        // 讲师名字
        name: "",
        // 讲师被创建的开始时间
        begin: null,
        // 讲师被创建的结束时间
        end: null
      }
    }
  },
  created() {
    this.getTeacherListWithPageAndCondition();
  },
  methods: {
    /**
     * 获取分页后的讲师列表（可筛选条件）
     * @param pageNum 当前第几页，从 1 开始
     * @return 讲师列表
     */
    getTeacherListWithPageAndCondition(pageNum = 1) {
      this.listLoading = true
      this.pageNum = pageNum

      let {pageSize, condition} = this
      api.getTeacherListWithPageAndCondition(pageNum, pageSize, condition)
          .then(res => {
            this.list = res.data
            this.totalPage = res.totalPage
            this.total= res.total
            this.listLoading = false
          })
    },

    /**
     * 重置
     */
    resetData() {
      this.condition = {}
      this.getTeacherListWithPageAndCondition();
    },

    /**
     * 删除讲师
     * @param index 讲师列表中的 index
     * @param id 讲师ID
     */
    deleteTeacherById(index, id) {
      this.$confirm('此操作将永久删除讲师记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.deleteTeacherById(id)
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
     * 编辑讲师信息
     * @param item 讲师信息
     */
    editTeacher(item) {
      this.$router.push({
        path: `/teacher/edit/${item.id}`,
        query: {
          data: JSON.stringify(item)
        }
      })
    }
  }
}
</script>
