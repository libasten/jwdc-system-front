<template>
  <!-- 项目详情 -->
  <div class="app-container project-detail">
    <div class="prj-title">{{postForm.name}}</div>
    <el-collapse v-model="activeNames">
      <el-collapse-item title="1. 基本信息" name="1">
        <el-form ref="postForm" :loading="loading" :model="postForm" :rules="rules" label-width="100px" :disabled="allDisabled">
          <el-row>
            <el-col :span="24">
              <el-form-item label="id" v-if="false" prop="id">
                <el-input v-model="postForm.id"></el-input>
              </el-form-item>
              <el-form-item label="名称" prop="name">
                <el-input v-model="postForm.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="编号" prop="code">
                <el-input v-model="postForm.code"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="承担部门" prop="departmentName">
                <el-input v-model="postForm.departmentName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="类型" prop="projectTypeName">
                <el-input v-model="postForm.projectTypeName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="负责人" prop="managerName">
                <el-input v-model="postForm.managerName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="开始时间" prop="startFormat">
                <el-input v-model="postForm.startFormat"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="结束时间" prop="completionFormat">
                <el-input v-model="postForm.completionFormat"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="城市" prop="cityName">
                <el-input v-model="postForm.cityName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="区县" prop="county">
                <el-input v-model="postForm.county"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="乡镇" prop="town">
                <el-input v-model="postForm.town"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="难易程度" prop="importanceName">
                <el-input v-model="postForm.importanceName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="甲方名称" prop="partA">
                <el-input v-model="postForm.partA"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="甲方联系人" prop="partAContact">
                <el-input v-model="postForm.partAContact"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="甲方电话" prop="partAPhone">
                <el-input v-model="postForm.partAPhone"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="项目评价" prop="evaluation">
                <el-input type="textarea" v-model="postForm.evaluation"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-collapse-item>
      <el-collapse-item title="2. 进度节点" name="2">
        <!-- 用时间线实现节点信息，timestamp是阶段名称 -->
        <el-timeline>
          <el-timeline-item v-for="(stage, index) in stages" :key="index" :timestamp="stage.name" placement="top" size="large" icon="el-icon-location-information" type="primary" class="node-item-container">
            <el-card v-for="(node, idx) in stage.nodes" :key="idx" :class="[{leftNote: node.nodeType==2},{leftArchive:node.nodeType===1}]">
              <div v-if="node.nodeType===2">
                <div class="type-name">{{node.noteTypeName}}</div>
                <div class="node-content">{{node.content}}</div>
              </div>
              <div v-if="node.nodeType===1">
                <div class="type-name">{{node.archiveTypeName}}</div>
                <div class="node-content archive" title="点击下载该文件"><i class="el-icon-tickets"></i> {{node.name}}</div>
              </div>
              <div class="edit-info">{{node.updaterName}} @ {{node.updateTimeFormat}} <span v-if="node.nodeType===1"> | {{node.location}}</span></div>
              <div class="right-btns">
                <el-button v-if="node.canEdit" size="small" @click.native="editNode(node)">修改</el-button><br />
                <el-button type="danger" size="small" v-if="node.canDelete" @click.native="deleteNode(node)">删除</el-button>
              </div>
            </el-card>
          </el-timeline-item>
        </el-timeline>
        <div class="stage-btn">
          <el-button v-if="canAddProjectNote" type="primary" icon="el-icon-chat-line-square" plain @click.native="addNote">添加备注</el-button>
          <el-button v-if="canAddProjectArchive" type="primary" icon="el-icon-document" plain @click.native="addArchive">添加附件</el-button>
        </div>
      </el-collapse-item>
      <el-collapse-item title="3. 项目合同" name="3">
        <div>开票回款信息放到这里</div>
        <div>该项目还没有合同</div>
      </el-collapse-item>
      <el-collapse-item title="4. 招投标" name="4">
        <div>该项目还没有招投标信息</div>
        <div>市场负责人信息放在这里，参考需求Excel</div>
      </el-collapse-item>
    </el-collapse>
    <el-dialog title="项目节点备注" :visible.sync="dialogVisibleNote" :close-on-click-modal="false" width="50%">
      <el-form ref="noteForm" :model="noteForm" :rules="rules" label-width="80px">
        <el-form-item label="id" v-if="false" prop="id">
          <el-input v-model="noteForm.id"></el-input>
        </el-form-item>
        <el-form-item label="项目阶段" prop="projectStageId">
          <el-select v-model="noteForm.projectStageId" placeholder="请选择阶段">
            <el-option v-for="(item,idx) in stages" :key="idx" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注类型" prop="noteTypeId">
          <el-select v-model="noteForm.noteTypeId" placeholder="请选择阶段">
            <el-option v-for="(item,idx) in noteTypes" :key="idx" :label="item.text" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注内容" prop="content">
          <el-input type="textarea" v-model="noteForm.content"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleNote = false">取 消</el-button>
        <el-button type="primary" @click="noteSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="项目节点附件" :visible.sync="dialogVisibleArchive" :close-on-click-modal="false" width="50%">
      <el-form ref="archiveForm" :model="archiveForm" :rules="rules" label-width="78px">
        <el-form-item label="id" v-if="false" prop="id">
          <el-input v-model="archiveForm.id"></el-input>
        </el-form-item>
        <el-form-item label="项目阶段" prop="projectStageId">
          <el-select v-model="archiveForm.projectStageId" placeholder="请选择阶段">
            <el-option v-for="(item,idx) in stages" :key="idx" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="附件类型" prop="archiveTypeId">
          <el-select v-model="archiveForm.archiveTypeId" placeholder="请选择阶段">
            <el-option v-for="(item,idx) in archiveTypes" :key="idx" :label="item.text" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="上传时间" prop="date">
              <el-date-picker v-model="archiveForm.date" :clearable="false"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上传地点" prop="location">
              <el-input v-model="archiveForm.location"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="附件名称" prop="name">
          <el-input v-model="archiveForm.name"></el-input>
        </el-form-item>
        <!-- 这里的上传路径随便填，因为重写了上传方法 -->
        <el-upload class="upload-component" ref="upload" action="null" :http-request="archiveSubmit" :file-list="fileList" :auto-upload="false" :multiple="false" :on-change="handleFileChange" :on-remove="handleFileRemove" drag>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em><br>文件大小不超过500M</div>
        </el-upload>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleArchive = false">取 消</el-button>
        <el-button type="primary" @click="archiveSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import {
  fetchProjectDetail,
  newProjectNote, fetchProjectNote, createProjectNote, editProjectNote, delProjectNote,
  newProjectArchive, fetchProjectArchive, createProjectArchive, editProjectArchive, delProjectArchive
} from '@/api/project';
export default {
  name: 'ProjectDetail',
  data() {
    return {
      loading: true,
      activeNames: ['2'],
      allDisabled: false,
      canAddProjectNote: true,
      canAddProjectArchive: true,
      postForm: {
        id: '', //当前项目的id，也是路由入参
        name: '',
        code: '',
        projectTypeName: '',
        startFormat: '',
        completionFormat: '',
        departmentName: '',
        managerName: '',
        importanceName: '',
        cityName: '',
        county: '',
        town: '',
        partA: '',
        partAContact: '',
        partAPhone: '',
        projectStage: []
      },
      dialogVisibleNote: false,
      noteForm: {
        id: '',
        projectId: '',
        projectStageId: '',
        noteTypeId: '',
        content: '',
      },
      dialogVisibleArchive: false,
      archiveForm: {
        id: '',
        projectId: '',
        projectStageId: '',
        archiveTypeId: '',
        date: new Date(),
        location: '',
        name: '',
      },
      stages: [],
      noteTypes: [],
      archiveTypes: [],
      fileList: [],
      archiveFile: '',
      rules: {
        projectStageId: [{ required: true, message: '请选择阶段', trigger: 'blur' }],
        noteTypeId: [{ required: true, message: '请选择类型', trigger: 'blur' }],
        noteContent: [{ required: true, message: '请输入内容', trigger: 'blur' }],
        archiveTypeId: [{ required: true, message: '请选择附件类型', trigger: 'blur' }],
        date: [{ required: true, message: '请选择日期', trigger: 'blur' }],
        name: [{ required: true, message: '请输入文件名称', trigger: 'change' }],
      }
    };
  },
  props: {},
  created() {
    this.postForm.id = this.$route.params && this.$route.params.id
    this.getProjectDetail()
    this.allDisabled = true
  },
  methods: {
    // 获取数据列表
    getProjectDetail() {
      this.loading = true;
      this.list = [];
      fetchProjectDetail(this.postForm.id).then((res) => {
        console.log(res.data)
        this.postForm = res.data.project
        this.postForm.managerName = res.data.projectManager
        this.stages = res.data.project.projectStages
        this.canAddProjectNote = res.data.canAddProjectNote
        this.canAddProjectArchive = res.data.canAddProjectArchive
        this.loading = false
      }).catch((err) => {
        this.$message({
          message: '错误信息：' + err,
          type: 'error'
        });
      });
    },
    addNote() {
      newProjectNote().then((res) => {
        this.noteTypes = res.data.projectNoteTypes
        if (this.$refs.noteForm !== undefined) {
          // 清空校验信息
          this.$refs.noteForm.resetFields()
        }
        // 这个方法用于重置data属性中的值。
        Object.assign(this.$data.noteForm, this.$options.data().noteForm)
        this.dialogVisibleNote = true
      }).catch((err) => { this.$message.error('错误信息：' + err,) })
    },
    editNode(data) {
      const that = this
      fetchProjectNote(data.id).then((res) => {
        this.noteTypes = res.data.projectNoteTypes
        if (that.$refs.noteForm !== undefined) {
          that.$refs.noteForm.clearValidate()
        }
        that.noteForm = res.data.projectNote
        that.dialogVisibleNote = true
      }).catch((err) => { this.$message.error('错误信息：' + err,) })
    },
    noteSubmit() {
      this.$refs.noteForm.validate((valid) => {
        if (valid) {
          this.noteForm.projectId = this.postForm.id
          // 新建
          if (this.noteForm.id === '') {
            createProjectNote(this.noteForm).then((res) => {
              const idx = this.stages.findIndex(x => x.id === this.noteForm.projectStageId)
              if (this.stages[idx].nodes === null) {
                this.stages[idx].nodes = [res.data]
              }
              else {
                this.stages[idx].nodes.unshift(res.data)
              }
              this.$message.success('新建成功！')
              this.dialogVisibleNote = false
            }).catch((err) => { this.$message.error('新建失败：' + err) })
          }
          // 编辑更新
          else {
            editProjectNote(this.noteForm).then((res) => {
              const idx = this.stages.findIndex(x => x.id === this.noteForm.projectStageId)
              const idy = this.stages[idx].nodes.findIndex(y => y.id === this.noteForm.id)
              this.stages[idx].nodes[idy] = res.data
              this.$message.success('更新成功！')
              this.dialogVisibleNote = false
            }).catch((err) => { this.$message.error('更新失败：' + err) })
          }
        }
      })
    },
    // 删除节点中的卡片，含有备注和附件
    deleteNode(data) {
      this.$confirm('永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        if (data.noteTypeId !== undefined) {
          delProjectNote(data).then((res) => {
            const idx = this.stages.findIndex(x => x.id === data.projectStageId)
            const idy = this.stages[idx].nodes.findIndex(y => y.id === data.id)
            this.stages[idx].nodes.splice(idy, 1)
            this.$message.success('删除成功！');
          });
        }
        else {
          delProjectArchive(data).then((res) => {
            const idx = this.stages.findIndex(x => x.id === data.projectStageId)
            const idy = this.stages[idx].nodes.findIndex(y => y.id === data.id)
            this.stages[idx].nodes.splice(idy, 1)
            this.$message.success('删除成功！');
          });
        }
      }).catch((err) => { this.$message.info('删除操作已取消'); });
    },

    addArchive() {
      newProjectArchive().then((res) => {
        this.archiveTypes = res.data.projectArchiveTypes
        if (this.$refs.archiveForm !== undefined) {
          // 清空校验信息
          this.$refs.archiveForm.resetFields()
        }
        // 这个方法用于重置data属性中的值。
        Object.assign(this.$data.archiveForm, this.$options.data().archiveForm)
        this.dialogVisibleArchive = true
      }).catch((err) => { this.$message.error('错误信息：' + err,) })
    },
    handleFileChange(file, fileList) {
      this.archiveForm.name = file.name
      this.fileList = [{ name: file.name }]
      this.archiveFile = file
    },
    handleFileRemove(file, fileList) {
      this.archiveForm.name = ''
      this.fileList = []
    },
    archiveSubmit() {
      this.$refs.archiveForm.validate((valid) => {
        if (valid) {
          // todo: 判断是更新还是新建
          if (this.fileList.length < 1) {
            this.$message.warning("请选择一个文件再提交！")
            return
          }
          const formData = new FormData()
          formData.append('file', this.archiveFile.raw)
          this.archiveForm.projectId = this.postForm.id
          createProjectArchive(this.archiveForm, formData).then(res => {
            const idx = this.stages.findIndex(x => x.id === this.archiveForm.projectStageId)
            if (this.stages[idx].nodes === null) {
              this.stages[idx].nodes = [res.data]
            }
            else {
              this.stages[idx].nodes.unshift(res.data)
            }
            this.$message.success('上传附件成功！')
            this.dialogVisibleArchive = false
          }).catch(err => { this.$message.error("上传失败！") })
        }
      })
    },
  },
};
</script>

