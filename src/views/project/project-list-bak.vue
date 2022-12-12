<template>
  <!-- 项目列表 -->
  <div class="app-container">
    <div class="top-btns">
      <el-button-group>
        <el-button type="primary" size="small" icon="el-icon-plus" @click="createImportance">新建</el-button>
        <el-button v-if="currentRow!=null" type="primary" size="small" icon="el-icon-view" @click="editImportance">编辑查看</el-button>
        <el-button v-if="currentRow!=null" type="primary" size="small" icon="el-icon-user" @click="editImportance">人员</el-button>
        <el-button v-if="currentRow!=null" type="primary" size="small" icon="el-icon-map-location" @click="editImportance">里程碑</el-button>
        <el-button v-if="currentRow!=null" type="primary" size="small" icon="el-icon-share" @click="editImportance">分享</el-button>
        <el-button v-if="currentRow!=null" type="primary" size="small" icon="el-icon-reading" @click="cancelSelected">取消选中</el-button>
        <el-button v-if="currentRow!=null" type="danger" size="small" icon="el-icon-delete" @click="deleteImportance">删除</el-button>
      </el-button-group>
    </div>
    <div class="table-view">
      <el-table v-loading="listLoading" ref="vTable" :data="list.slice((currentPage-1)*pageSize,currentPage*pageSize)" @current-change="handleCurrentChange" @filter-change="handleFilterChange" border fit stripe highlight-current-row :header-cell-style="heaerCellStyle">
        <el-table-column label="id" v-if="false">
          <template slot-scope="{ row }">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="10%" label="编号" align="center" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span>{{ row.code }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="20%" label="类型" align="center" show-overflow-tooltip :filters="filterPrjTypeList" :filter-multiple="false" column-key="ckPrjType">
          <template slot-scope="{ row }">
            <span>{{ row.projectTypeName }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="35%" label="名称" align="center" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="15%" label="进度" align="center" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span>{{ row.progressName }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="10%" label="部门" align="center" :filters="filterDepartmentList" :filter-multiple="false" column-key="ckDepartment">
          <template slot-scope="{ row }">
            <span>{{ row.departmentName }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="10%" label="负责人" align="center" :filters="filterManagerList" :filter-multiple="false" column-key="ckManager">
          <template slot-scope="{ row }">
            <span>{{ row.manager }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="height:20px;width:100%;" />
    <el-pagination :current-page="currentPage" :page-sizes="[10, 20, 30]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="parseInt(total)" @size-change="handleSizeChange" @current-change="handleCurrentPageChange" />
    <el-dialog title="项目信息" :visible.sync="dialogVisible" :close-on-click-modal="false" width="50%">
      <el-form ref="postForm" :model="postForm" :rules="rules" label-width="80px">
        <el-form-item label="id" v-if="false" prop="id">
          <el-input v-model="postForm.id"></el-input>
        </el-form-item>
        <el-form-item label="难易程度" prop="name">
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

import { fetchProjectList, editProjectImportance, createProjectImportance, delProjectImportance } from '@/api/project';
import { heaerCellStyle, columnStyle } from '@/utils/commonFunction'
import { deepClone } from '@/utils/index'
export default {
  name: 'ProjectList',
  components: {},
  data() {
    return {
      rules: [],
      list: [],
      listLoading: true,
      pageSize: 10,
      currentPage: 1,
      total: 0,
      currentRow: null,
      dialogVisible: false,
      filterPrjTypeList: [],
      filterDepartmentList: [],
      filterManagerList: [],
      postForm: {
        id: '',
        name: '',
        order: '',
        description: ''
      },
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
    // 获取数据列表
    getList() {
      let that = this
      that.listLoading = true;
      that.list = [];
      fetchProjectList().then((res) => {
        that.total = res.data.length
        that.list = res.data
        that.listLoading = false
        // 做类型、部门、负责人筛选的数组，给el-table用
        that.filterDepartmentList = []
        that.filterPrjTypeList = []
        that.filtermanagerList = []
        that.list.forEach(e => {
          if (that.filterDepartmentList.findIndex(d => d.value === e.departmentName) === -1) {
            that.filterDepartmentList.push({ text: e.departmentName, value: e.departmentName })
          }
          if (that.filterPrjTypeList.findIndex(d => d.value === e.projectTypeName) === -1) {
            that.filterPrjTypeList.push({ text: e.projectTypeName, value: e.projectTypeName })
          }
          if (that.filterManagerList.findIndex(d => d.value === e.manager) === -1) {
            that.filterManagerList.push({ text: e.manager, value: e.manager })
          }
        })
      }).catch((err) => {
        that.$message({
          message: '错误信息：' + err,
          type: 'error'
        });
      });
    },

    handleFilterChange(filters) {
      let originList = deepClone(this.list)
      if (filters.ckPrjType) {
        let temp = this.list.filter(x => x.projectTypeName === filters.ckPrjType[0])
        this.list = temp
      }
      if (filters.ckDepartment) {
        let temp = this.list.filter(x => x.departmentName === filters.ckDepartment[0])
        this.list = temp
      }
      if (filters.ckManager) {
        let temp = this.list.filter(x => x.manager === filters.ckManager[0])
        this.list = temp
      }
      if (filters.length === 0) {
        this.list = originList
      }
      this.total = this.list.length
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
    deleteImportance() {
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