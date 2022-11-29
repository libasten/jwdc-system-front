<template>
  <div class="app-container">
    <div class="top-btns">
      <el-button-group>
        <el-button type="primary" size="small" icon="el-icon-first-aid-kit" @click="$router.push('/project/create')">新建</el-button>
        <el-button v-if="currentRow!=null" type="primary" size="small" icon="el-icon-reading" @click="cancelSelected">取消选中</el-button>
        <el-button v-if="currentRow!=null" type="primary" size="small" icon="el-icon-edit" @click="$router.push('/project/create')">编辑</el-button>
        <el-button v-if="currentRow!=null" type="danger" size="small" icon="el-icon-delete" @click="$router.push('/project/create')">删除</el-button>
      </el-button-group>
    </div>
    <div class="table-view">
      <el-table v-loading="listLoading" ref="singleTable" :data="list.slice((currentPage-1)*pageSize,currentPage*pageSize)" @current-change="handleCurrentChange" border fit stripe highlight-current-row :header-cell-style="heaerCellStyle" :cell-style="columnStyle">
        <el-table-column label="id" v-if="false">
          <template slot-scope="{ row }">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="40%" label="阶段名称" header-align="center" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="15%" label="排序" align="center" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span>{{ row.order }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="8%" label="描述" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.description }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="height:20px;width:100%;" />
    <el-pagination :current-page="currentPage" :page-sizes="[10, 20, 30]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="parseInt(total)" @size-change="handleSizeChange" @current-change="handleCurrentPageChange" />
  </div>
</template>

<script>

import { fetchProjectStage, editProjectStage, createProjectStage, delProjectStage } from '@/api/project';

export default {
  name: 'ProjectList',
  components: {},
  data() {
    return {
      list: [],
      listLoading: true,
      pageSize: 15,
      currentPage: 1,
      total: 0,
      currentRow: null
    };
  },
  created() {
    this.getList();
  },
  methods: {
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    // 取消选中
    cancelSelected() {
      this.$refs.singleTable.setCurrentRow();
    },
    // 每页显示数目变动
    handleSizeChange(val) {
      this.currentPage = 1
      this.pageSize = val
    },
    // 切换页码
    handleCurrentPageChange(val) {
      this.currentPage = val
    },
    // 获取数据列表
    getList() {
      this.listLoading = true;
      this.list = [];
      fetchProjectStage().then((res) => {
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
    // 删除项目
    deleteProject(id) {
      this.$confirm('永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          deletePrj(id).then(() => {
            this.list.splice(id, 1);
            this.total = this.list.length;
            this.$message({
              type: 'success',
              message: '删除成功!',
            });
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          });
        });
    },
    columnStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        return 'padding-left:20px;align:left;';
      }
    },
    heaerCellStyle() {
      return { color: '#444', fontSize: '16px', backgroundColor: '#F3F6FC' }
    }
  },
};
</script>

<style scoped>
.top-btns {
  margin-bottom: 10px;
}
</style>
<style lang="scss">
.table-view {
  .el-table {
    width: 100%;
    .el-table__body tr.current-row > td {
      background-color: #218be8;
      color: #eee;
    }
    .cell {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
