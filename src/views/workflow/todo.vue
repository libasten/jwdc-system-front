<template>
  <!-- 待办 工作流首页 -->
  <div class="app-container workflow-page">
    <div class="flow-btns">
      <el-button icon="el-icon-edit-outline" size="small" :type="$route.name==='Todo'? 'primary' : 'info'" @click.native="goTodo">我的待办</el-button>
      <el-button icon="el-icon-news" size="small" :type="$route.name==='Create'? 'primary' : 'info'" @click.native="goCreate">新建流程</el-button>
      <el-button icon="el-icon-football" size="small" :type="$route.name==='Doing'? 'primary' : 'info'" @click.native="goDoing">经办流程</el-button>
      <el-button icon="el-icon-finished" size="small" :type="$route.name==='Done'? 'primary' : 'info'" @click.native="goDone">完结流程</el-button>
    </div>
    <el-table :data="todoList" border v-loading="loading" :header-cell-style="headerCellStyle">
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
      <el-table-column label="主题" min-width="30" align="center" show-overflow-tooltip>
        <template slot-scope="{ row }">
          <span>{{ row.workflowCategoryName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="当前处理人" min-width="15" align="center" show-overflow-tooltip>
        <template slot-scope="{ row }">
          <span>{{ row.currentHandler }}</span>
        </template>
      </el-table-column>
      <el-table-column label="当前状态" min-width="15" align="center" show-overflow-tooltip>
        <template slot-scope="{ row }">
          <span>{{ row.currentStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发起时间" min-width="15" align="center" show-overflow-tooltip>
        <template slot-scope="{ row }">
          <span>{{ row.updateTimeFormat }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="10" align="center" show-overflow-tooltip>
        <template slot-scope="{ row }">
          <el-button size="small" type="primary" plain @click="open(row)">打开</el-button>
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
      this.list = [];
      fetchTodoList().then(res => {
        this.todoList = res.data
        this.todoList.push(
          {
            id: 1, starterName: '张三1', workflowCategoryName: '报销单据',
            currentHandler: '王五', currentStatus: '审批', updateTimeFormat: '2022-1-1'
          },
          {
            id: 2, starterName: '张三2', workflowCategoryName: '报销单据',
            currentHandler: '王五', currentStatus: '审批', updateTimeFormat: '2022-1-2'
          },
          {
            id: 3, starterName: '张三3', workflowCategoryName: '报销单据',
            currentHandler: '王五', currentStatus: '审批', updateTimeFormat: '2022-1-3'
          },
          {
            id: 4, starterName: '张三4', workflowCategoryName: '报销单据',
            currentHandler: '王五', currentStatus: '审批', updateTimeFormat: '2022-1-4'
          },
        )
        this.loading = false
      }).catch((err) => { this.$message.error('错误信息：' + err) });
    },

    // 每页显示数目变动
    handleSizeChange(val) {
      this.pageSize = val
    },
    // 切换页码
    handleCurrentPageChange(val) {
      this.currentPage = val
    },
    open(data) {
      console.log(data)
    }
  },
};
</script>

<style scoped>
</style>
<style lang="scss">
.workflow-page {
  .flow-btns {
    margin-bottom: 20px;
    i {
      margin-right: 4px;
    }
  }
  .el-table--border td {
    border-right: 0;
  }
}
</style>