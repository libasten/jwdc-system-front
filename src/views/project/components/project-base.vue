<template>
  <!-- 项目基本信息 -->
  <div class="app-container project-base" v-loading="loading">
    <el-form ref="postForm" :loading="loading" :model="postForm" :rules="rules" label-width="100px">
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
            <el-tooltip content="编号由系统自动生成，无需编辑。" placement="top">
              <el-input v-model="postForm.code" disabled></el-input>
            </el-tooltip>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="承担部门" prop="departmentId">
            <el-select v-model="postForm.departmentId" placeholder="请选择部门" clearable>
              <el-option v-for="(item,idx) in departments" :key="idx" :label="item.text" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="类型" prop="type">
            <el-select v-model="postForm.projectTypeId" placeholder="请选择类型" @visible-change="beforeTypeChange" @change="typeChanged">
              <el-option v-for="(item,idx) in projectTypes" :key="idx" :label="item.text" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="进度" prop="progress">
            <el-select v-model="postForm.progress" placeholder="请选择进度">
              <el-option v-for="(item,idx) in projectStagesFilter" :key="idx" :label="item.text" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="难易程度" prop="importanceId">
            <el-select v-model="postForm.importanceId" placeholder="请选择难易程度">
              <el-option v-for="(item,idx) in importances" :key="idx" :label="item.text" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="合同金额" prop="contractAmount">
            <el-input v-model="postForm.contractAmount"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="城市" prop="cityId">
            <el-select v-model="postForm.cityId" placeholder="请选择市">
              <el-option v-for="(item,idx) in citys" :key="idx" :label="item.text" :value="item.id"></el-option>
            </el-select>
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
          <el-form-item label="开始时间" prop="start">
            <el-date-picker v-model="postForm.start" type="date" placeholder="选择日期" :clearable="false"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="结束时间" prop="completion">
            <el-date-picker v-model="postForm.completion" type="date" placeholder="选择日期" :clearable="false"></el-date-picker>
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
          <el-form-item label="项目合同" prop="contractIds">
            <el-select v-model="postForm.contractIds" placeholder="请选择合同" filterable multiple>
              <el-option v-for="(item,idx) in contracts" :key="idx" :label="item.text" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="项目投标" prop="bidIds">
            <el-select v-model="postForm.bidIds" placeholder="请选择投标" filterable multiple>
              <el-option v-for="(item,idx) in bids" :key="idx" :label="item.text" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="项目评价" prop="evaluation">
            <el-input type="textarea" v-model="postForm.evaluation"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <div style="float:right;overflow:hidden">
            <el-button type="primary" @click="submit">提交确定</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>

