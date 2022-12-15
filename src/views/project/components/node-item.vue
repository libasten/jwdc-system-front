<template>
  <!-- 项目阶段节点组件 -->
  <div class="node-item-container">
    <el-card :class="[{leftNote: nodeItem.nodeType==2},{leftArchive:nodeItem.nodeType===1}]">
      <div v-if="nodeItem.nodeType===2">
        <div class="type-name">{{nodeItem.noteTypeName}}</div>
        <div class="node-content">{{nodeItem.content}}</div>
      </div>
      <div v-if="nodeItem.nodeType===1">
        <div class="type-name">{{nodeItem.archiveTypeName}}</div>
        <div class="node-content archive" title="点击下载该文件"><i class="el-icon-tickets"></i> {{nodeItem.name}}</div>
      </div>
      <div class="edit-info">{{nodeItem.updaterName}} @ {{nodeItem.updateTimeFormat}} <span v-if="nodeItem.nodeType===1"> | {{nodeItem.location}}</span></div>
      <div class="right-btns">
        <el-button v-if="nodeItem.canEdit" size="small">修改</el-button><br /><br />
        <el-button type="danger" size="small" v-if="nodeItem.canDelete">删除</el-button>
      </div>
    </el-card>
    <!-- <el-dialog title="项目节点备注" :visible.sync="dialogVisibleNote" :close-on-click-modal="false" width="50%">
      <el-form ref="noteForm" :model="noteForm" :rules="rules" label-width="80px">
        <el-form-stageItem label="id" v-if="false" prop="id">
          <el-input v-model="noteForm.id"></el-input>
        </el-form-stageItem>
        <el-form-stageItem label="名称" prop="name">
          <el-input v-model="noteForm.name"></el-input>
        </el-form-stageItem>
        <el-form-stageItem label="排序" prop="order">
          <el-input-number v-model="noteForm.order" :min="1" :max="100" :step="1" label="排序" style="width:100%"></el-input-number>
        </el-form-stageItem>
        <el-form-stageItem label="描述" prop="description">
          <el-input v-model="noteForm.description"></el-input>
        </el-form-stageItem>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleNote = false">取 消</el-button>
        <el-button type="primary" @click="NoteSubmit">确 定</el-button>
      </span>
    </el-dialog> -->
    <!-- <el-dialog title="项目节点备注" :visible.sync="dialogVisibleArchive" :close-on-click-modal="false" width="50%">
      <el-form ref="archiveForm" :model="archiveForm" :rules="rules" label-width="80px">
        <el-form-stageItem label="id" v-if="false" prop="id">
          <el-input v-model="archiveForm.id"></el-input>
        </el-form-stageItem>
        <el-form-stageItem label="名称" prop="name">
          <el-input v-model="archiveForm.name"></el-input>
        </el-form-stageItem>
        <el-form-stageItem label="排序" prop="order">
          <el-input-number v-model="archiveForm.order" :min="1" :max="100" :step="1" label="排序" style="width:100%"></el-input-number>
        </el-form-stageItem>
        <el-form-stageItem label="描述" prop="description">
          <el-input v-model="archiveForm.description"></el-input>
        </el-form-stageItem>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleArchive = false">取 消</el-button>
        <el-button type="primary" @click="ArchiveSubmit">确 定</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script>

