<template>
  <div class="dashboard-container">
    <div style="height:100px;">通知和提醒</div>
    <panel-group :dataListInPanel=panelInfoList />

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
  </div>
</template>

<script>
import { getProjectStatistics } from '@/api/dashboard'
import PanelGroup from './components/PanelGroup'
import BarChart from './components/BarChart'
import LineChart from './components/LineChart'
export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    BarChart,
    LineChart
  },
  data() {
    return {
      panelInfoList: [0, 0, 0],
      lineChart: {},
      barChart: {},
      chartFlag: false,
    }
  },
  mounted() {
    getProjectStatistics().then(res => {
      this.panelInfoList = [res.data.projectCount, res.data.contractCount, res.data.bidCount]
      this.barChart.yearNames = res.data.statisticsYearNames;
      this.barChart.yearCounts = res.data.statisticsYearCounts;
      this.lineChart.cityNames = res.data.statisticsCityNames;
      this.lineChart.cityCounts = res.data.statisticsCityCounts;
      this.chartFlag = true
    }).catch(err => {
      this.$message.error('getProjectStatistics ## ' + err.message || 'Error');
    });
  },
  created() {

  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
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
