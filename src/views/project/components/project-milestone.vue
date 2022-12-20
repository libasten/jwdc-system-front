<template>
  <!-- 项目成员任命组件 -->
  <div class="">
    <div class="top-btns">
      <el-button-group>
        <el-button type="primary" size="small" icon="el-icon-plus" @click="addMilestone">新建</el-button>
        <el-button v-if="currentRow!=null" type="primary" size="small" icon="el-icon-view" @click="editMilestone">编辑</el-button>
        <el-button v-if="currentRow!=null" type="primary" size="small" icon="el-icon-reading" @click.native="cancelSelected">取消选中</el-button>
        <el-button v-if="currentRow!=null" type="danger" size="small" icon="el-icon-delete" @click="deleteMilestone">删除</el-button>
      </el-button-group>
    </div>
    <div class="table-view">
      <el-table v-loading="listLoading" ref="vTable" :data="list" border fit stripe highlight-current-row :header-cell-style="heaerCellStyle" @current-change="handleCurrentChange">
        <el-table-column label="id" v-if="false">
          <template slot-scope="{ row }">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="75%" label="里程碑名称" align="center" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="25%" label="时间" align="center" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span>{{ row.dateFormat }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="项目里程碑" :visible.sync="dialogVisible" append-to-body :close-on-click-modal="false" width="56%">
      <el-form ref="postForm" :model="postForm" :rules="rules" label-width="80px" class="dialog-form">
        <el-form-item label="里程碑" prop="name">
          <el-input v-model="postForm.name"></el-input>
        </el-form-item>
        <el-form-item label="日期" prop="date">
          <el-date-picker v-model="postForm.date"></el-date-picker>
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

import { fetchMilestoneList, createPrjMilestone, editPrjMilestone, deletePrjMilestone } from '@/api/project';
import { heaerCellStyle, columnStyle, array2myString, myString2Array } from '@/utils/commonFunction'
import { deepClone } from '@/utils/index'

export default {
  name: 'ProjectMilestone',
  components: {},
  data() {
    return {
      rules: {
        name: [{ required: true, message: '请输入里程碑信息', trigger: 'blur' }],
      },
      list: [],
      listLoading: true,
      staffs: '',
      currentRow: null,
      dialogVisible: false,
      postForm: {
        id: '',
        projectId: '',
        name: '',
        date: new Date()
      },
    };
  },
  props: {
    projectId: { type: Number, default: 0 }
  },
  created() {
    this.getList()
    this.postForm.projectId = this.projectId
  },
  methods: {
    submit() {
      this.$refs.postForm.validate((valid) => {
        if (valid) {
          let that = this
          that.postForm.projectId = that.projectId
          // 新建
          if (that.postForm.id === '') {
            createPrjMilestone(that.postForm).then((res) => {
              that.getList()
              that.$message.success('新建成功！')
              that.dialogVisible = false
            }).catch((err) => {
              that.$message.error('新建失败：' + err)
            })
          }
          // 编辑更新
          else {
            editPrjMilestone(that.postForm).then((res) => {
              that.getList()
              that.$message.success('更新成功！')
              that.dialogVisible = false
            }).catch((err) => {
              that.$message.error('更新失败：' + err)
            })
          }
        }
      })
    },
    // 获取人员任命列表
    getList() {
      let that = this
      that.listLoading = true;
      that.list = [];
      fetchMilestoneList(this.projectId).then((res) => {
        that.list = res.data.milestones.filter(x => x.status === 1)
        that.listLoading = false
      }).catch((err) => {
        that.$message({
          message: '错误信息：' + err,
          type: 'error'
        });
      });
    },
    addMilestone() {
      if (this.$refs.postForm !== undefined) {
        // 清空校验信息
        this.$refs.postForm.resetFields()
        // 这个方法用于重置data属性中的值。
        Object.assign(this.$data.postForm, this.$options.data().postForm)
      }
      this.dialogVisible = true
    },
    editMilestone() {
      if (this.$refs.postForm !== undefined) {
        this.$refs.postForm.clearValidate()
      }
      this.postForm = deepClone(this.currentRow)
      console.log(this.postForm)
      this.dialogVisible = true
    },
    deleteMilestone() {
      this.$confirm('永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          deletePrjMilestone(this.currentRow).then((res) => {
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
    // 选中行
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    // 取消选中行
    cancelSelected() {
      this.$refs.vTable.setCurrentRow();
    },
    array2myString, myString2Array,
    heaerCellStyle, columnStyle
  },
};
</script>

<style scoped>
</style>
<style lang="scss">
.dialog-form {
  .el-select,
  .el-date-editor {
    width: 100%;
  }
}
</style>