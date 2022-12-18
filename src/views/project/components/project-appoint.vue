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
        <el-table-column min-width="30%" label="项目经理" align="center" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span>{{ row.managerName }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="45%" label="项目成员" align="center" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span>{{ row.memberNamesFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="25%" label="生效时间" align="center" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span>{{ row.appointmentStartFormat }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="项目人员任命" :visible.sync="dialogVisible" append-to-body :close-on-click-modal="false" width="50%">
      <el-form ref="postForm" :model="postForm" :rules="rules" label-width="80px">
        <el-form-item label="项目经理" prop="managerId">
          <el-input v-model="postForm.managerId"></el-input>
        </el-form-item>
        <el-form-item label="项目成员" prop="memberIds">
          <el-input v-model="postForm.memberIds"></el-input>
        </el-form-item>
        <el-form-item label="生效日期" prop="appointmentStart">
          <el-input v-model="postForm.appointmentStart"></el-input>
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

import { fetchAppointList, editProjectImportance, createProjectImportance, delProjectImportance } from '@/api/project';
import { heaerCellStyle, columnStyle } from '@/utils/commonFunction'
import { deepClone } from '@/utils/index'
export default {
  name: 'ProjectAppoint',
  components: {},
  data() {
    return {
      rules: [],
      list: [],
      listLoading: true,
      currentRow: null,
      dialogVisible: false,
      postForm: {
        id: '',
        name: '',
        order: '',
        description: ''
      },
    };
  },
  props: {
    projectId: { type: Number, default: 0 }
  },
  created() {
    this.getList();
  },
  methods: {
    submit() {
      this.$refs.postForm.validate((valid) => {
        if (valid) {
          // 新建
          if (this.postForm.id === '') {
            createProjectImportance(this.postForm).then((res) => {
              this.$message.success('新建成功！')
              this.list.unshift(res.data);
              this.total++
              this.dialogVisible = false
            }).catch((err) => {
              this.$message.error('新建失败：' + err)
            })
          }
          // 编辑更新
          else {
            editProjectImportance(this.postForm).then((res) => {
              this.$message.success('更新成功！')
              this.dialogVisible = false
            }).catch((err) => {
              this.$message.error('更新失败：' + err)
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
        console.log(res.data.appointments)
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
    editAppoint() {
      if (this.$refs.postForm !== undefined) {
        this.$refs.postForm.clearValidate()
      }
      this.postForm = this.currentRow
      this.dialogVisible = true
    },
    deleteAppoint() {
      this.$confirm('永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          delProjectImportance(this.currentRow).then((res) => {
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

    heaerCellStyle,
    columnStyle
  },
};
</script>

<style scoped>
</style>
<style lang="scss">
</style>