<style scoped>
</style>
<style lang="scss">
.project-detail {
  .prj-title {
    font-size: 2rem;
    text-align: center;
    margin: 15px 0 15px 0;
    color: #333;
  }
  .el-collapse-item__header {
    font-size: 1rem;
    background-color: #f5f5f7;
    border-left: 5px solid #72b8ff;
    padding-left: 15px;
    &.is-active {
      border-left: 5px solid #0a76e2;
    }
  }
  .el-input.is-disabled .el-input__inner {
    background-color: #f5f7fa;
    border-color: #fff;
    border-bottom: 1px solid #ccc;
    color: #303133;
    cursor: pointer;
  }
  .el-select,
  .el-date-editor {
    width: 100%;
  }
  .el-timeline-item__tail {
    border-left-color: #0a76e2;
  }
  .el-timeline-item__node--large {
    width: 30px;
    height: 30px;
    left: -10px;
    .el-timeline-item__icon {
      font-size: 16px;
    }
  }
  .el-timeline-item__timestamp {
    font-size: 16px;
    padding-left: 5px;
    padding-top: 10px;
    color: #303133;
    width: 300px;
    margin-bottom: 20px;
  }
  .el-collapse-item__content {
    padding: 15px 10px;
  }
  .upload-component {
    margin-top: -5px;
    .el-upload {
      width: 100%;
    }
    .el-upload-dragger {
      width: 100%;
      height: 60px;
      .el-upload__text {
        margin-top: 15px;
        line-height: 18px;
        font-size: 0.6rem;
      }
    }
  }
}
.node-item-container {
  .leftNote {
    border-left: 4px solid #1e7e34;
  }
  .leftArchive {
    border-left: 4px solid #ff851b;
  }
  .el-card {
    margin-top: 10px;
    margin-bottom: 10px;
    position: relative;
    &:last-child {
      margin-bottom: 0px;
    }
  }
  .el-card__body {
    padding: 10px 20px;
    .right-btns {
      position: absolute;
      top: 1rem;
      right: 1rem;
      .el-button {
        margin-top: 10px;
        &:first-child {
          margin-top: 0;
        }
      }
    }
  }
  .el-timeline-item__timestamp {
    font-size: 1.1rem !important;
  }
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
      color: #0e82f5;
    }
  }
}
</style>