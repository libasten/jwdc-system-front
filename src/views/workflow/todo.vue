<template>
  <!-- 待办 工作流首页 -->
  <div class="app-container workflow-page">
    <div class="flow-btns">
      <el-button icon="el-icon-edit-outline" size="small" :type="$route.name==='Todo'? 'primary' : 'info'" @click.native="goTodo">我的待办</el-button>
      <el-button icon="el-icon-news" size="small" :type="$route.name==='Create'? 'primary' : 'info'" @click.native="goCreate">新建流程</el-button>
      <el-button icon="el-icon-football" size="small" :type="$route.name==='Doing'? 'primary' : 'info'" @click.native="goDoing">经办流程</el-button>
      <el-button icon="el-icon-finished" size="small" :type="$route.name==='Done'? 'primary' : 'info'" @click.native="goDone">完结流程</el-button>
    </div>
    <el-row>
      <el-col :span="8" style="margin-bottom:10px;">
        <el-input v-model="keywords" placeholder="请输入项目或人员搜索关键字" clearable @keyup.enter.native="search" @clear="search"><template slot="prepend">搜索</template></el-input>
      </el-col>
      <el-col :span="4" style="margin-bottom:10px; margin-left:10px;">
        <el-button icon="el-icon-search" size="small" type="primary" @click="search">搜索</el-button>
      </el-col>
    </el-row>
    <el-table :data="todoList" border v-loading="loading" :header-cell-style="headerCellStyle" @row-click="rowClick">
      <el-table-column label="id" v-if="false">
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发起人员" min-width="15" align="center" show-overflow-tooltip>
        <template slot-scope="{ row }">
          <span>{{ row.starterName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="主题" min-width="15" align="center" show-overflow-tooltip>
        <template slot-scope="{ row }">
          <span>{{ row.workflowCategoryName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="关联项目" min-width="25" align="center" show-overflow-tooltip>
        <template slot-scope="{ row }">
          <span>{{ row.projectName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="当前处理人" min-width="15" align="center" show-overflow-tooltip>
        <template slot-scope="{ row }">
          <span>{{ row.currentHandler }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报销金额" min-width="10" align="center" show-overflow-tooltip>
        <template slot-scope="{ row }">
          <span>{{ row.totalAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" min-width="10" align="center" show-overflow-tooltip>
        <template slot-scope="{ row }">
          <span>{{ row.currentStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发起时间" min-width="20" align="center" show-overflow-tooltip>
        <template slot-scope="{ row }">
          <span>{{ row.updateTimeFormat }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div style="height:20px;width:100%;" />
    <el-pagination :current-page="currentPage" :page-sizes="[10, 20, 30]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="parseInt(total)" @size-change="handleSizeChange" @current-change="handleCurrentPageChange" />
  </div>
</template>

<script>
import { fetchTodoList } from '@/api/workflow';
import { goTodo, goCreate, goDoing, goDone, headerCellStyle, workflowRowStyle } from "@/utils/commonFunction";

export default {
  name: 'WorkFlowTodo',
  data() {
    return {
      loading: true,
      pageSize: 10,
      currentPage: 1,
      total: 0,
      todoList: [], // 表格数据源
      keywords: '',// 检索文本关键字
    };
  },
  created() {
    this.getTodoList()
  },
  methods: {
    goTodo, goCreate, goDoing, goDone, headerCellStyle, workflowRowStyle,
    // 获取数据详情
    getTodoList() {
      this.loading = true;
      this.todoList = [];
      const params = {
        skipCount: (this.currentPage - 1) * this.pageSize,
        maxCount: this.pageSize,
        searchValue: ''
      };
      if (this.keywords.trim()) {
        params.searchValue = this.keywords.trim();
      }
      fetchTodoList(params).then(res => {
        this.todoList = res.data.data
        this.total = res.data.totalCount
        this.loading = false
      }).catch(err => { this.$message.error('错误信息：' + err) });
    },
    search() {
      this.currentPage = 1;
      this.getTodoList()
    },
    rowClick(row, column, event) {
      this.$router.push({ path: '/workflow/expense/detail/' + row.id })
    },
    // 每页显示数目变动
    handleSizeChange(val) {
      this.currentPage = 1
      this.pageSize = val
      this.getTodoList()
    },
    // 切换页码
    handleCurrentPageChange(val) {
      this.currentPage = val
      this.getTodoList()
    },
  },
};
</script>

<style scoped>
</style>
<style lang="scss">
</style>