<template>
  <div class="app-container">
    <el-form label-width="120px" style="margin-top: 30px">
      <!--      添加分类按钮-->
      <el-form-item>
        <el-button type="text" @click="handleAddCategoryEventOfTreeNode(null)"
          >添加分类</el-button
        >
      </el-form-item>
      <!-- 分类列表 -->
      <el-form-item>
        <el-tree
          :expand-on-click-node="false"
          :data="tree.categoryList"
          default-expand-all
          style="width: 80%"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ data.title }}</span>
            <span>
              <el-button
                v-if="nodeIfHasChildren(data)"
                type="text"
                size="mini"
                @click="handleEditCategoryEventOfTreeNode(data)"
              >
                编辑
              </el-button>
              <el-button
                v-if="nodeIfHasChildren(data)"
                type="text"
                size="mini"
                @click="handleAddCategoryEventOfTreeNode(data)"
              >
                添加子分类
              </el-button>
              <el-button
                v-else
                type="text"
                size="mini"
                @click="handleEditCategoryEventOfTreeNode(data)"
              >
                编辑
              </el-button>
              <el-button type="text" size="mini" @click="deleteCategory(data)">
                删除
              </el-button>
            </span>
          </span>
        </el-tree>
      </el-form-item>
    </el-form>

    <!--    添加/修改分类表单-->
    <el-dialog :visible.sync="addOrEditCategoryDialog.Visible" title="添加分类">
      <el-form
        ref="addOrEditCategoryForm"
        :model="categoryInfo"
        label-width="120px"
      >
        <el-form-item
          prop="title"
          label="分类标题"
          :rules="[
            {
              required: true,
              message: '请输入分类标题',
              trigger: ['blur', 'change'],
            },
          ]"
        >
          <el-input v-model="categoryInfo.title" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="hiddenAddOrEditCategoryDialog">取 消</el-button>
        <el-button
          v-if="addOrEditCategoryDialog.status === 'add'"
          type="primary"
          @click="addCategory('addOrEditCategoryForm')"
          >添 加
        </el-button>
        <el-button
          v-else
          type="primary"
          @click="updateCategory('addOrEditCategoryForm')"
          >更 改</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from "@/api/category";

// 章节信息
const firstCategoryInfo = {
  // 课程分类ID
  id: "",
  // 父级分类ID
  parentId: "0",
  // 分类名称
  title: "标题",
  children: [],
};

export default {
  data() {
    return {
      // 临时存储分类信息的变量
      categoryInfo: { ...firstCategoryInfo },
      // 树形控件
      tree: {
        // 课程分类信息
        categoryList: [{ children: [] }],
        // 当前正在操作的一级分类节点
        currentOperateFristCategoryInfo: { ...firstCategoryInfo },
        // 当前正在操作的二级分类节点
        currentOperateSecondCategoryInfo: {},
      },
      // 添加/修改课程分类弹窗
      addOrEditCategoryDialog: {
        // 是否可见
        Visible: false,
        // 状态(默认添加状态)
        status: "add",
      },
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      api.getAllCategoryList().then((res) => {
        this.tree.categoryList = res.data;
      });
    },

    // 显示 添加/编辑分类弹窗
    showAddOrEditCategoryDialog() {
      this.addOrEditCategoryDialog.Visible = true;
    },

    // 隐藏 添加/编辑分类弹窗
    hiddenAddOrEditCategoryDialog() {
      this.addOrEditCategoryDialog.Visible = false;
    },

    /**
     * 判断该节点是否有子节点
     * @param data 节点
     * @return {boolean} true有，false没有
     */
    nodeIfHasChildren(data) {
      return data.hasOwnProperty("children");
    },

    /**
     * [添加分类]点击事件
     */
    handleAddCategoryEventOfTreeNode(data) {
      this.categoryInfo = { ...firstCategoryInfo };
      if (data) {
        this.categoryInfo.parentId = data.id;
      }
      console.log(this.categoryInfo);
      this.addOrEditCategoryDialog.status = "add";
      this.showAddOrEditCategoryDialog();
    },

    /**
     * [编辑分类]点击事件
     * @param data 章节信息
     */
    handleEditCategoryEventOfTreeNode(data) {
      this.categoryInfo = { ...data };
      this.addOrEditCategoryDialog.status = "edit";
      this.showAddOrEditCategoryDialog();
    },

    // 操作成功提示
    operateSuccessMessage() {
      this.$message({
        message: "操作成功",
        type: "success",
      });
    },

    /**
     * 添加分类信息
     * @param formName element-ui el-form 表单名
     */
    addCategory(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          api.addCategory(this.categoryInfo).then(() => {
            this.hiddenAddOrEditCategoryDialog();
            this.init();
            this.operateSuccessMessage();
          });
        }
      });
    },

    // 更新分类信息
    updateCategory(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let { categoryInfo } = this;
          api.updateCategory(categoryInfo.id, categoryInfo).then(() => {
            this.hiddenAddOrEditCategoryDialog();
            this.init();
            this.operateSuccessMessage();
          });
        }
      });
    },

    // 删除
    deleteCategory(data) {
      this.$confirm(`确定删除分类【${data.title}】吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        api.deleteCategoryById(data.id).then(() => {
          this.operateSuccessMessage();
          this.init();
        });
      });
    },
  },
};
</script>

<style scoped>
.custom-tree-node {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
</style>