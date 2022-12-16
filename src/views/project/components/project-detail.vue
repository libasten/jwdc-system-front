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
              <el-form-item label="难易程度" prop="importanceName">
                <el-input v-model="postForm.importanceName"></el-input>
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
                <el-input v-model="postForm.evaluation"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <div style="float:right;overflow:hidden">
                <el-button type="primary" @click="submit">提交更新</el-button>
              </div>
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
                <el-button v-if="node.canEdit" size="small">修改</el-button><br />
                <el-button type="danger" size="small" v-if="node.canDelete">删除</el-button>
              </div>
            </el-card>
          </el-timeline-item>
        </el-timeline>
        <div class="stage-btn">
          <el-button v-if="canAddProjectNote" type="primary" icon="el-icon-chat-line-square" plain>添加备注</el-button>
          <el-button v-if="canAddProjectArchive" type="primary" icon="el-icon-document" plain>添加附件</el-button>
        </div>
      </el-collapse-item>
      <el-collapse-item title="3. 项目合同" name="3">
        <div>该项目还没有合同</div>
      </el-collapse-item>
    </el-collapse>
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

import { fetchProjectDetail, editProjectImportance, createProjectImportance, delProjectImportance } from '@/api/project';
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
      },
      dialogVisible: false,
      stages: [],
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
      }
    };
  },
  props: {
    operateType: {
      type: String,
      default: 'edit',
    }
  },
  created() {
    this.postForm.id = this.$route.params && this.$route.params.id
    this.getProjectDetail()
    this.allDisabled = true
  },
  methods: {
    submit() {
      this.$refs.postForm.validate((valid) => {
        if (valid) {
          // 新建
          // if (this.postForm.id === '') {
          //   createProjectImportance(this.postForm).then((res) => {
          //     this.$message.success('新建成功！')
          //     this.list.unshift(res.data);
          //     this.total++
          //     this.dialogVisible = false
          //   }).catch((err) => {
          //     this.$message.error('新建失败：' + err)
          //   })
        }
        // 编辑更新
        else {
          // editProjectImportance(this.postForm).then((res) => {
          //   this.$message.success('更新成功！')
          //   this.dialogVisible = false
          // }).catch((err) => {
          //   this.$message.error('更新失败：' + err)
          // })
          // }
        }
      })
    },
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
    createImportance() {
      this.postForm = {
        id: '',
        name: '',
        order: '',
        description: ''
      }
      if (this.$refs.postForm !== undefined) {
        this.$refs.postForm.clearValidate()
      }
      this.dialogVisible = true
    },
    editImportance() {
      if (this.$refs.postForm !== undefined) {
        this.$refs.postForm.clearValidate()
      }
      this.postForm = this.currentRow
      this.dialogVisible = true
    },
  },
};
</script>

<style scoped>
.prj-title {
  font-size: 2rem;
  text-align: center;
  margin: 15px 0 15px 0;
  color: #333;
}
</style>
<style lang="scss">
.project-detail {
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
    border-color: #dfe4ed;
    color: #303133;
    cursor: pointer;
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