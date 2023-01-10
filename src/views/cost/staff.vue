<template>
  <!-- 所有人员费用归集 -->
  <div class="app-container" v-if="checkAuth('33-1')">
    <div class="page-title">所有人员费用归集</div>
    <div class="query-form">
      <el-form ref="postForm" :model="postForm" :rules="rules" label-position="right" label-width="60px">
        <el-row>
          <el-col :sm="14">
            <el-form-item label="时间" prop="seDate">
              <el-date-picker v-model="postForm.seDate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :sm="10">
            <el-form-item>
              <el-button type="primary" size="small" icon="el-icon-search" @click.native="doSearch">查询</el-button>
              <el-button type="primary" size="small" icon="el-icon-refresh-left" @click.native="clearParams">重置</el-button>
              <el-button type="primary" size="small" icon="el-icon-download" v-if="list.length>0" @click.native="downloadResult">下载</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="table-view">
      <el-table v-loading="listLoading" ref="vTable" :data="list" border fit highlight-current-row :header-cell-style="headerCellStyle" :height="'calc(100vh - 240px)'" :row-class-name="tableAddRowClass" v-fit-columns element-loading-text="后台统计查询中...">
        <el-table-column v-for="item in this.queryResult.headers" :prop="item.id.toString()" :key="item.id" :label="item.text" header-align="center" align="left">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>

import { queryStaffCost } from '@/api/cost';
import { headerCellStyle } from '@/utils/commonFunction'
const ExcelJS = require("exceljs");
import { saveAs } from "file-saver";
import { checkAuth } from "@/utils/permission";

export default {
  name: 'StaffCost',
  components: {},
  data() {
    return {
      list: [],
      listLoading: false,
      postForm: {
        seDate: '',
        startTime: '',
        endTime: '',
      },
      queryResult: '',
      rules: {
        seDate: [{ required: true, message: '请选择起止时间', trigger: 'blur' }]
      },
    }
  },

  created() { },

  methods: {
    doSearch() {
      this.$refs.postForm.validate((valid) => {
        if (valid) {
          // 获取拆分开的行动日志起始时间
          this.postForm.startDate = this.postForm.seDate[0]
          this.postForm.endDate = this.postForm.seDate[1]
          this.listLoading = true
          this.list = []
          queryStaffCost(this.postForm).then(res => {
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
      this.list = []
      this.$refs.postForm.clearValidate()
    },

    // 特殊的合计行和项目行，添加一个样式类
    tableAddRowClass({ row, rowIndex }) {
      let sumIdx = 0
      for (let index = 0; index < this.queryResult.datas.length; index++) {
        const element = this.queryResult.datas[index]
        if (element[1].id === 1 && element[1].text === '合计') {
          sumIdx = index
          break
        }
      }
      if (rowIndex == sumIdx) {
        return 'sum-tr';
      }
      return '';
    },

    downloadResult() {
      const borderStyle = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" }, };
      const contentCenter = { vertical: "middle", horizontal: "center" };
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("所有人员费用汇总", { views: [{ showGridLines: true }], });
      worksheet.addRow(["人员报销费用明细"]).height = 25;
      worksheet.getCell("A1").border = borderStyle;
      // 样式-对齐
      worksheet.getCell("A1").alignment = contentCenter;
      // 样式-字体
      worksheet.getCell("A1").font = { size: 12, bold: true };
      // 填充表头
      let headerEx = [];
      this.queryResult.headers.forEach(element => {
        headerEx.push(element.text);
      });
      const headerRow = worksheet.addRow(headerEx);
      headerRow.eachCell(function (cell, colNumber) {
        cell.border = borderStyle;
        cell.alignment = contentCenter;
      });
      // 按开始行，开始列，结束行，结束列合并 - 根据第一行的列数对第一行大标题进行合并
      worksheet.mergeCells(1, 1, 1, headerEx.length);
      // 填充数据行
      this.queryResult.datas.forEach(element => {
        let arrTemp = new Array(headerEx.length).fill('');
        element.forEach(a => {
          arrTemp[a.id] = a.text
        })
        const tempRow = worksheet.addRow(arrTemp);
        tempRow.eachCell(function (cell, colNumber) {
          cell.border = borderStyle;
          cell.alignment = contentCenter;
        });
      });
      // 设置列属性 - 宽度
      for (let i = 0; i < headerEx.length; i++) {
        worksheet.getColumn(i + 1).width = 12;
      }
      // 保存到本地
      workbook.xlsx.writeBuffer().then((buffer) => saveAs(new Blob([buffer]), "所有人员报销汇总.xlsx")).catch((err) => console.log("Error writing excel export", err));
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
.table-view {
  .el-table {
    .sum-tr {
      color: rgb(218, 44, 44) !important;
      background-color: #efefef;
      font-size: 1.05rem;
      font-weight: 700;
    }
  }
}
</style>