import { fetchProjectBase, newProjectBase, createProject, editProject } from '@/api/project';
import { array2myString, myString2Array } from '@/utils/commonFunction'
export default {
  name: 'ProjectBase',
  data() {
    return {
      loading: true,
      resData: '',//从后台返回的完成内容
      postForm: {
        id: '', //当前项目的id，也是路由入参
        name: '',
        code: '',
        projectTypeId: '',
        // 进度，在编辑项目的时候就是阶段节点，由枚举值类型决定
        progress: '',
        start: '',
        completion: '',
        departmentName: '',
        importanceId: '',
        cityId: '',
        county: '',
        town: '',
        contractAmount: '',
        partA: '',
        partAContact: '',
        partAPhone: '',
        evaluation: '',
        bidIds: '',
        contractIds: ''
      },
      citys: [],
      contracts: [],
      departments: [],
      importances: [],
      projectTypes: [],
      projectTypeStages: '',
      bids: [],
      contracts: [],
      oldProjectTypeId: '', //旧的项目类型ID，用于用户想修改之前的记录，因为修改后会触发进度变动，给用户提醒时候用。
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        start: [{ required: true, message: '请选择开始时间', trigger: 'blur' }],
      }
    };
  },
  created() {
    this.postForm.id = this.$route.params && this.$route.params.id
    // 无id,则新建
    if (this.postForm.id === undefined) {
      this.getNewProjectEnum()
    }
    // 编辑
    else {
      this.getProjectBase()
    }
  },
  computed: {
    // 阶段由类型筛选
    projectStagesFilter() {
      return this.projectTypeStages[this.postForm.projectTypeId]
    },
  },
  mounted() {
  },
  methods: {
    submit() {
      // 记得处理合同和投标的ids入参是数组加逗号形式。
      this.$refs.postForm.validate((valid) => {
        if (valid) {
          this.postForm.bidIds = this.array2myString(this.postForm.bidIds)
          this.postForm.contractIds = this.array2myString(this.postForm.contractIds)
          // 新建
          if (this.postForm.id === undefined) {
            createProject(this.postForm).then((res) => {
              this.$router.push({ path: '/project/edit/' + res.data.id })
              this.$message.success('新建成功！')
            }).catch((err) => {
              this.$message.error('新建失败：' + err)
            })
          }
          // 编辑更新
          else {
            editProject(this.postForm).then((res) => {
              this.getProjectBase()
              this.$message.success('更新成功！')
            }).catch((err) => {
              this.$message.error('更新失败：' + err)
            })
          }
        }
      })
    },
    // 获取项目基本信息
    getProjectBase() {
      this.loading = true
      fetchProjectBase(this.postForm.id).then((res) => {
        console.log(res.data)
        this.citys = res.data.citys
        this.departments = res.data.departments
        this.projectTypes = res.data.projectTypes
        this.projectTypeStages = res.data.projectTypeStages
        this.importances = res.data.importances
        this.bids = res.data.bids
        this.contracts = res.data.contracts
        this.postForm = res.data.project
        this.postForm.departmentId = this.postForm.departmentId === 0 ? '' : this.postForm.departmentId
        this.postForm.cityId = this.postForm.cityId === 0 ? '' : this.postForm.cityId
        this.postForm.importanceId = this.postForm.importanceId === 0 ? '' : this.postForm.importanceId
        this.postForm.projectTypeId = this.postForm.projectTypeId === 0 ? '' : this.postForm.projectTypeId
        this.postForm.progress = this.postForm.progress === 0 ? '' : this.postForm.progress
        this.postForm.bidIds = this.myString2Array(this.postForm.bidIds)
        this.postForm.contractIds = this.myString2Array(this.postForm.contractIds)
        this.loading = false
      }).catch((err) => {
        this.$message({
          message: '错误信息：' + err,
          type: 'error'
        });
      });
    },
    // 获取创建项目时候的枚举信息
    getNewProjectEnum() {
      this.loading = true
      newProjectBase().then((res) => {
        this.postForm.start = new Date()
        this.postForm.completion = new Date()
        this.postForm.invoiceDate = new Date()
        this.postForm.refundDate = new Date()
        this.citys = res.data.citys
        this.departments = res.data.departments
        this.projectTypes = res.data.projectTypes
        this.projectTypeStages = res.data.projectTypeStages
        this.importances = res.data.importances
        this.bids = res.data.bids
        this.contracts = res.data.contracts
        this.loading = false
      }).catch((err) => {
        this.$message.error('错误信息：' + err)
      })
    },
    beforeTypeChange(co) {
      if (co) { this.oldProjectTypeId = this.postForm.projectTypeId }
    },
    // 项目类型变换
    typeChanged() {
      console.log(this.postForm.projectTypeId)
      this.$confirm('修改项目类型会影响项目进度, 是否确认修改?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => { this.postForm.progress = 1 }).catch(err => {
        this.$message.info('操作已取消')
        this.postForm.projectTypeId = this.oldProjectTypeId
      });
    },
    myString2Array, array2myString
  },
};
</script>

<style scoped>
</style>
<style lang="scss">
.project-base {
  .el-input.is-disabled .el-input__inner {
    background-color: #f5f7fa;
    border-color: #dfe4ed;
    color: #303133;
    cursor: pointer;
  }
  .el-select,
  .el-date-editor {
    width: 100%;
  }
}
</style>