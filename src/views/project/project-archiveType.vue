<template>
<!-- 附件类型 -->
  <div class="app-container">
    <div class="top-btns">
      <el-button-group>
        <el-button type="primary" size="small" icon="el-icon-plus" @click="createArchiveType">新建</el-button>
        <el-button v-if="currentRow!=null" type="primary" size="small" icon="el-icon-edit" @click="editArchiveType">编辑</el-button>
        <el-button v-if="currentRow!=null" type="primary" size="small" icon="el-icon-reading" @click="cancelSelected">取消选中</el-button>
        <el-button v-if="currentRow!=null" type="danger" size="small" icon="el-icon-delete" @click="deleteArchiveType">删除</el-button>
      </el-button-group>
    </div>
    <div class="table-view">
      <el-table v-loading="listLoading" ref="vTable" :data="list.slice((currentPage-1)*pageSize,currentPage*pageSize)" @current-change="handleCurrentChange" border fit stripe highlight-current-row :header-cell-style="heaerCellStyle" :cell-style="columnStyle">
        <el-table-column label="id" v-if="false">
          <template slot-scope="{ row }">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="60%" label="附件类型" header-align="center" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="40%" label="描述" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.description }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="height:20px;width:100%;" />
    <el-pagination :current-page="currentPage" :page-sizes="[10, 20, 30]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="parseInt(total)" @size-change="handleSizeChange" @current-change="handleCurrentPageChange" />
    <el-dialog title="项目附件类型" :visible.sync="dialogVisible" :close-on-click-modal="false" width="50%">
      <el-form ref="postForm" :model="postForm" :rules="rules" label-width="80px">
        <el-form-item label="id" v-if="false" prop="id">
          <el-input v-model="postForm.id"></el-input>
        </el-form-item>
        <el-form-item label="附件类型" prop="name">
          <el-input v-model="postForm.name"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="postForm.description"></el-input>
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

import { fetchProjectArchiveType, editProjectArchiveType, createProjectArchiveType, delProjectArchiveType } from '@/api/project';
import { heaerCellStyle, columnStyle } from '@/utils/commonFunction'
export default {
  name: 'ProjectArchiveType',
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
      postForm: {
        id: '',
        name: '',
        order: '',
        description: ''
      },
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        order: [{ required: true, message: '请输入排序', trigger: 'blur' }],
      }
    };
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
            createProjectArchiveType(this.postForm).then((res) => {
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
            editProjectArchiveType(this.postForm).then((res) => {
              this.$message.success('更新成功！')
              this.dialogVisible = false
            }).catch((err) => {
              this.$message.error('更新失败：' + err)
            })
          }
        }
      })
    },
    // 选中行
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    // 取消选中行
    cancelSelected() {
      this.$refs.vTable.setCurrentRow();
    },
    // 获取数据列表
    getList() {
      this.listLoading = true;
      this.list = [];
      fetchProjectArchiveType().then((res) => {
        this.total = res.data.length
        this.list = res.data
        this.listLoading = false
      }).catch((err) => {
        this.$message({
          message: '错误信息：' + err,
          type: 'error'
        });
      });
    },
    createArchiveType() {
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
    editArchiveType() {
      if (this.$refs.postForm !== undefined) {
        this.$refs.postForm.clearValidate()
      }
      this.postForm = this.currentRow
      this.dialogVisible = true
    },
    deleteArchiveType() {
      this.$confirm('永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          delProjectArchiveType(this.currentRow).then((res) => {
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
  },
};
</script>

<style scoped>
</style>
<style lang="scss">
</style>