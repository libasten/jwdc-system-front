<template>
  <!-- 已经过期的提醒 -->
  <div class="component-container">
    <div class="table">
      <el-table v-loading="listLoading" :data="list.slice((currentPage-1)*pageSize,currentPage*pageSize)" border fit stripe highlight-current-row :header-cell-style="{color: '#444', fontSize: '16px', backgroundColor: '#F3F6FC' }" :cell-style="columnStyle">ele
        <el-table-column min-width="0%" label="类型ID" v-if="false">
          <template slot-scope="{ row }">
            <span>{{ row.typeId }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="0%" label="ID" v-if="false">
          <template slot-scope="{ row }">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="40%" label="事项名称" header-align="center" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="40%" label="所属项目" header-align="center" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span>{{ row.projectName }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="20%" label="到期时间" align="center" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span>{{ row.date }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="height:20px;width:100%;" />
    <el-pagination :current-page="currentPage" :page-sizes="[10, 20, 30]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="parseInt(total)" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
  </div>
</template>

<script>

import { getRemindList, fetchHistoryRreminds } from '@/api/dashboard';


export default {
  name: 'HistroyRemindTable',
  components: {},
  data() {
    return {
      list: [],
      listLoading: true,
      pageSize: 10,
      currentPage: 1,
      total: 0,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 获取后台分页数据列表
    getList() {
      this.listLoading = true;
      this.list = [];
      fetchHistoryRreminds().then((res) => {
        console.log(res)
        this.total = res.data.length;
        res.data.forEach(ele => {
          const element = {
            typeId: ele.typeId,
            id: ele.id,
            projectName: ele.projectName,
            name: ele.name, //名称
            date: ele.date,
            expire: ele.expireFormat
          };
          this.list.push(element);
        });
        this.listLoading = false;
      }).catch((err) => {
        this.$message({
          message: '错误信息：' + err,
          type: 'error'
        });
      });
    },
    // 每页显示数目变动
    handleSizeChange(val) {
      this.pageSize = val;
    },
    // 切换页码
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    columnStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 || columnIndex === 1) {
        return 'padding-left:20px;align:left;';
      }
    },
  },
};
</script>

<style lang="scss">
.table {
  min-height: 400px;
  .el-table {
    width: 100%;
    .cell {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>