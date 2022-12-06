<template>
  <div class="app-container">
    <div class="top-btns">
      <el-button-group>
        <el-button type="primary" size="small" icon="el-icon-plus" @click="createType">新建</el-button>
        <el-button v-if="currentRow!=null" type="primary" size="small" icon="el-icon-edit" @click="editType">编辑</el-button>
        <el-button v-if="currentRow!=null" type="primary" size="small" icon="el-icon-reading" @click="cancelSelected">取消选中</el-button>
        <el-button v-if="currentRow!=null" type="danger" size="small" icon="el-icon-delete" @click="deleteType">删除</el-button>
      </el-button-group>
    </div>
    <div class="table-view">
      <el-table ref="vTable" v-loading="listLoading" :data="list.slice((currentPage-1)*pageSize,currentPage*pageSize)" border fit stripe highlight-current-row :header-cell-style="heaerCellStyle" :cell-style="columnStyle" @current-change="handleCurrentChange">
        <el-table-column v-if="false" label="id">
          <template slot-scope="{ row }">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="25%" label="类型名称" header-align="center" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="65%" label="项目阶段" align="center" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span>{{ row.projectStageNames }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="10%" label="描述" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.description }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="height:20px;width:100%;" />
    <el-pagination :current-page="currentPage" :page-sizes="[10, 20, 30]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="parseInt(total)" @size-change="handleSizeChange" @current-change="handleCurrentPageChange" />
    <el-dialog title="项目类型" :visible.sync="dialogVisible" :close-on-click-modal="false" width="50%" class="project-stage-form-div">
      <el-form ref="postForm" :model="postForm" :rules="rules" label-width="80px">
        <el-form-item v-if="false" label="id" prop="id">
          <el-input v-model="postForm.id" />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="postForm.name" />
        </el-form-item>
        <el-form-item label="包含阶段" prop="projectStageIds">
          <el-checkbox-group v-model="postForm.projectStageIds">
            <el-checkbox v-for="(item ,idx) in projectStage" :key="idx" :label="item.id" :name="item.name" border>{{ item.name }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="描述说明" prop="description">
          <el-input v-model="postForm.description" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import { fetchProjectType, editProjectType, createProjectType, delProjectType, fetchProjectStage } from '@/api/project'
import { heaerCellStyle, columnStyle, array2myString, myString2Array } from '@/utils/commonFunction'
import { deepClone } from '@/utils/index'
export default {
  name: 'ProjectType',
  components: {},
  data() {
    return {
      list: [],
      listLoading: true,
      pageSize: 10,
      currentPage: 1,
      total: 0,
      currentRow: null,
      dialogVisible: false,
      projectStage: [],
      postForm: {
        id: '',
        name: '',
        projectStageIds: [],
        projectStageNames: '',
        description: ''
      },
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        projectStageIds: [
          { type: 'array', required: true, message: '请至少选择一个阶段', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    submit() {
      const that = this
      that.$refs.postForm.validate((valid) => {
        if (valid) {
          let pa = deepClone(that.postForm)
          pa.projectStageIds = array2myString(pa.projectStageIds)
          // 新建
          if (that.postForm.id === '') {
            createProjectType(pa).then((res) => {
              that.$message.success('新建成功！')
              that.list.unshift(res.data)
              that.total++
              that.dialogVisible = false
            }).catch((err) => {
              that.$message.error('新建失败：' + err)
            })
          }
          // 编辑更新
          else {
            editProjectType(pa).then((res) => {
              that.$message.success('更新成功！')
              const idxTem = that.list.findIndex(x => x.id === res.data.id)
              that.list[idxTem] = res.data
              that.dialogVisible = false
            }).catch((err) => {
              that.$message.error('更新失败：' + err)
            })
          }
        }
      })
    },
    // 选中行
    handleCurrentChange(val) {
      this.currentRow = val
    },
    // 取消选中行
    cancelSelected() {
      this.$refs.vTable.setCurrentRow()
    },
    // 获取数据列表
    getList() {
      this.listLoading = true
      this.list = []
      fetchProjectType().then((res) => {
        this.total = res.data.length
        this.list = res.data
        this.listLoading = false
      }).catch((err) => {
        this.$message({
          message: '错误信息：' + err,
          type: 'error'
        })
      })
    },
    createType() {
      fetchProjectStage().then((res) => {
        this.projectStage = res.data
        if (this.$refs.postForm !== undefined) {
          // 这个方法用于重置data属性中的值。
          Object.assign(this.$data.postForm, this.$options.data().postForm)
          // 清空校验信息
          this.$refs.postForm.resetFields()
        }
        this.dialogVisible = true
      }).catch((err) => {
        this.$message({
          message: '错误信息：' + err,
          type: 'error'
        })
      })
    },
    editType() {
      const that = this
      fetchProjectStage().then((res) => {
        that.projectStage = res.data
        if (that.$refs.postForm !== undefined) {
          that.$refs.postForm.clearValidate()
        }
        that.postForm = deepClone(that.currentRow)
        that.postForm.projectStageIds = myString2Array(that.postForm.projectStageIds)
        that.dialogVisible = true
      }).catch((err) => {
        that.$message({
          message: '错误信息：' + err,
          type: 'error'
        })
      })
    },
    deleteType() {
      this.$confirm('永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delProjectType(this.currentRow).then((res) => {
            const idx = this.list.findIndex(a => a.id === this.currentRow.id)
            this.list.splice(idx, 1)
            this.total = this.list.length
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
        })
        .catch((err) => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 每页显示数目变动
    handleSizeChange(val) {
      this.pageSize = val
    },
    // 切换页码
    handleCurrentPageChange(val) {
      this.currentPage = val
    },
    heaerCellStyle,
    columnStyle
  }
}
</script>

<style scoped>
</style>
<style lang="scss">
.project-stage-form-div {
  .el-checkbox.is-bordered.el-checkbox--medium {
    min-width: 225px;
    margin-bottom: 10px;
    margin-left: 0px;
  }
}
</style>
