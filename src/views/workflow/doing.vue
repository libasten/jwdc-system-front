<template>
  <!-- 经办 工作流首页 -->
  <div class="app-container workflow-page">
    <div class="flow-btns">
      <el-button icon="el-icon-edit-outline" size="small" :type="$route.name==='Todo'? 'primary' : 'info'" @click.native="goTodo">我的待办</el-button>
      <el-button icon="el-icon-news" size="small" :type="$route.name==='Create'? 'primary' : 'info'" @click.native="goCreate">新建流程</el-button>
      <el-button icon="el-icon-football" size="small" :type="$route.name==='Doing'? 'primary' : 'info'" @click.native="goDoing">经办流程</el-button>
      <el-button icon="el-icon-finished" size="small" :type="$route.name==='Done'? 'primary' : 'info'" @click.native="goDone">完结流程</el-button>
    </div>
    <el-table :data="list.slice((currentPage-1)*pageSize,currentPage*pageSize)" border fit stripe highlight-current-row v-loading="loading" :header-cell-style="headerCellStyle" :row-style="workflowRowStyle">
      <el-table-column label="发起人员" min-width="20" align="center" show-overflow-tooltip>
        <template slot-scope="{ row }">
          <span>{{ row.starterName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="主题" min-width="30" align="center" show-overflow-tooltip>
        <template slot-scope="{ row }">
          <span>{{ row.workflowCategoryName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="当前处理人" min-width="20" align="center" show-overflow-tooltip>
        <template slot-scope="{ row }">
          <span>{{ row.currentHandler }}</span>
        </template>
      </el-table-column>
      <el-table-column label="当前状态" min-width="15" align="center" show-overflow-tooltip>
        <template slot-scope="{ row }">
          <span>{{ row.currentStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" min-width="15" align="center" show-overflow-tooltip>
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
import { fetchDoingList } from '@/api/workflow';
import { goTodo, goCreate, goDoing, goDone, headerCellStyle, workflowRowStyle } from "@/utils/commonFunction";

export default {
  name: 'WorkFlowDoing',
  data() {
    return {
      loading: true,
      pageSize: 10,
      currentPage: 1,
      total: 0,
      doingList: [], // 表格数据源
    };
  },
  created() {
    this.getDoingList()
  },
  methods: {
    goTodo, goCreate, goDoing, goDone, headerCellStyle, workflowRowStyle,
    // 获取数据详情
    getDoingList() {
      this.loading = true;
      this.list = [];
      fetchDoingList().then(res => {
        this.doingList = res.data
        this.loading = false
      }).catch(err => { this.$message.error('错误信息：' + err) });
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
.workflow-page {
  .flow-btns {
    margin-bottom: 20px;
    i {
      margin-right: 4px;
    }
  }
}
</style>