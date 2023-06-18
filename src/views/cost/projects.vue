<template>
  <!-- 项目费用明细归集 -->
  <div class="app-container" v-if="checkAuth('33-1')">
    <div class="page-title">项目费用明细归集</div>
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

import { queryProjectCost } from '@/api/cost';
import { headerCellStyle } from '@/utils/commonFunction'
const ExcelJS = require("exceljs");
import { saveAs } from "file-saver";
import { checkAuth } from "@/utils/permission";

export default {
  name: 'ProjectCost',
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
  computed: {
    prjRowIdx() {
      return this.queryResult.datas.reduce((acc, cur, index) => {
        if (cur.style === 1) {
          acc.push(index)
        }
        return acc
      }, [])
    }
  },
  methods: {
    doSearch() {
      this.$refs.postForm.validate((valid) => {
        if (valid) {
          // 获取拆分开的行动日志起始时间
          this.postForm.startDate = this.postForm.seDate[0]
          this.postForm.endDate = this.postForm.seDate[1]
          this.listLoading = true
          this.list = []
          queryProjectCost(this.postForm).then(res => {
            this.queryResult = res.data
            res.data.datas.forEach(e => {
              this.list.push(e.row)
            })
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
    // 这里使用计算属性prjRowIdx避免循环嵌套
    tableAddRowClass({ row, rowIndex }) {
      // 第一行
      if (rowIndex === 0) {
        return 'sum-tr';
      }
      if (this.prjRowIdx.includes(rowIndex)) {
        return 'prj-tr';
      }
      return '';
    },

    downloadResult() {
      const borderStyle = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" }, };
      const contentCenter = { vertical: "middle", horizontal: "center" };
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("项目费用明细", { views: [{ showGridLines: true }], });

      let headerEx = [];
      this.queryResult.headers.forEach(element => {
        headerEx.push(element.text);
      });
      const headerRow = worksheet.addRow(headerEx);
      headerRow.height = 26;
      worksheet.getCell("A1").font = { size: 12, bold: true };
      headerRow.eachCell(function (cell, colNumber) {
        cell.border = borderStyle;
        cell.font = { size: 12, bold: true };
        cell.alignment = contentCenter;
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFDCDCDC" }, }
      });
      // 填充数据行
      this.queryResult.datas.forEach(element => {
        let arrTemp = new Array(headerEx.length).fill('');
        element.row.forEach(a => {
          arrTemp[a.id] = a.text
        })
        const tempRow = worksheet.addRow(arrTemp);
        tempRow.eachCell(function (cell, colNumber) {
          cell.border = borderStyle;
          cell.alignment = contentCenter;
          if (element.style === 0) {
            cell.font = { size: 12, bold: true, color: { argb: 'FFFF0000' } };
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFFFF" } }
          }
          if (element.style === 1) {
            cell.font = { size: 12, bold: true };
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "AADCDCDC" }, }
          }
        });
      });
      // 设置列属性 - 宽度
      for (let i = 0; i < headerEx.length; i++) {
        if (i == 0) {
          worksheet.getColumn(i + 1).width = 45;
        }
        else {
          worksheet.getColumn(i + 1).width = 12;
        }
      }
      // 保存到本地
      workbook.xlsx.writeBuffer().then((buffer) => saveAs(new Blob([buffer]), "项目费用明细.xlsx")).catch((err) => console.log("Error writing excel export", err));
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
      color: red !important;
      font-size: 1.05rem;
      font-weight: 700;
    }
    .prj-tr {
      background-color: #efefef;
      font-weight: 700;
    }
  }
}
</style>