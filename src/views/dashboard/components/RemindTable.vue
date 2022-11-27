<template>
  <div class="component-container">
    <div class="table">
      <!-- 本页的表格是前端分页 -->
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
        <el-table-column min-width="50%" label="事项名称" header-align="center" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span>{{ row.mc }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="20%" label="到期时间" align="center" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span>{{ row.date }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="15%" label="剩余时长" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.expire }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="20%" label="操作" align="center">
          <template slot-scope="scope">
            <el-button-group>
              <el-button type="primary" size="small" icon="el-icon-circle-close" @click="closeRemindItem(scope.row)">完成关闭</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="height:20px;width:100%;" />
    <el-pagination :current-page="currentPage" :page-sizes="[5, 10, 20]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="parseInt(total)" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
  </div>
</template>

<script>

import { getRemindList, } from '@/api/dashboard';

export default {
  name: 'RemidList',
  components: {},
  data() {
    return {
      list: [],
      listLoading: true,
      pageSize: 5,
      currentPage: 1,
      total: 0,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 每页显示数目变动
    handleSizeChange(val) {
      this.pageSize = val;
    },
    // 切换页码
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    // 获取后台分页数据列表
    getList() {
      this.listLoading = true;
      this.list = [];
      //#region 测试提醒列表
      for (let i = 0; i < 20; i++) {
        const element = {
          typeId: '1',
          id: i,
          mc: '测试名称 ' + i, //名称
          date: '2022年10月3日',
          expire: i + '天',
        }
        this.list.push(element)
      }
      this.total = this.list.length;
      this.listLoading = false;
      //#endregion
      // getRemindList().then((res) => {
      //   this.total = res.data.length;
      //   res.data.forEach(ele => {
      //     const element = {
      //       typeId: ele.typeId,
      //       id: ele.id,
      //       mc: ele.remind, //名称
      //       date: ele.date,
      //       expire: ele.expireFormat
      //     };
      //     this.list.push(element);
      //   });
      //   this.listLoading = false;
      // }).catch((err) => {
      //   this.$message({
      //     message: '错误信息：' + err,
      //     type: 'error'
      //   });
      // });
    },
    closeRemindItem(data) {
      const idx = this.list.findIndex(x => (x.typeId === data.typeId && x.id === data.id));
      this.list.splice(idx, 1)
    },
    columnStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        return 'padding-left:20px;align:left;';
      }
    },
  },
};
</script>

<style lang="scss">
.table {
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