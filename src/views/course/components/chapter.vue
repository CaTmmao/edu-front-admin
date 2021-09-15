<template>
  <div v-loading.fullscreen.lock="fullscreenLoading">
    <h3>课程章节信息</h3>

    <!--    分割线-->
    <el-divider></el-divider>

    <el-form label-width="120px" style="margin-top: 30px">
      <!--      添加章节按钮-->
      <el-form-item>
        <el-button type="text" @click="handleAddChapterEventOfTreeNode">添加章节</el-button>
      </el-form-item>

      <!--      章节信息树形控件-->
      <el-form-item>
        <div class="chapter-tree-container" v-show="tree.chapterList.length">
          <div class="block">
            <el-tree :expand-on-click-node="false" :data="tree.chapterList" default-expand-all style="width: 80%">
                <span class="custom-tree-node" slot-scope="{ node, data }">
                  <span class="title" :class="{chapter: nodeIfHasChildren(data)}">{{ data.title }}</span>
                  <span>
                    <el-button v-if="nodeIfHasChildren(data)" type="text" size="mini"
                               @click="handleEditChapterEventOfTreeNode(data)"> 编辑章节 </el-button>
                    <el-button v-if="nodeIfHasChildren(data)" type="text" size="mini"
                               @click="handleAddVideoEventOfTreeNode(data)"> 添加视频 </el-button>
                    <el-button v-else type="text" size="mini"
                               @click="handleEditVideoEventOfTreeNode(data)"> 编辑视频 </el-button>
                    <el-button type="text" size="mini" @click="deleteChapterOrVideo(node, data)"> 删除 </el-button>
                  </span>
                </span>
            </el-tree>
          </div>
        </div>
      </el-form-item>
    </el-form>

    <!--    添加/修改章节表单-->
    <el-dialog :visible.sync="addOrEditChapterDialog.Visible" title="添加章节">
      <el-form ref="addOrEditChapterForm" :model="chapterInfo" label-width="120px">
        <el-form-item prop="title" label="章节标题"
                      :rules="[ { required: true, message: '请输入章节标题', trigger: ['blur', 'change']  } ]">
          <el-input v-model="chapterInfo.title"/>
        </el-form-item>

        <el-form-item label="排序"
                      :rules="[ { required: true, message: '请输入章节排序', trigger: ['blur', 'change']  } ]">
          <el-input-number :min="0" v-model="chapterInfo.sort"/>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="hiddenAddOrEditChapterDialog">取 消</el-button>
        <el-button v-if="addOrEditChapterDialog.status === 'add'" type="primary"
                   @click="addChapter('addOrEditChapterForm')">添 加
        </el-button>
        <el-button v-else type="primary" @click="updateChapter('addOrEditChapterForm')">更 改</el-button>
      </div>
    </el-dialog>

    <!-- 添加&修改视频表单 -->
    <el-dialog :visible.sync="addOrEditVideoDialog.Visible" title="添加视频">
      <el-form ref="addOrEditVideoForm" :model="videoInfo" label-width="120px">
        <el-form-item prop="title" label="视频标题"
                      :rules="[ { required: true, message: '请输入视频标题', trigger: ['blur', 'change']  } ]">
          <el-input v-model="videoInfo.title"/>
        </el-form-item>

        <el-form-item label="排序"
                      :rules="[ { required: true, message: '请输入视频排序', trigger: ['blur', 'change']  } ]">
          <el-input-number :min="0" v-model="videoInfo.sort"/>
        </el-form-item>

        <el-form-item label="是否免费">
          <el-radio-group v-model="videoInfo.isFree">
            <el-radio :label="true">免费</el-radio>
            <el-radio :label="false">默认</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="上传视频">
          <UploadVideo ref="upload" :check-video-if-valid="validateVideo"
                       :file="videoInfo.file" v-on:video-change="handleVideoChange"></UploadVideo>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="hiddenAddOrEditVideoDialog">取 消</el-button>
        <el-button v-if="addOrEditVideoDialog.status === 'add'" type="primary"
                   @click="addVideo('addOrEditVideoForm')">添 加
        </el-button>
        <el-button v-else type="primary" @click="updateVideo('addOrEditVideoForm')">更 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import UploadVideo from '@/components/UploadVideo/index';
