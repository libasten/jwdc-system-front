<template>
  <!-- 项目结款信息统计和导出 -->
  <div class="app-container" v-if="checkAuth('33-1')">
    <div class="page-title">项目结款信息</div>
    <div class="query-form">
      <el-form ref="postForm" :model="postForm" :rules="rules" label-position="right" label-width="120px">
        <el-row>
          <el-col :sm="8">
            <el-form-item label="项目名称" prop="projectName">
              <el-input v-model="postForm.projectName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="日期选项" prop="dateType">
              <el-select v-model="postForm.dateType" placeholder="筛选类型">
                <el-option v-for="(item,idx) in postForm.dateTypes" :key="idx" :label="item.text" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="10">
            <el-form-item label="时间范围" prop="seDate">
              <el-date-picker v-model="postForm.seDate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :sm="24">
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
      <el-table v-loading="listLoading" ref="vTable" :data="list" border fit highlight-current-row :header-cell-style="headerCellStyle" :height="'calc(100vh - 300px)'" element-loading-text="后台统计查询中...">
        <el-table-column v-for="item in headerList" :prop="item.value" :key="item.value" :label="item.text" show-overflow-tooltip header-align="center" align="left">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>

import { queryProjectCollection } from '@/api/cost';
import { headerCellStyle } from '@/utils/commonFunction'
const ExcelJS = require("exceljs");
import { saveAs } from "file-saver";
import { checkAuth } from "@/utils/permission";
export default {
  name: 'ProjectCollection',
  components: {},
  data() {
    return {
      list: [],
      listLoading: false,
      postForm: {
        projectName: '',
        // 日期过滤的枚举， 0 创建日期 1 开始日期  2 结束日期 ，落在下面的区间内
        dateType: 0,
        dateTypes: [{ id: 0, text: '创建时间' }, { id: 1, text: '开始日期' }, { id: 2, text: '结束日期' }],
        seDate: '',
        startDate: '',
        endDate: '',
      },
      headerList: [],
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
          queryProjectCollection(this.postForm).then(res => {
            this.headerList = [{ value: 'code', text: '项目编号' },
            { value: 'projectTypeName', text: '项目类型' },
            { value: 'name', text: '项目名称' },
            { value: 'partA', text: '甲方名称' },
            { value: 'contractAmount', text: '合同金额' },
            { value: 'progressName', text: '项目进度' },
            { value: 'invoicingProgressName', text: '开票进度' },
            { value: 'collectionProgressName', text: '回款进度' },
            { value: 'invoicingTotal', text: '开票总金额' },
            { value: 'collectionTotal', text: '回款总金额' },
            { value: 'unCollectionTotal', text: '未回款金额' },
            { value: 'techniqueAdminsFormat', text: '技术负责人' },
            { value: 'marketAdminNamesFormat', text: '市场负责人' },
            { value: 'ContractCodeNames', text: '合同编号' },
            { value: 'partAContact', text: '甲方联系人' },
            { value: 'partAPhone', text: '甲方电话' },]
            this.list = res.data
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
      this.headerList = []
      this.list = []
      this.$refs.postForm.clearValidate()
    },

    downloadResult() {
      const borderStyle = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" }, };
      const contentCenter = { vertical: "middle", horizontal: "center" };
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("项目结款信息", { views: [{ showGridLines: true }], });

      // 填充表头 - 用refs获取表头列表
      let headerEx = []
      this.$refs.vTable.$children.forEach(obj => { obj.label !== undefined ? headerEx.push(obj.label) : '' })
      const headerRow = worksheet.addRow(headerEx);
      headerRow.eachCell(function (cell, colNumber) {
        cell.border = borderStyle
        cell.alignment = contentCenter
        cell.font = { bold: true, size: 11 }
      });

      // 填充数据行
      this.list.forEach(e => {
        let arrTemp = new Array(headerEx.length).fill('-');
        arrTemp[0] = e.code === null ? '' : e.code
        arrTemp[1] = e.projectTypeName === null ? '' : e.projectTypeName
        arrTemp[2] = e.name === null ? '' : e.name
        arrTemp[3] = e.partA === null ? '' : e.partA
        arrTemp[4] = e.contractAmount === null ? '' : e.contractAmount
        arrTemp[5] = e.progressName === null ? '' : e.progressName
        arrTemp[6] = e.invoicingProgressName === null ? '' : e.invoicingProgressName
        arrTemp[7] = e.collectionProgressName === null ? '' : e.collectionProgressName
        arrTemp[8] = e.invoicingTotal === null ? '' : e.invoicingTotal
        arrTemp[9] = e.collectionTotal === null ? '' : e.collectionTotal
        arrTemp[10] = e.unCollectionTotal === null ? '' : e.unCollectionTotal
        arrTemp[11] = e.techniqueAdminsFormat === null ? '' : e.techniqueAdminsFormat
        arrTemp[12] = e.marketAdminNamesFormat === null ? '' : e.marketAdminNamesFormat
        arrTemp[13] = e.contractIds === null ? '' : e.contractIds
        arrTemp[14] = e.partAContact === null ? '' : e.partAContact
        arrTemp[15] = e.partAPhone === null ? '' : e.partAPhone
        const tempRow = worksheet.addRow(arrTemp);
        tempRow.eachCell(function (cell, colNumber) {
          cell.border = borderStyle;
          cell.alignment = contentCenter;
        });
      })
      // 设置列属性 - 宽度
      for (let i = 0; i < headerEx.length; i++) {
        if (i == 2) {
          worksheet.getColumn(i + 1).width = 45;
        }
        else {
          worksheet.getColumn(i + 1).width = 20;
        }
      }
      // 保存到本地
      workbook.xlsx.writeBuffer().then((buffer) => saveAs(new Blob([buffer]), "项目结款信息.xlsx")).catch((err) => console.log("Error writing excel export", err));
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
  .el-date-editor,
  .el-range-editor {
    width: 100% !important;
  }
}
.table-view {
  .el-table {
    .sum-tr {
      color: red !important;
      font-size: 1.05rem;
      font-weight: 700;
    }
    .subSum-tr {
      background-color: #efefef;
      font-weight: 700;
    }
  }
}
</style>