<template>
  <!-- 单个员工费用统计 -->
  <div class="app-container" v-if="checkAuth('33-1')">
    <div class="page-title">单个人员费用归集</div>
    <div class="query-form">
      <el-form ref="postForm" :model="postForm" :rules="rules" label-position="right" label-width="60px">
        <el-row>
          <el-col :sm="12">
            <el-form-item label="人员" prop="staffId">
              <el-select v-model="postForm.staffId" placeholder="请选择人员" filterable>
                <el-option v-for="(item,idx) in staffs" :key="idx" :label="item.text" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="12">
            <el-form-item label="项目" prop="projectId">
              <el-select v-model="postForm.projectId" placeholder="请选择项目" filterable>
                <el-option v-for="(item,idx) in projects" :key="idx" :label="item.text" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="12">
            <el-form-item label="时间" prop="seDate">
              <el-date-picker v-model="postForm.seDate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :sm="12">
            <el-form-item>
              <el-button type="primary" size="small" icon="el-icon-search" @click.native="doSearch">查询</el-button>
              <el-button type="primary" size="small" icon="el-icon-refresh-left" @click.native="clearParams">重置</el-button>
              <el-button type="primary" size="small" icon="el-icon-download" v-if="list.length>0" @click.native="downloadResult">结果下载</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="table-view">
      <el-table v-loading="listLoading" ref="vTable" :data="list" border show-summary fit stripe highlight-current-row :summary-method="getSummaries" :header-cell-style="headerCellStyle" element-loading-text="后台统计查询中...">
        <el-table-column min-width="6%" label="序号" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{  scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="10%" label="科目" align="center" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span>{{ row.categoryName }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="8%" label="单价" align="center" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span>{{ row.amount }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="8%" label="数量" align="center" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span>{{ row.count }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="8%" label="合计" align="center" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span>{{ row.total }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="15%" label="时间" align="center" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span>{{ row.date }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="20%" label="备注说明" align="center" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span>{{ row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="25%" label="关联项目" align="center" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span>{{ row.projectName }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>

import { fetchQueryStaffParams, fetchQueryProjectParams, queryStaffSingleCost } from '@/api/cost';
import { headerCellStyle } from '@/utils/commonFunction'
const ExcelJS = require("exceljs");
import { saveAs } from "file-saver";
import { checkAuth } from "@/utils/permission";
export default {
  name: 'StaffSingleCost',
  components: {},
  data() {
    return {
      list: [],
      listLoading: false,
      postForm: {
        staffId: '',
        projectId: '',
        seDate: '',
        startTime: '',
        endTime: '',
      },
      staffs: '',
      projects: '',
      queryResult: '',
      rules: {
        staffId: [{ required: true, message: '请选择人员', trigger: 'change' }],
        seDate: [{ required: true, message: '请选择起止时间', trigger: 'blur' }]
      },
    }
  },
  created() {
    this.initPage()
  },
  methods: {
    // 获取查询参数
    initPage() {
      fetchQueryStaffParams().then(res => {
        this.staffs = res.data.staffs
      }).catch(err => { this.$message.error('获取人员列表错误信息：' + err) })
      fetchQueryProjectParams().then(res => {
        this.projects = res.data.projects
        this.projects.unshift({ id: 0, text: '不限定项目' })
        this.postForm.projectId = 0
      }).catch(err => { this.$message.error('获取项目列表错误信息：' + err) })
    },
    doSearch() {
      this.$refs.postForm.validate((valid) => {
        if (valid) {
          // 获取拆分开的行动日志起始时间
          this.postForm.startDate = this.postForm.seDate[0]
          this.postForm.endDate = this.postForm.seDate[1]
          this.list = []
          this.listLoading = true
          queryStaffSingleCost(this.postForm).then(res => {
            this.queryResult = res.data
            this.list = res.data.datas
            this.listLoading = false
          }).catch(err => {
            this.$message.error('查询失败：' + err)
            this.listLoading = false
          })
        }
      })
    },
    clearParams() {
      Object.assign(this.$data.postForm, this.$options.data().postForm)
      this.postForm.projectId = 0
      this.list = []
      this.$refs.postForm.clearValidate()
    },
    // 表尾合计
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      sums[0] = '合计';
      let colSum = 0;
      data.forEach(e => {
        colSum += e.total
      })
      sums[4] = colSum.toFixed(2);
      return sums;
    },
    downloadResult() {
      const borderStyle = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" }, };
      const contentCenter = { vertical: "middle", horizontal: "center", wrapText: true, };
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet(this.queryResult.staffName + "-个人报销汇总", { views: [{ showGridLines: true }], });
      worksheet.addRow(["报销明细"]).height = 25;
      worksheet.getCell("A1").border = borderStyle;
      worksheet.mergeCells("A1", "H1");
      // 样式-对齐
      worksheet.getCell("A1").alignment = contentCenter;
      // 样式-字体
      worksheet.getCell("A1").font = { size: 12, bold: true };
      let strBlank = "                                 ";
      worksheet.getCell("A2").value = "报销人：" + this.queryResult.staffName + strBlank + "部门：" + this.queryResult.departmentName;
      worksheet.getCell("A2").border = borderStyle;
      worksheet.getCell("A2").alignment = { vertical: "middle" };
      worksheet.mergeCells("A2", "H2");
      worksheet.getRow(2).height = 25;
      worksheet.getCell("A3").value = "报销时间段：" + this.queryResult.dateRange;
      worksheet.getCell("A3").border = borderStyle;
      worksheet.getCell("A3").alignment = { vertical: "middle" };
      worksheet.mergeCells("A3", "H3");
      worksheet.getRow(3).height = 25;
      // 行填充信息
      let titles = ["序号", "科目", "单价（元）", "数量", "合计（元）", "时间", "备注说明", "关联项目名称"];
      const titleRow = worksheet.addRow(titles);
      titleRow.eachCell(function (cell, colNumber) {
        cell.border = borderStyle;
        cell.alignment = contentCenter;
      });
      //  从界面上的Table获数据
      let rowDataList = [];
      for (let i = 0; i < this.list.length; i++) {
        const e = this.list[i];
        let arrTmep = [];
        arrTmep[0] = i + 1;
        arrTmep[1] = e.categoryName;
        arrTmep[2] = e.amount;
        arrTmep[3] = e.count;
        arrTmep[4] = e.total;
        arrTmep[5] = e.date;
        arrTmep[6] = e.description === null ? '' : e.description;
        arrTmep[7] = e.projectName;
        rowDataList[i] = arrTmep;
      }
      rowDataList.forEach((r) => {
        const tempRow = worksheet.addRow(r);
        tempRow.eachCell(function (cell, colNumber) {
          cell.border = borderStyle;
          cell.alignment = contentCenter;
        });
      });
      // 空行
      let nullRow1 = worksheet.addRow(["", "", "", "", "", "", "", ""]);
      nullRow1.eachCell(function (cell, colNumber) {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFFFF" }, };
      });
      nullRow1.height = 25;
      // 报销合计行
      var sumMoney = this.queryResult.totalTotal;
      const sumRow = worksheet.addRow(["报销金额合计", "", "", "", sumMoney, "", "", ""]); // 前两个合并，只要6个
      // 获取新加行的行次 sumRow.number
      worksheet.mergeCells("A" + sumRow.number, "B" + sumRow.number);
      sumRow.eachCell(function (cell, colNumber) {
        cell.border = borderStyle;
        cell.alignment = contentCenter;
      });
      // 合计信息加粗
      worksheet.getCell("A" + sumRow.number).font = { bold: true };
      worksheet.getCell("E" + sumRow.number).font = { bold: true };
      sumRow.height = 20;
      // 设置列属性 - 宽度
      worksheet.getColumn(2).width = 20;
      worksheet.getColumn(3).width = 15;
      worksheet.getColumn(5).width = 15;
      worksheet.getColumn(6).width = 25;
      worksheet.getColumn(7).width = 50;
      worksheet.getColumn(8).width = 45;
      // 保存到本地
      workbook.xlsx.writeBuffer().then((buffer) => saveAs(new Blob([buffer]), this.queryResult.staffName + "-报销汇总.xlsx")).catch((err) => console.log("Error writing excel export", err));
    },
    headerCellStyle, checkAuth
  },
};
</script>

<style scoped>
</style>
<style lang="scss">
.page-title {
  font-size: 1.4rem;
  border-bottom: 1px solid #dcdcdc;
  padding-bottom: 10px;
  margin-bottom: 15px;
  text-align: center;
}
.query-form {
  .el-select,
  .el-date-editor {
    width: 100%;
  }
}
.table-view .el-table__footer tbody tr {
  font-weight: 700;
  & td:nth-child(5) {
    color: #ff0000;
  }
}
</style>