import videoApi from "@/api/vedio";
import chapterApi from "@/api/chapter";
import vodApi from "@/api/vod";

// 视频信息
const videoInfo = {
  // 课时标题
  title: '标题',
  // 是否免费
  isFree: false,
  // 视频文件信息
  file: {},
  // 阿里云vod生成的视频ID
  vodId: null,
  // 视频文件名称
  videoOriginalName: ''
}

// 章节信息
const chapterInfo = {
  // 章节ID
  id: '',
  // 课程ID
  courseId: '',
  // 标题
  title: '标题',
  // 排序
  sort: ''
}

export default {
  components: {UploadVideo},
  data() {
    return {
      // 全屏loading
      fullscreenLoading: false,
      // 添加模式还是更新模式（默认添加模式add，更新模式为update）
      mode: 'add',
      // 临时存储视频信息的变量
      videoInfo: {...videoInfo},
      // 临时存储章节信息的变量
      chapterInfo: {...chapterInfo},
      // 树形控件
      tree: {
        // 课程章节信息
        chapterList: [{children: []}],
        // 当前正在操作的章节节点
        currentOperateChapterInfo: {...chapterInfo},
        // 当前正在操作的视频节点
        currentOperateVideoInfo: {},
      },
      // 添加/修改视频信息弹窗
      addOrEditVideoDialog: {
        // 是否可见
        Visible: false,
        // 状态(默认添加状态)
        status: 'add'
      },
      // 添加/修改章节信息弹窗
      addOrEditChapterDialog: {
        // 是否可见
        Visible: false,
        // 状态(默认添加状态)
        status: 'add'
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    // 显示loading
    showLoading() {
      this.fullscreenLoading = true
    },

    // 隐藏loading
    hiddenLoading() {
      this.fullscreenLoading = false
    },

    // 显示 添加/编辑视频弹窗
    showAddOrEditVideoInfoDialog() {
      this.addOrEditVideoDialog.Visible = true
    },

    // 隐藏 添加/编辑视频弹窗
    hiddenAddOrEditVideoDialog() {
      this.addOrEditVideoDialog.Visible = false
    },

    // 显示 添加/编辑章节弹窗
    showAddOrEditChapterInfoDialog() {
      this.addOrEditChapterDialog.Visible = true
    },

    // 隐藏 添加/编辑章节弹窗
    hiddenAddOrEditChapterDialog() {
      this.addOrEditChapterDialog.Visible = false
    },

    // 数据初始化
    init() {
      this.reset()
    },

    /**
     * 判断该节点是否有子节点
     * @param data 节点
     * @return {boolean} true有，false没有
     */
    nodeIfHasChildren(data) {
      return data.hasOwnProperty('children')
    },

    /**
     * [添加章节]点击事件
     */
    handleAddChapterEventOfTreeNode() {
      this.chapterInfo = {...chapterInfo}
      this.addOrEditChapterDialog.status = 'add'
      this.showAddOrEditChapterInfoDialog()
    },

    /**
     * [编辑章节]点击事件
     * @param data 章节信息
     */
    handleEditChapterEventOfTreeNode(data) {
      this.chapterInfo = {...data}
      this.tree.currentOperateChapterInfo = data
      this.addOrEditChapterDialog.status = 'edit'
      this.showAddOrEditChapterInfoDialog()
    },

    /**
     * 添加章节信息
     * @param formName element-ui el-form 表单名
     */
    addChapter(formName) {

      this.$refs[formName].validate((valid) => {
        if (valid) {

          let {chapterInfo, mode} = this

          if (mode === 'add') {
            this.tree.chapterList.push({title: chapterInfo.title, sort: chapterInfo.sort, children: []})
            this.hiddenAddOrEditChapterDialog()
          }

          if (mode === 'update') {
            chapterInfo.courseId = this.$route.params.id
            this.showLoading()

            chapterApi.addChapter(chapterInfo)
                .then(() => {
                  this.$emit("init-chapter-list")
                  this.hiddenAddOrEditChapterDialog()
                  this.operateSuccessMessage()
                  this.hiddenLoading()
                })
                .catch(() => {
                  this.hiddenLoading()
                })
          }
        }
      });
    },

    // 更新章节信息
    updateChapter(formName) {

      this.$refs[formName].validate((valid) => {
        if (valid) {

          let {chapterInfo, mode} = this

          if (mode === 'add') {
            this.tree.currentOperateChapterInfo.title = chapterInfo.title
            this.tree.currentOperateChapterInfo.sort = chapterInfo.sort
            this.hiddenAddOrEditChapterDialog()
          }

          if (mode === 'update') {
            this.showLoading()
            chapterApi.updateChapterById(chapterInfo)
                .then(() => {
                  this.$emit("init-chapter-list")
                  this.hiddenAddOrEditChapterDialog()
                  this.operateSuccessMessage()
                  this.hiddenLoading()
                })
                .catch(() => {
                  this.hiddenLoading()
                })
          }
        }
      });
    },

    /**
     * 树形控件的[添加视频]点击事件
     * @param clickedChapterInfo 触发该事件的章节信息
     */
    handleAddVideoEventOfTreeNode(clickedChapterInfo) {
      this.videoInfo = {...videoInfo}
      this.tree.currentOperateChapterInfo = clickedChapterInfo
      this.addOrEditVideoDialog.status = 'add'
      this.showAddOrEditVideoInfoDialog()
    },

    /**
     * 树形控件的[编辑视频]点击事件
     * @param data 视频信息
     */
    handleEditVideoEventOfTreeNode(data) {
      this.videoInfo = {...data}
      this.tree.currentOperateVideoInfo = data
      this.addOrEditVideoDialog.status = 'update'
      this.showAddOrEditVideoInfoDialog()
      if (this.mode === 'update' && data.vodId) {
        this.$nextTick(() => {
          console.log(data)
          this.$refs.upload.fileInit(data)
        })
      }
    },

    /**
     * 添加视频信息
     * @param formName element-ui el-form 表单名
     */
    addVideo(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {

          let {videoInfo, mode} = this

          if (mode === 'add') {
            this.tree.currentOperateChapterInfo.children.push(videoInfo)
            this.hiddenAddOrEditVideoDialog()
          }

          if (mode === 'update') {
            this.showLoading()

            if (this.ifNeedUploadVideoToAliyun(videoInfo)) {
              await this.uploadVideoToAliyun(videoInfo)
            }

            videoInfo.courseId = this.$route.params.id
            videoInfo.chapterId = this.tree.currentOperateChapterInfo.id

            videoApi.addVideo(videoInfo)
                .then(() => {
                  this.$emit("init-chapter-list")
                  this.hiddenAddOrEditVideoDialog()
                  this.operateSuccessMessage()
                  this.hiddenLoading()
                })
                .catch(() => {
                  this.hiddenLoading()
                })
          }
        }
      });
    },

    /**
     * 更新视频信息
     * @param formName element-ui el-form 表单名
     */
    updateVideo(formName) {

      this.$refs[formName].validate(async (valid) => {
        if (valid) {

          let {videoInfo, mode} = this

          if (mode === 'add') {
            this.hiddenAddOrEditVideoDialog()
            for (const [key, value] of Object.entries(this.tree.currentOperateVideoInfo)) {
              this.tree.currentOperateVideoInfo[key] = this.videoInfo[key]
            }
          }

          if (mode === 'update') {
            this.showLoading()

            if (this.ifNeedUploadVideoToAliyun(videoInfo)) {
              await this.uploadVideoToAliyun(videoInfo)
            }

            videoApi.updateVideoById(videoInfo)
                .then(() => {
                  this.$emit("init-chapter-list")
                  this.hiddenAddOrEditVideoDialog()
                  this.operateSuccessMessage()
                  this.hiddenLoading()
                })
                .catch(() => {
                  this.hiddenLoading()
                })
          }
        }
      });
    },

    /**
     * 接收视频的文件信息
     * @param file 文件信息
     */
    handleVideoChange(file) {
      this.videoInfo.file = file
    },

    /**
     * 验证视频是否合规
     * @param file 文件信息
     */
    validateVideo(file) {
      const typeIsVideo = file.raw.type.indexOf("video") !== -1

      if (!typeIsVideo) {
        this.$message.error('只能上传视频')
        return false
      }

      return true
    },


    /**
     * 删除
     * @param node 节点信息
     * @param data 具体数据
     */
    deleteChapterOrVideo(node, data) {

      this.$confirm(`确定删除${data.title}吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

            // 添加模式
            if (this.mode === 'add') {

              this.deleteTreeNode(node, data)
            } else {

              // 修改模式
              // 删除视频
              if (data.hasOwnProperty('vodId')) {

                videoApi.deleteVideoById(data.id).then(() => {
                      this.operateSuccessMessage()
                      this.$emit("init-chapter-list")
                    }
                )
              } else {

                // 删除章节
                chapterApi.deleteChapterById(data.id).then(() => {

                  this.operateSuccessMessage()
                  this.$emit("init-chapter-list")
                })
              }
            }
          }
      )
    },

    // 删除树形控件的节点
    deleteTreeNode(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.title === data.title);
      children.splice(index, 1);
    },

    // 操作成功提示
    operateSuccessMessage() {
      this.$message({
        message: '操作成功',
        type: 'success'
      });
    },

    /**
     * 将所有视频上传至阿里云
     * @param chapterInfo 包括视频的章节信息
     */
    async uploadVideoListToAliyun(chapterInfo) {
      for (let chapter of chapterInfo) {
        for (let i = 0; i < chapter.children.length; i++) {
          let videoInfo = chapter.children[i]

          videoInfo.sort = i
          if (this.ifNeedUploadVideoToAliyun(videoInfo)) {
            await this.uploadVideoToAliyun(videoInfo)
          }
        }
      }
    },

    // 上传视频到阿里云
    async uploadVideoToAliyun(videoInfo) {

      let {file} = videoInfo
      const formData = new FormData();
      formData.append('file', file)

      await vodApi.uploadVideo(formData)
          .then(res => {
            videoInfo.vodId = res.data
            videoInfo.videoOriginalName = file.name
          })
          .catch(err => {
            console.log(err)
            if (this.mode === 'add') {
              throw `[${chapter.title}]章节中的[${videoInfo.title}]的视频上传失败`
            } else {
              throw `视频[${videoInfo.title}]上传失败`
            }
          })
    },

    // 判断是否需要上传视频
    ifNeedUploadVideoToAliyun(videoInfo) {
      if (this.mode === 'add') {
        return videoInfo.file && videoInfo.file.type !== undefined && !videoInfo.vodId
      } else {
        return videoInfo.file && videoInfo.file.type !== undefined
      }
    },

    // 保存信息
    async save() {
      try {
        let {chapterList} = this.tree
        await this.uploadVideoListToAliyun(chapterList)
        return chapterList
      } catch (e) {
        throw e
      }
    },

    // 数据重置
    reset() {
      this.setChapterList([])
    },

    // 设置章节信息
    setChapterList(value) {
      this.tree.chapterList = value
    },

    // 设置模式为更新模式
    setModeToUpdate() {
      this.mode = 'update'
    }
  }
}
</script>

<style scoped lang="scss">
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;

  .title.chapter {
    font-size: 20px;
  }
}
</style>
