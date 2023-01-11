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
              <el-button type="primary" size="small" icon="el-icon-finished" @click="closeRemindItem(scope.row)">标记完成</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="height:20px;width:100%;" />
    <el-pagination :current-page="currentPage" :page-sizes="[10, 20, 30]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="parseInt(total)" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
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
      pageSize: 10,
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
      getRemindList().then((res) => {
        console.log(res)
        // 测试本地数据
        res.data = [{
          "typeId": 3,
          "id": 1,
          "remind": "常州市国土空间生态修复规划双周例会，专题一二三技术路线不统一，下一步重点专题三",
          "name": "双周例会，专题一二三技术路线不统一，下一步重点专题三",
          "date": "2021年07月15日",
          "expireFormat": "-544天-17小时-26分钟",
          "expire": {
            "ticks": -470643699625841,
            "days": -544,
            "hours": -17,
            "milliseconds": -962,
            "minutes": -26,
            "seconds": -9,
            "totalDays": -544.7265041965752,
            "totalHours": -13073.436100717805,
            "totalMilliseconds": -47064369962.5841,
            "totalMinutes": -784406.1660430683,
            "totalSeconds": -47064369.9625841
          },
          "isCompleted": false,
          "completeStatus": "未完成"
        },
        {
          "typeId": 3,
          "id": 2,
          "remind": "常州市新北区国土空间规划编制基础数据转换提交成果",
          "name": "基础数据转换提交成果",
          "date": "2021年07月30日",
          "expireFormat": "-529天-17小时-26分钟",
          "expire": {
            "ticks": -457683699625841,
            "days": -529,
            "hours": -17,
            "milliseconds": -962,
            "minutes": -26,
            "seconds": -9,
            "totalDays": -529.7265041965752,
            "totalHours": -12713.436100717805,
            "totalMilliseconds": -45768369962.5841,
            "totalMinutes": -762806.1660430683,
            "totalSeconds": -45768369.9625841
          },
          "isCompleted": false,
          "completeStatus": "未完成"
        },
        {
          "typeId": 3,
          "id": 3,
          "remind": "遥观镇大明路东侧、临津路南侧地块使用林地取得批复",
          "name": "取得批复",
          "date": "2021年07月12日",
          "expireFormat": "-547天-17小时-26分钟",
          "expire": {
            "ticks": -473235699625841,
            "days": -547,
            "hours": -17,
            "milliseconds": -962,
            "minutes": -26,
            "seconds": -9,
            "totalDays": -547.7265041965752,
            "totalHours": -13145.436100717805,
            "totalMilliseconds": -47323569962.5841,
            "totalMinutes": -788726.1660430683,
            "totalSeconds": -47323569.9625841
          },
          "isCompleted": false,
          "completeStatus": "未完成"
        },]
        this.total = res.data.length;
        res.data.forEach(ele => {
          const element = {
            typeId: ele.typeId,
            id: ele.id,
            mc: ele.remind, //名称
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