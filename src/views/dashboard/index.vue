<template>
  <div class="dashboard-container">
    <el-collapse v-model="activeNames">
      <el-collapse-item name="1">
        <template slot="title">
          <i class="header-icon el-icon-bell"></i>事务提醒
        </template>
        <remind-table />
      </el-collapse-item>
      <el-collapse-item name="2">
        <template slot="title">
          <i class="header-icon el-icon-files"></i>历史提醒
        </template>
      </el-collapse-item>
      <el-collapse-item name="3" v-if="checkAuth('29-1')">
        <template slot="title">
          <i class="header-icon el-icon-odometer"></i>业务总览
        </template>
        <panel-group :dataListInPanel=panelInfoList />
        <!-- 权限控制参考这里 -->
        <el-row :gutter="32">
          <el-col :xs="24" :sm="12" :lg="12">
            <div class="chart-wrapper">
              <bar-chart :chartData="barChart" v-if="chartFlag" />
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="12">
            <div class="chart-wrapper">
              <line-chart :chartData="lineChart" v-if="chartFlag" />
            </div>
          </el-col>
        </el-row>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import { checkAuth } from '@/utils/permission'
import { getProjectStatistics } from '@/api/dashboard'
import RemindTable from './components/RemindTable.vue'
import PanelGroup from './components/PanelGroup'
import BarChart from './components/BarChart'
import LineChart from './components/LineChart'
export default {
  name: 'DashboardAdmin',
  components: {
    RemindTable,
    PanelGroup,
    BarChart,
    LineChart
  },
  data() {
    return {
      activeNames: ['1'],
      panelInfoList: [0, 0, 0],
      lineChart: {},
      barChart: {},
      chartFlag: false,
    }
  },
  computed: {
  },
  watch: {
    activeNames(newVal, oldVal) {
      // console.log('newVal', newVal);
      // console.log('oldVal', oldVal);
      // 监听第三个面板是否打开
      if (oldVal.findIndex(a => a === '3') === -1 && newVal.findIndex(a => a === '3') > -1) {
        if (this.chartFlag === false) {
          this.doStatistics()
        }
      }
    }
  },
  mounted() {

  },
  created() {
  },
  methods: {
    doStatistics() {
      getProjectStatistics().then(res => {
        this.panelInfoList = [res.data.projectCount, res.data.contractCount, res.data.bidCount]
        this.barChart.yearNames = res.data.statisticsYearNames;
        this.barChart.yearCounts = res.data.statisticsYearCounts;
        this.lineChart.cityNames = res.data.statisticsCityNames;
        this.lineChart.cityCounts = res.data.statisticsCityCounts;
        this.chartFlag = true;
      }).catch(err => {
        console.log(err + " @ getProjectStatistics");
      })
    },
    checkAuth,
  }
}
</script>

<style lang="scss">
.dashboard-container {
  padding: 10px;
  background-color: rgb(245, 245, 245);
  .el-collapse-item__header {
    padding-left: 8px;
    font-size: 1rem;
    border-left: 4px solid #fff;
    i.header-icon {
      margin-right: 10px;
    }
    &.is-active {
      border-left: 4px solid #409eff;
    }
  }
  position: relative;
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
