<template>
  <!-- 项目成员任命组件 -->
  <div class="">
    <div class="top-btns">
      <el-button-group>
        <el-button type="primary" size="small" icon="el-icon-plus" @click="addAppoint">新建</el-button>
        <el-button v-if="currentRow!=null" type="primary" size="small" icon="el-icon-view" @click="editAppoint">编辑</el-button>
        <el-button v-if="currentRow!=null" type="primary" size="small" icon="el-icon-reading" @click.native="cancelSelected">取消选中</el-button>
        <el-button v-if="currentRow!=null" type="danger" size="small" icon="el-icon-delete" @click="deleteAppoint">删除</el-button>
      </el-button-group>
    </div>
    <div class="table-view">
      <el-table v-loading="listLoading" ref="vTable" :data="list" border fit stripe highlight-current-row :header-cell-style="heaerCellStyle" @current-change="handleCurrentChange">
        <el-table-column label="id" v-if="false">
          <template slot-scope="{ row }">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="20%" label="项目经理" align="center" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span>{{ row.managerName }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="40%" label="项目成员" align="center" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span>{{ row.memberNamesFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="20%" label="市场负责" align="center" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span>{{ row.marketAdminNamesFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="20%" label="技术负责" align="center" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span>{{ row.techniqueAdminNamesFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="25%" label="生效时间" align="center" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span>{{ row.appointmentStartFormat }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="项目人员任命" :visible.sync="dialogVisible" append-to-body :close-on-click-modal="false" width="60%">
      <el-form ref="postForm" :model="postForm" :rules="rules" label-width="80px" class="dialog-form">
        <el-form-item label="项目经理" prop="managerId">
          <el-select v-model="postForm.managerId" filterable placeholder="请选择">
            <el-option v-for="(item,idx) in staffs" :key="idx" :label="item.text" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目成员" prop="memberIds">
          <el-select v-model="postForm.memberIds" filterable placeholder="请选择" multiple>
            <el-option v-for="(item,idx) in staffs" :key="idx" :label="item.text" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="市场负责" prop="marketAdminIds">
          <el-select v-model="postForm.marketAdminIds" filterable placeholder="请选择" multiple>
            <el-option v-for="(item,idx) in staffs" :key="idx" :label="item.text" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="技术负责" prop="techniqueAdminIds">
          <el-select v-model="postForm.techniqueAdminIds" filterable placeholder="请选择" multiple>
            <el-option v-for="(item,idx) in staffs" :key="idx" :label="item.text" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生效日期" prop="appointmentStart">
          <el-date-picker v-model="postForm.appointmentStart"></el-date-picker>
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

import { fetchAppointList, fetchNewAppoint, createPrjAppoint, editPrjAppoint, deletePrjAppoint } from '@/api/project';
import { heaerCellStyle, columnStyle, array2myString, myString2Array } from '@/utils/commonFunction'
import { deepClone } from '@/utils/index'

export default {
  name: 'ProjectAppoint',
  components: {},
  data() {
    return {
      rules: {
        managerId: [{ required: true, message: '请选负责人', trigger: 'blur' }],
        memberIds: [{ required: true, message: '请选项目成员', trigger: 'blur' }]
      },
      list: [],
      listLoading: true,
      staffs: '',
      currentRow: null,
      dialogVisible: false,
      postForm: {
        id: '',
        projectId: '',
        managerId: '',
        memberIds: '',
        marketAdminIds: '',
        techniqueAdminIds: '',
        appointmentStart: new Date()
      },
    };
  },
  props: {
    projectId: { type: Number, default: 0 }
  },
  created() {
    this.getList()
  },
  methods: {
    submit() {
      this.$refs.postForm.validate((valid) => {
        if (valid) {
          let that = this
          that.postForm.projectId = that.projectId
          that.postForm.memberIds = that.array2myString(that.postForm.memberIds)
          that.postForm.marketAdminIds = that.array2myString(that.postForm.marketAdminIds)
          that.postForm.techniqueAdminIds = that.array2myString(that.postForm.techniqueAdminIds)
          // 新建
          if (that.postForm.id === '') {
            createPrjAppoint(that.postForm).then((res) => {
              that.getList()
              that.$message.success('新建成功！')
              that.dialogVisible = false
            }).catch((err) => {
              that.$message.error('新建失败：' + err)
            })
          }
          // 编辑更新
          else {
            editPrjAppoint(that.postForm).then((res) => {
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
      fetchAppointList(this.projectId).then((res) => {
        that.list = res.data.appointments.filter(x => x.status === 1)
        that.listLoading = false
      }).catch((err) => {
        that.$message({
          message: '错误信息：' + err,
          type: 'error'
        });
      });
    },
    addAppoint() {
      fetchNewAppoint().then((res) => {
        this.staffs = res.data.staffs
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
    editAppoint() {
      const that = this
      fetchNewAppoint().then((res) => {
        that.staffs = res.data.staffs
        if (that.$refs.postForm !== undefined) {
          that.$refs.postForm.clearValidate()
        }
        that.postForm = deepClone(that.currentRow)
        that.postForm.memberIds = this.myString2Array(that.postForm.memberIds)
        that.postForm.marketAdminIds = that.myString2Array(that.postForm.marketAdminIds)
        that.postForm.techniqueAdminIds = that.myString2Array(that.postForm.techniqueAdminIds)
        that.dialogVisible = true
      }).catch((err) => {
        that.$message({
          message: '错误信息：' + err,
          type: 'error'
        })
      })
    },
    deleteAppoint() {
      this.$confirm('永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          deletePrjAppoint(this.currentRow).then((res) => {
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