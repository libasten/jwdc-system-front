<template>
  <!-- 项目分享 -->
  <div class="">
    <div class="top-btns">
      <el-button-group>
        <el-button type="primary" size="small" icon="el-icon-plus" @click="addShare">新建</el-button>
        <!-- <el-button v-if="currentRow!=null" type="primary" size="small" icon="el-icon-view" @click="editShare">编辑</el-button> -->
        <el-button v-if="currentRow!=null" type="primary" size="small" icon="el-icon-reading" @click.native="cancelSelected">取消选中</el-button>
        <el-button v-if="currentRow!=null" type="danger" size="small" icon="el-icon-delete" @click="deleteShare">删除</el-button>
      </el-button-group>
    </div>
    <div class="table-view">
      <el-table v-loading="listLoading" ref="vTable" :data="list" border fit stripe highlight-current-row :header-cell-style="headerCellStyle" @current-change="handleCurrentChange">
        <el-table-column label="id" v-if="false">
          <template slot-scope="{ row }">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="40%" label="被分享的人员" align="center" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span>{{ row.viewerName }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="30%" label="分享人" align="center" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span>{{ row.sharerName }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="30%" label="分享时间" align="center" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span>{{ row.updateTimeFormat }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="项目分享" :visible.sync="dialogVisible" append-to-body :close-on-click-modal="false" width="56%">
      <el-form ref="postForm" :model="postForm" :rules="rules" label-width="80px" class="dialog-form">
        <el-form-item label="分享对象" prop="viewerId">
          <el-select v-model="postForm.viewerId" filterable placeholder="请选择">
            <el-option v-for="(item,idx) in staffs" :key="idx" :label="item.text" :value="item.id">
            </el-option>
          </el-select>
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

import { fetchShareList, fetchNewShare, createPrjShare, editPrjShare, deletePrjShare } from '@/api/project';
import { headerCellStyle, columnStyle, array2myString, myString2Array } from '@/utils/commonFunction'
import { deepClone } from '@/utils/index'

export default {
  name: 'ProjectAppoint',
  components: {},
  data() {
    return {
      rules: {
        viewerId: [{ required: true, message: '请选择分享对象', trigger: 'blur' }],
      },
      list: [],
      listLoading: true,
      staffs: '',
      currentRow: null,
      dialogVisible: false,
      postForm: {
        id: '',
        projectId: '',
        sharerId: '',
        sharerName: '',
        viewerId: '',
        viewerName: '',
        allowDownload: true,
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
            createPrjShare(that.postForm).then((res) => {
              that.getList()
              that.$message.success('新建成功！')
              that.dialogVisible = false
            }).catch((err) => {
              that.$message.error('新建失败：' + err)
            })
          }
          // 编辑更新
          else {
            editPrjShare(that.postForm).then((res) => {
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
    // 获取项目分享
    getList() {
      let that = this
      that.listLoading = true;
      that.list = [];
      fetchShareList(this.projectId).then((res) => {
        that.list = res.data.projectShares
        that.listLoading = false
      }).catch((err) => {
        that.$message({
          message: '错误信息：' + err,
          type: 'error'
        });
      });
    },
    addShare() {
      fetchNewShare(this.projectId).then((res) => {
        this.staffs = res.data.staffs
        if (this.$refs.postForm !== undefined) {
          // 清空校验信息
          this.$refs.postForm.resetFields()
        }
        // 这个方法用于重置data属性中的值。
        Object.assign(this.$data.postForm, this.$options.data().postForm)
        this.dialogVisible = true
      }).catch((err) => {
        this.$message({
          message: '错误信息：' + err,
          type: 'error'
        })
      })
    },
    editShare() {
      const that = this
      fetchNewShare(this.projectId).then((res) => {
        that.staffs = res.data.staffs
        if (that.$refs.postForm !== undefined) {
          that.$refs.postForm.clearValidate()
        }
        that.postForm = deepClone(that.currentRow)
        that.dialogVisible = true
      }).catch((err) => {
        that.$message({
          message: '错误信息：' + err,
          type: 'error'
        })
      })
    },
    deleteShare() {
      this.$confirm('永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          deletePrjShare(this.currentRow).then((res) => {
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
    headerCellStyle, columnStyle
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