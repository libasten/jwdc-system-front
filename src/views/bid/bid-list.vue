<template>
  <!-- 投标管理列表 -->
  <div class="app-container">
    <div class="top-btns">
      <el-button-group>
        <el-button type="primary" v-if="checkAuth('18-3')" size="small" icon="el-icon-plus" @click="goAdd">新建</el-button>
        <el-button v-if="canDownload" type="primary" size="small" icon="el-icon-download" @click.native="downloadBids">下载</el-button>
        <el-button v-if="currentRow!=null && checkAuth('18-2')" type="primary" size="small" icon="el-icon-edit" @click="goEdit">编辑</el-button>
        <el-button v-if="currentRow!=null && checkAuth('18-1')" type="primary" size="small" icon="el-icon-view" @click="goView">查看</el-button>
        <el-button v-if="currentRow!=null " type="primary" size="small" icon="el-icon-reading" @click="cancelSelected">取消选中</el-button>
        <el-button v-if="currentRow!=null && checkAuth('18-4')" type="danger" size="small" icon="el-icon-delete" @click="goDelete">删除</el-button>
      </el-button-group>
    </div>
    <div class="table-view">
      <el-table v-loading="listLoading" ref="vTable" :data="list.slice((currentPage-1)*pageSize,currentPage*pageSize)" @current-change="handleCurrentChange" border fit stripe highlight-current-row :header-cell-style="headerCellStyle">
        <el-table-column label="id" v-if="false">
          <template slot-scope="{ row }">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="15%" label="投标编号" align="center" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span>{{ row.code }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="25" label="投标名称" header-align="center" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="10%" label="投标类型" header-align="center" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span>{{ row.categoryName }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="15%" label="报名截止时间" align="center" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span>{{ row.regDeadlineFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="15%" label="开标时间" align="center" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span>{{ row.openTimeFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="10%" label="负责人" header-align="center" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span>{{ row.adminNamesFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="10%" label="投标进度" header-align="center" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span>{{ row.progressName }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="10%" label="录入时间" header-align="center" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span>{{ row.createTimeFormat }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="height:20px;width:100%;" />
    <el-pagination :current-page="currentPage" :page-sizes="[10, 20, 30]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="parseInt(total)" @size-change="handleSizeChange" @current-change="handleCurrentPageChange" />
    <el-dialog title="投标信息" :visible.sync="dialogVisible" :close-on-click-modal="false" width="80%" top="10vh">
      <el-form ref="postForm" :model="postForm" :rules="rules" label-width="110px">
        <el-row>
          <el-form-item label="id" v-if="false" prop="id">
            <el-input v-model="postForm.id"></el-input>
          </el-form-item>
          <el-col :span="24">
            <el-form-item label="名称" prop="name">
              <el-input v-model="postForm.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="编号" prop="code">
              <el-input v-model="postForm.code"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="投标类型" prop="category">
              <el-select v-model="postForm.category" placeholder="请选投标类型">
                <el-option v-for="(item,idx) in categories" :key="idx" :label="item.text" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="截止日期" prop="regDeadline">
              <el-date-picker v-model="postForm.regDeadline" :clearable="false"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="开标时间" prop="openTime">
              <el-date-picker v-model="postForm.openTime" :clearable="false"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="开标地点" prop="bidOpeningPlace">
              <el-input v-model="postForm.bidOpeningPlace"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="投标负责人" prop="adminIds">
              <el-select v-model="postForm.adminIds" placeholder="请选择投标负责人" filterable multiple>
                <el-option v-for="(item,idx) in staffs" :key="idx" :label="item.text" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="市场负责人" prop="marketAdminIds">
              <el-select v-model="postForm.marketAdminIds" placeholder="请选择市场负责人" filterable multiple>
                <el-option v-for="(item,idx) in staffs" :key="idx" :label="item.text" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="采购方式" prop="procurementMethod">
              <el-input v-model="postForm.procurementMethod"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="投标进度" prop="progress">
              <el-select v-model="postForm.progress" placeholder="请选择投标进度">
                <el-option v-for="(item,idx) in progresses" :key="idx" :label="item.text" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="代理机构" prop="agency">
              <el-input v-model="postForm.agency"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="代理联系人" prop="agencyContact">
              <el-input v-model="postForm.agencyContact"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="代理联系方式" prop="agencyPhone">
              <el-input v-model="postForm.agencyPhone"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="甲方名称" prop="partA">
              <el-input v-model="postForm.partA"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="甲方联系人" prop="partAContact">
              <el-input v-model="postForm.partAContact"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="甲方联系方式" prop="partAPhone">
              <el-input v-model="postForm.partAPhone"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注说明" prop="description ">
              <el-input type="textarea" v-model="postForm.description"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import { fetchBids, newBid, editBid, createBid, deleteBid } from '@/api/bid';
import { headerCellStyle, array2myString, myString2Array } from '@/utils/commonFunction'
import { deepClone } from '@/utils/index'
import { checkAuth } from "@/utils/permission";
const ExcelJS = require("exceljs");
import { saveAs } from "file-saver";
export default {
  name: 'BidList',
  components: {},
  data() {
    return {
      list: [],
      listLoading: true,
      pageSize: 10,
      currentPage: 1,
      total: 0,
      currentRow: null,
      dialogVisible: false,
      postForm: {
        id: '',
        code: '',
        name: '',
        category: '',
        progress: '',
        marketAdminIds: '',
        adminIds: '',
        regDeadline: new Date(),
        openTime: new Date(),
        bidOpeningPlace: '',
        agency: '',
        agencyContact: '',
        agencyPhone: '',
        partA: '',
        partAContact: '',
        partAPhone: '',
        description: ''
      },
      staffs: [],
      categories: [],
      progresses: [],
      canDownload: false,
      rules: {
        code: [{ required: true, message: '请输入编号', trigger: 'blur' }],
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 获取数据列表
    getList() {
      this.listLoading = true;
      this.list = [];
      fetchBids().then(res => {
        this.total = res.data.bids.length
        this.list = res.data.bids.filter(a => a.status === 1)
        this.canDownload = res.data.canDownloadBids
        this.listLoading = false
      }).catch(err => { this.$message.error('错误信息：' + err); });
    },
    goAdd() {
      newBid().then(res => {
        if (this.$refs.postForm !== undefined) {
          this.$refs.postForm.resetFields()
        }
        Object.assign(this.$data.postForm, this.$options.data().postForm)
        this.staffs = res.data.staffs
        this.categories = res.data.categories
        this.progresses = res.data.progresses
        this.dialogVisible = true
      }).catch(err => { this.$message.error('错误信息：' + err) })
    },
    goEdit() {
      newBid().then(res => {
        if (this.$refs.postForm !== undefined) {
          this.$refs.postForm.clearValidate()
        }
        this.postForm = deepClone(this.currentRow)
        this.staffs = res.data.staffs
        this.categories = res.data.categories
        this.progresses = res.data.progresses
        this.postForm.adminIds = this.myString2Array(this.postForm.adminIds)
        this.postForm.marketAdminIds = this.myString2Array(this.postForm.marketAdminIds)
        this.postForm.progress = this.postForm.progress === 0 ? null : this.postForm.progress
        this.postForm.category = this.postForm.category === 0 ? null : this.postForm.category
        this.dialogVisible = true
      }).catch(err => { this.$message.error('错误信息：' + err) })
    },
    submit() {
      this.$refs.postForm.validate((valid) => {
        if (valid) {
          let that = this
          if (new Date(that.postForm.openTime).getTime() < new Date(that.postForm.regDeadline).getTime()) {
            that.$message.warning('开标时间要在报名截止日期后面！')
            return
          }
          that.postForm.adminIds = that.array2myString(that.postForm.adminIds)
          that.postForm.marketAdminIds = that.array2myString(that.postForm.marketAdminIds)
          // 新建
          if (that.postForm.id === '') {
            createBid(that.postForm).then(res => {
              that.list.unshift(res.data)
              const idx = that.list.findIndex(a => a.id === res.data.id)
              that.$refs.vTable.setCurrentRow(that.list[idx]);
              that.$message.success('新建成功！')
              that.dialogVisible = false
            }).catch(err => {
              that.$message.error('新建失败：' + err)
              that.dialogVisible = false
            })
          }
          // 编辑更新
          else {
            editBid(that.postForm).then(res => {
              const idx = that.list.findIndex(a => a.id === that.currentRow.id)
              that.list[idx] = res.data
              that.$refs.vTable.setCurrentRow(that.list[idx]);
              that.$message.success('更新成功！')
              that.dialogVisible = false
            }).catch(err => {
              that.$message.error('更新失败：' + err)
              that.dialogVisible = false
            })
          }
        }
      })
    },
    goView() {
      this.$router.push({ path: '/bid/detail/' + this.currentRow.id })
    },
    downloadBids() {
      const borderStyle = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" }, };
      const contentCenter = { vertical: "middle", horizontal: "center" };
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("投标信息列表", { views: [{ showGridLines: true }], });
      worksheet.addRow(["投标信息列表"]).height = 25;
      worksheet.getCell("A1").border = borderStyle;
      // 样式-对齐
      worksheet.getCell("A1").alignment = contentCenter;
      // 样式-字体
      worksheet.getCell("A1").font = { size: 12, bold: true };
      // 填充表头 - 用refs获取表头列表
      let headerEx = []
      this.$refs.vTable.$children.forEach(obj => { obj.label !== undefined ? headerEx.push(obj.label) : '' })
      const headerRow = worksheet.addRow(headerEx);
      headerRow.eachCell(function (cell, colNumber) {
        cell.border = borderStyle;
        cell.alignment = contentCenter;
        cell.font = { bold: true, size: 11 }
      });
      // 按开始行，开始列，结束行，结束列合并 - 根据第一行的列数对第一行大标题进行合并
      worksheet.mergeCells(1, 1, 1, headerEx.length);
      // 填充数据行
      this.list.forEach(e => {
        let arrTemp = new Array(headerEx.length).fill('-');
        arrTemp[0] = e.code === null ? '' : e.code
        arrTemp[1] = e.name === null ? '' : e.name
        arrTemp[2] = e.categoryName === null ? '' : e.categoryName
        arrTemp[3] = e.regDeadlineFormat === null ? '' : e.regDeadlineFormat
        arrTemp[4] = e.openTimeFormat === null ? '' : e.openTimeFormat
        arrTemp[5] = e.adminNamesFormat === null ? '' : e.adminNamesFormat
        arrTemp[6] = e.progressName === null ? '' : e.progressName
        arrTemp[7] = e.createTimeFormat === null ? '' : e.createTimeFormat
        const tempRow = worksheet.addRow(arrTemp);
        tempRow.eachCell(function (cell, colNumber) {
          cell.border = borderStyle;
          cell.alignment = contentCenter;
        });
      })
      // 设置列属性 - 宽度
      for (let i = 0; i < headerEx.length; i++) {
        worksheet.getColumn(i + 1).width = 20;
      }
      // 保存到本地
      workbook.xlsx.writeBuffer().then((buffer) => saveAs(new Blob([buffer]), "投标列表.xlsx")).catch((err) => console.log("Error writing excel export", err));
    },
    // 选中行
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    // 取消选中行
    cancelSelected() {
      this.$refs.vTable.setCurrentRow();
    },
    goDelete() {
      this.$confirm('永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        deleteBid(this.currentRow).then((res) => {
          const idx = this.list.findIndex(a => a.id === this.currentRow.id)
          this.list.splice(idx, 1);
          this.total = this.list.length;
          this.$message({
            type: 'success',
            message: '删除成功!',
          });
        });
      }).catch((err) => {
        this.$message({
          type: 'info',
          message: '已取消删除',
        });
      });
    },
    // 每页显示数目变动
    handleSizeChange(val) {
      this.pageSize = val
    },
    // 切换页码
    handleCurrentPageChange(val) {
      this.currentPage = val
    },
    headerCellStyle, checkAuth, array2myString, myString2Array
  },
};
</script>

<style scoped>
</style>
<style lang="scss">
.app-container {
  .el-dialog__body {
    padding-bottom: 0px;
    .el-select {
      width: 100%;
    }
    .el-date-editor {
      width: 100%;
    }
  }
}
</style>