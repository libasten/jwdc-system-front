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
      <el-col :span="12" style="margin-bottom:10px;">
        <el-input v-model="keywords" placeholder="请输入搜索关键字" clearable><template slot="prepend">搜索过滤</template></el-input>
      </el-col>
    </el-row>
    <el-table :data="showTable" border v-loading="loading" :header-cell-style="headerCellStyle" @row-click="rowClick">
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
      <el-table-column label="当前状态" min-width="10" align="center" show-overflow-tooltip>
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
      filterDataShow: [],
    };
  },
  created() {
    this.getTodoList()
  },
  watch: { //监听搜索框内容，当搜索框内容发生变化时调用searchResource方法
    keywords: {
      handler() { this.searchResource() },
    }
  },
  computed: {
    //showTable计算属性通过slice方法计算表格当前应显示的数据
    showTable() {
      return this.filterDataShow.slice(
        (this.currentPage - 1) * this.pageSize,
        this.currentPage * this.pageSize
      );
    }
  },
  methods: {
    goTodo, goCreate, goDoing, goDone, headerCellStyle, workflowRowStyle,
    // 获取数据详情
    getTodoList() {
      this.loading = true;
      this.todoList = [];
      fetchTodoList().then(res => {
        this.todoList = res.data
        this.total = res.data.length
        this.searchResource()
        this.loading = false
      }).catch(err => { this.$message.error('错误信息：' + err) });
    },
    searchResource() {
      this.currentPage = 1 //将当前页设置为1，确保每次都是从第一页开始搜
      let filterKeywords = this.keywords.trim()
      let filerReasource = this.todoList.filter(item => { //过滤全部数据
        // 此处筛选方法可扩展成多个字段的
        if (item.starterName.includes(filterKeywords)
          || item.projectName.includes(filterKeywords)
          || item.currentHandler.includes(filterKeywords)
          || item.updateTimeFormat.includes(filterKeywords)) {
          return item
        }
      })
      this.filterDataShow = filerReasource //将符合条件的内容赋给filterDataShow
      this.total = this.filterDataShow.length
    },
    rowClick(row, column, event) {
      this.$router.push({ path: '/workflow/expense/detail/' + row.id })
    },
    // 每页显示数目变动
    handleSizeChange(val) {
      this.pageSize = val
    },
    // 切换页码
    handleCurrentPageChange(val) {
      this.currentPage = val
    },
  },
};
</script>

<style scoped>
</style>
<style lang="scss">
</style>