import { fetchProjectStage, editProjectStage, createProjectStage, delProjectStage } from '@/api/project';
export default {
  name: 'NodeItem',
  components: {},
  props: {
    nodeItem: { type: Object, default: function () { return {} } },
    //#region 备用属性
    // itemInfo: {
    //   id: {
    //     type: Number,
    //     default: 0,
    //   },
    //   name: {},
    //   nodes: [{
    //     nodeType: {
    //       // 节点标注类型 1附件 2备注
    //       type: Number,
    //       default: 1,
    //     },
    //     noteTypeId: {
    //       // 文字备注中的类型值
    //       type: Number,
    //       default: 1,
    //     },
    //     noteTypeName: {
    //       // 文字备注中的类型文本
    //       type: String,
    //       default: '',
    //     },
    //     status: {
    //       // 0表示被删除 1正常显示
    //       type: Number,
    //       default: 0,
    //     },
    //     content: {
    //       // 只有在nodeType=2的时候才有
    //       type: String,
    //       default: '',
    //     },
    //     projectId: {
    //       // 归属项目ID
    //       type: Number,
    //       default: 0,
    //     },
    //     projectStageId: {
    //       // 归属项目阶段ID
    //       type: Number,
    //       default: 0,
    //     },
    //     noterId: {
    //       // 备注人ID
    //       type: Number,
    //       default: 0,
    //     },
    //     noterName: {
    //       // 备注人姓名
    //       type: String,
    //       default: '',
    //     },
    //     updaterId: {
    //       // 更新人ID
    //       type: Number,
    //       default: 0,
    //     },
    //     updaterName: {
    //       // 更新人姓名
    //       type: String,
    //       default: '',
    //     },
    //     updateTime: {
    //       // 更新时间 - 原始时间格式
    //       type: String,
    //       default: '',
    //     },
    //     updateTimeFormat: {
    //       // 更新时间 - 格式化后的
    //       type: String,
    //       default: '',
    //     },
    //     createTime: {
    //       // 创建时间 - 原始时间格式
    //       type: String,
    //       default: '',
    //     },
    //     createTimeFormat: {
    //       // 创建时间 - 格式化后的
    //       type: String,
    //       default: '',
    //     },
    //     canEdit: {
    //       // 编辑权限
    //       type: Boolean,
    //       default: true,
    //     },
    //     canDelete: {
    //       // 删除权限
    //       type: Boolean,
    //       default: true,
    //     },
    //     // 以下属性是附件节点独享
    //     archiveTypeId: {
    //       // 附件类别ID
    //       type: Number,
    //       default: 0,
    //     },
    //     archiveTypeName: {
    //       // 附件类别文字名称
    //       type: String,
    //       default: '',
    //     },
    //     name: {
    //       // 附件显示名称
    //       type: String,
    //       default: '',
    //     },
    //     location: {
    //       // 上传地点
    //       type: String,
    //       default: '',
    //     },
    //     guid: {
    //       // 文件guid
    //       type: String,
    //       default: '',
    //     },
    //     url: {
    //       // 文件URL
    //       type: String,
    //       default: '',
    //     },
    //   }
    //   ]
    // }
    //#endregion
  },
  data() {
    return {
      dialogVisibleNote: false,
      dialogVisibleArchive: false,
      noteForm: {
        id: '',
        name: '',
        order: '',
        description: ''
      },
      archiveForm: {
        id: '',
        name: '',
        order: '',
        description: ''
      },
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
      }
    };
  },
  created() {
  },
  methods: {
    NoteSubmit() {
      this.$refs.noteForm.validate((valid) => {
        if (valid) {
          // 新建
          if (this.noteForm.id === '') {
            // createProjectStage(this.noteForm).then((res) => {
            //   this.$message.success('新建成功！')
            // }).catch((err) => {
            //   this.$message.error('新建失败：' + err)
            // })
          }
          // 编辑更新
          else {
            // editProjectStage(this.noteForm).then((res) => {
            //   this.$message.success('更新成功！')
            //   this.dialogVisible = false
            // }).catch((err) => {
            //   this.$message.error('更新失败：' + err)
            // })
          }
        }
      })
    },
    ArchiveSubmit() {
      this.$refs.archiveForm.validate((valid) => {
        if (valid) {
          // 新建
          if (this.archinveForm.id === '') {
            // createProjectStage(this.noteForm).then((res) => {
            //   this.$message.success('新建成功！')
            // }).catch((err) => {
            //   this.$message.error('新建失败：' + err)
            // })
          }
          // 编辑更新
          else {
            // editProjectStage(this.noteForm).then((res) => {
            //   this.$message.success('更新成功！')
            //   this.dialogVisible = false
            // }).catch((err) => {
            //   this.$message.error('更新失败：' + err)
            // })
          }
        }
      })
    },
    createStage() {
      this.noteForm = {
        id: '',
        name: '',
        order: '',
        description: ''
      }
      if (this.$refs.noteForm !== undefined) {
        this.$refs.noteForm.clearValidate()
      }
      this.dialogVisible = true
    },
    editStage() {
      if (this.$refs.noteForm !== undefined) {
        this.$refs.noteForm.clearValidate()
      }
      this.noteForm = this.currentRow
      this.dialogVisible = true
    },
    deleteStage() {
      this.$confirm('永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          delProjectStage(this.currentRow).then((res) => {
            const idx = this.list.findIndex(a => a.id === this.currentRow.id)
            this.list.splice(idx, 1);
            this.total = this.list.length;
            this.$message({
              type: 'success',
              message: '删除成功!',
            });
          });
        })
        .catch((err) => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          });
        });
    },
  },
};
</script>

<style scoped lang="scss">
</style>
<style lang="scss">
.node-item-container {
  position: relative;
  .leftNote {
    border-left: 4px solid #1e7e34;
  }
  .leftArchive {
    border-left: 4px solid #ff851b;
  }
  .el-card__body {
    padding: 10px 20px;
  }
  .el-timeline-item__timestamp {
    font-size: 1.1rem !important;
  }
  margin-top: 10px;
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 0px;
  }
  .type-name,
  .edit-info {
    color: #606266;
  }
  .node-content {
    font-size: 1rem;
    margin: 5px 0;
    &.archive {
      cursor: pointer;
      color: #268ef7;
    }
  }
  .right-btns {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }
}
</style>