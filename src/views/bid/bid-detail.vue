<template>
  <!-- 投标详情 -->
  <div class="app-container bid-detail">
    <div class="title">{{postForm.name}}</div>
    <el-collapse v-model="activeNames">
      <el-collapse-item title="1. 基本信息" name="1">
        <el-form ref="postForm" :loading="loading" :model="postForm" label-width="100px" :disabled="allDisabled">
          <el-row>
            <el-col :span="24">
              <el-form-item label="id" v-if="false" prop="id">
                <el-input v-model="postForm.id"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="投标名称" prop="name">
                <el-input v-model="postForm.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="投标编号" prop="code">
                <el-input v-model="postForm.code"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="投标类型" prop="categoryName">
                <el-input v-model="postForm.categoryName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="截止日期" prop="regDeadline">
                <el-date-picker v-model="postForm.regDeadline" :clearable="false"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="开标时间" prop="openTime">
                <el-date-picker v-model="postForm.openTime" :clearable="false"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="投标负责人" prop="adminNamesFormat">
                <el-input v-model="postForm.adminNamesFormat"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="市场负责人" prop="marketAdminNamesFormat">
                <el-input v-model="postForm.marketAdminNamesFormat"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="采购方式" prop="procurementMethod ">
                <el-input v-model="postForm.procurementMethod"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="投标进度" prop="progressName">
                <el-input v-model="postForm.progressName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="描述说明" prop="description ">
                <el-input type="textarea" v-model="postForm.description"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-collapse-item>
      <el-collapse-item title="2. 投标附件文件" name="2">
        <div class="top-btns">
          <el-button size="mini" type="primary" v-if="checkAuth('19-3')" @click.native="addBidArchive">上传投标附件</el-button>
        </div>
        <el-table :data="bidArchiveFileList" border :header-cell-style="headerCellStyle" v-loading="loading" element-loading-text="获取文件中...">
          <el-table-column label="文件名称" min-width="40" show-overflow-tooltip>
            <template slot-scope="{ row }">
              <span>{{ row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="上传日期" min-width="20" align="center" show-overflow-tooltip>
            <template slot-scope="{ row }">
              <span>{{ row.updateTimeFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column label="上传人员" min-width="15" align="center" show-overflow-tooltip>
            <template slot-scope="{ row }">
              <span>{{ row.updaterName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" min-width="25">
            <template slot-scope="scope">
              <el-button-group>
                <el-button size="mini" type="primary" plain v-if="checkAuth('19-2')" @click="editBidArchive(scope.row)">编辑</el-button>
                <el-button size="mini" type="primary" plain v-if="checkAuth('19-5')" @click="downloadBidArchive(scope.row)">下载</el-button>
                <el-button size="mini" type="danger" plain v-if="checkAuth('19-4')" @click="deleteBidArchive(scope.row)">删除</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
      <el-collapse-item title="3. 投标保证金" name="3">
        <div class="top-btns">
          <el-button size="mini" type="primary" v-if="checkAuth('20-2')" @click.native="saveSecurity">保存保证金信息</el-button>
          <el-button size="mini" type="danger" v-if="checkAuth('20-4')" @click.native="deleteSecurity">清空保证金信息</el-button>
        </div>
        <el-form ref="securityForm" :rules="rules" :model="securityForm" label-width="110px">
          <el-card>
            <el-row>
              <el-col :span="12">
                <el-form-item label="保证金金额" prop="amount">
                  <el-input v-model="securityForm.amount"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="收款单位" prop="payeeUnit">
                  <el-input v-model="securityForm.payeeUnit"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="收款账号" prop="payeeAccount">
                  <el-input v-model="securityForm.payeeAccount"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="开户银行" prop="openBank">
                  <el-input v-model="securityForm.openBank"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="截止付款时间" prop="end">
                  <el-date-picker v-model="securityForm.end" :clearable="false"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="预计退款时间" prop="estimatedReturn">
                  <el-date-picker v-model="securityForm.estimatedReturn" :clearable="false"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          </el-card>
        </el-form>
        <div v-if="this.securityForm.id!==''">
          <el-divider content-position="center">保证金附件</el-divider>
          <div class="top-btns">
            <el-button size="mini" type="primary" v-if="checkAuth('21-3')" @click.native="addSecurityArchive">新增保证金附件</el-button>
          </div>
          <el-table :data="securityArchiveFileList" border :header-cell-style="headerCellStyle" v-loading="loading" element-loading-text="获取文件中...">
            <el-table-column label="文件名称" min-width="40" show-overflow-tooltip>
              <template slot-scope="{ row }">
                <span>{{ row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="上传日期" min-width="20" align="center" show-overflow-tooltip>
              <template slot-scope="{ row }">
                <span>{{ row.updateTimeFormat }}</span>
              </template>
            </el-table-column>
            <el-table-column label="上传人员" min-width="15" align="center" show-overflow-tooltip>
              <template slot-scope="{ row }">
                <span>{{ row.updaterName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" min-width="25">
              <template slot-scope="scope">
                <el-button-group>
                  <el-button size="mini" type="primary" plain v-if="checkAuth('21-2')" @click.native="editSecurityArchive(scope.row)">编辑</el-button>
                  <el-button size="mini" type="primary" plain v-if="checkAuth('20-5')" @click.native="downloadSecurityArchive(scope.row)">下载</el-button>
                  <el-button size="mini" type="danger" plain v-if="checkAuth('20-4')" @click.native="deleteSecurityArchive(scope.row)">删除</el-button>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-collapse-item>
    </el-collapse>
    <el-dialog title="投标附件文件信息" :visible.sync="dialogVisibleBidArchive" :close-on-click-modal="false" width="50%">
      <el-form ref="bidArchiveForm" :model="bidArchiveForm" :rules="rules" label-width="80px">
        <el-form-item label="id" v-if="false" prop="id">
          <el-input v-model="bidArchiveForm.id"></el-input>
        </el-form-item>
        <el-form-item label="附件名称" prop="name">
          <el-input v-model="bidArchiveForm.name"></el-input>
        </el-form-item>
        <el-upload class="upload-component" ref="upload" action="null" :http-request="bidArchiveSubmit" :file-list="bidArchiveUploadFileList" :auto-upload="false" :multiple="false" :on-change="handleBidFileChange" :on-remove="handleBidFileRemove" drag>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em><br>文件大小不超过500M</div>
        </el-upload>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleBidArchive = false">取 消</el-button>
        <el-button type="primary" @click="bidArchiveSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="保证金附件文件信息" :visible.sync="dialogVisibleSecurityArchive" :close-on-click-modal="false" width="50%">
      <el-form ref="securityArchiveForm" :model="securityArchiveForm" :rules="rules" label-width="80px">
        <el-form-item label="id" v-if="false" prop="id">
          <el-input v-model="securityArchiveForm.id"></el-input>
        </el-form-item>
        <el-form-item label="文件名称" prop="name">
          <el-input v-model="securityArchiveForm.name"></el-input>
        </el-form-item>
        <el-upload class="upload-component" ref="uploadSecurity" action="null" :http-request="securityArchiveSubmit" :file-list="securityArchiveUploadFileList" :auto-upload="false" :multiple="false" :on-change="handleSecurityFileChange" :on-remove="handleSecurityFileRemove" drag>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em><br>文件大小不超过500M</div>
        </el-upload>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleSecurityArchive = false">取 消</el-button>
        <el-button type="primary" @click="securityArchiveSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import {
  fetchBidDetail, fetchBidArchive,
  createBidArchive, editBidArchive, delBidArchive,
  fetchBidSecurity, createBidSecurity, editBidSecurity, deleteBidSecurity,
  fetchBidSecurityArchive, createBidSecurityArchive, editBidSecurityArchive, delBidSecurityArchive
} from '@/api/bid';
import { deepClone } from '@/utils/index'
import { downloadFile } from '@/utils/req-down'
import { checkAuth } from "@/utils/permission";

export default {
  name: 'BidDetail',
  data() {
    return {
      loading: true,
      activeNames: ['1', '2', '3'],
      allDisabled: false,
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
        description: ''
      },
      staffs: [],
      categories: [],
      progresses: [],
      // 投标附件部分
      bidArchiveFileList: [], // 绑定在文件列表上的数据源
      bidArchiveFile: '', // 上传操作中的文件
      bidArchiveUploadFileList: [], //上传组件中的文件列表
      bidArchiveForm: {
        id: '',
        bidId: '',
        name: '',
      },
      dialogVisibleBidArchive: false,
      // 保证金部分
      securityForm: {
        id: '',
        name: '',
        bidId: '',
        amount: '',
        end: new Date(),
        estimatedReturn: new Date(),
        openBank: '',
        payeeAccount: '',
        payeeUnit: '',
      },
      // 保证金附件
      securityArchiveFileList: [],
      securityArchiveFile: '', // 上传操作中的文件
      securityArchiveUploadFileList: [], //上传组件中的文件列表
      securityArchiveForm: {
        id: '',
        bidSecurityId: '',
        name: '',
      },
      dialogVisibleSecurityArchive: false,
      rules: {
        code: [{ required: true, message: '请输入编号', trigger: 'blur' }],
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        amount: [{ required: true, message: '请输入金额', trigger: 'blur' }],
        payeeUnit: [{ required: true, message: '不能为空', trigger: 'blur' }],
        payeeAccount: [{ required: true, message: '不能为空', trigger: 'blur' }],
      }
    };
  },
  created() {
    this.postForm.id = this.$route.params && this.$route.params.id
    this.getBidDetail()
    this.getBidArchive()
    this.getSecurity()
    this.allDisabled = true
  },
  methods: {
    // 获取数据详情
    getBidDetail() {
      this.loading = true;
      this.list = [];
      fetchBidDetail(this.postForm.id).then(res => {
        this.postForm = res.data.bid
        this.loading = false
      }).catch(err => { this.$message.error('错误信息：' + err) })
    },
    // 获取附件列表
    getBidArchive() {
      fetchBidArchive(this.postForm.id).then((res) => {
        this.bidArchiveFileList = res.data.filter(a => a.status === 1)
        this.loading = false
      }).catch((err) => { this.$message.error('获取投标附件错误，错误信息：' + err) });
    },
    addBidArchive() {
      if (this.$refs.bidArchiveForm !== undefined) {
        // 清空校验信息
        this.$refs.bidArchiveForm.resetFields()
      }
      // 这个方法用于重置data属性中的值。
      Object.assign(this.$data.bidArchiveForm, this.$options.data().bidArchiveForm)
      this.bidArchiveUploadFileList = []
      this.bidArchiveFile = ''
      this.dialogVisibleBidArchive = true
    },
    editBidArchive(data) {
      if (this.$refs.bidArchiveForm !== undefined) {
        this.$refs.bidArchiveForm.clearValidate()
      }
      this.bidArchiveForm = deepClone(data)
      this.bidArchiveUploadFileList = []
      this.bidArchiveFile = ''
      this.dialogVisibleBidArchive = true
    },
    handleBidFileChange(file, fileList) {
      this.bidArchiveForm.name = file.name
      this.bidArchiveUploadFileList = [{ name: file.name }]
      this.bidArchiveFile = file
    },
    handleBidFileRemove(file, fileList) {
      this.bidArchiveForm.name = ''
      this.bidArchiveUploadFileList = []
    },
    bidArchiveSubmit() {
      this.$refs.bidArchiveForm.validate((valid) => {
        if (valid) {
          // 新建
          if (this.bidArchiveForm.id === '') {
            // 新建要求必须上传文件，编辑的话，可以只对文件元数据信息进行编辑，无需上传文件，若上传了则更新文件。
            if (this.bidArchiveUploadFileList.length < 1) {
              this.$message.warning("请选择一个文件再提交！")
              return
            }
            const formData = new FormData()
            formData.append('file', this.bidArchiveFile.raw)
            this.bidArchiveForm.bidId = this.postForm.id
            createBidArchive(this.bidArchiveForm, formData).then(res => {
              this.$message.success('上传附件成功！')
              this.getBidArchive()
              this.dialogVisibleBidArchive = false
            }).catch(err => { this.$message.error("上传失败！") })
          }
          // 编辑
          else {
            const formData = new FormData()
            formData.append('file', this.bidArchiveFile.raw)
            this.bidArchiveForm.bidId = this.postForm.id
            editBidArchive(this.bidArchiveForm, formData).then(res => {
              this.getBidArchive()
              this.$message.success('更新成功！')
              this.dialogVisibleBidArchive = false
            }).catch(err => { this.$message.error("编辑失败！") })
          }
        }
      })
    },
    downloadBidArchive(data) {
      this.loading = true
      const pConfig = {
        url: process.env.VUE_APP_BASE_API + '/Bids/DownloadBidArchive?id=' + data.id
      }
      downloadFile(pConfig).then(res => {
        let blob = new Blob([res.data])
        const dotIdx = data.guid.lastIndexOf('.')
        const suffix = data.guid.substring(dotIdx)
        let fileName = data.name + suffix
        if ('download' in document.createElement('a')) { // 不是IE浏览器
          let url = window.URL.createObjectURL(blob)
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', fileName)
          document.body.appendChild(link)
          link.click()
          this.loading = false
          document.body.removeChild(link) // 下载完成移除元素
          window.URL.revokeObjectURL(url) // 释放掉blob对象
        } else { // IE 10+
          window.navigator.msSaveBlob(blob, fileName)
        }
      }).catch(err => { this.$message.error("获取下载文件失败" + err) })
    },
    deleteBidArchive(data) {
      this.$confirm('永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        delBidArchive(data).then(res => {
          this.getBidArchive()
          this.$message.success('删除成功！')
        })
      }).catch(err => { this.$message.info('删除操作已取消') })
    },
    // 保证金部分
    getSecurity() {
      fetchBidSecurity(this.postForm.id).then(res => {
        this.securityForm = deepClone(res.data)
        this.getSecurityArchive()
      }).catch(err => {
        if (err === '未找到投标保证金！') {
          Object.assign(this.$data.securityForm, this.$options.data().securityForm)
          this.$message.info('暂无保证金信息！')
        }
        else {
          this.$message.error('错误信息：' + err)
        }
      });
    },
    saveSecurity() {
      this.$refs.securityForm.validate((valid) => {
        if (valid) {
          this.securityForm.bidId = this.postForm.id
          // 无ID的时候新建，否则编辑
          if (this.securityForm.id === '') {
            createBidSecurity(this.securityForm).then(res => {
              this.securityForm = res.data
              this.$message.success('新建保证金成功！')
            }).catch(err => { this.$message.error('错误信息：' + err) })
          } else {
            editBidSecurity(this.securityForm).then(res => {
              this.securityForm = res.data
              this.$message.success('更新保证金成功！')
            }).catch(err => { this.$message.error('错误信息：' + err) })
          }
        }
      })
    },
    deleteSecurity() {
      if (this.securityForm.id === '') {
        this.$message.info('暂无保证金信息！')
        return
      }
      this.$confirm('删除后无法恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        deleteBidSecurity(this.securityForm).then(res => {
          Object.assign(this.$data.securityForm, this.$options.data().securityForm)
          this.$message.success('删除成功！')
        }).catch(err => { this.$message.error('错误信息：' + err) })
      }).catch((err) => { this.$message.info('删除操作已取消') })

    },
    // 保证金附件
    // 获取附件列表
    getSecurityArchive() {
      fetchBidSecurityArchive(this.securityForm.id).then((res) => {
        this.securityArchiveFileList = res.data.filter(a => a.status === 1)
        this.loading = false
      }).catch((err) => { this.$message.error('获取保证金附件列表发生错误，错误信息：' + err) });
    },
    addSecurityArchive() {
      if (this.$refs.securityArchiveForm !== undefined) {
        // 清空校验信息
        this.$refs.securityArchiveForm.resetFields()
      }
      // 这个方法用于重置data属性中的值。
      Object.assign(this.$data.securityArchiveForm, this.$options.data().securityArchiveForm)
      this.securityArchiveUploadFileList = []
      this.securityArchiveFile = ''
      this.dialogVisibleSecurityArchive = true
    },
    editSecurityArchive(data) {
      if (this.$refs.securityArchiveForm !== undefined) {
        this.$refs.securityArchiveForm.clearValidate()
      }
      this.securityArchiveForm = deepClone(data)
      this.securityArchiveUploadFileList = []
      this.securityArchiveFile = ''
      this.dialogVisibleSecurityArchive = true
    },
    handleSecurityFileChange(file, fileList) {
      this.securityArchiveForm.name = file.name
      this.securityArchiveUploadFileList = [{ name: file.name }]
      this.securityArchiveFile = file
    },
    handleSecurityFileRemove(file, fileList) {
      this.securityArchiveForm.name = ''
      this.securityArchiveUploadFileList = []
    },
    securityArchiveSubmit() {
      this.$refs.securityArchiveForm.validate((valid) => {
        if (valid) {
          // 新建
          if (this.securityArchiveForm.id === '') {
            // 新建要求必须上传文件，编辑的话，可以只对文件元数据信息进行编辑，无需上传文件，若上传了则更新文件。
            if (this.securityArchiveUploadFileList.length < 1) {
              this.$message.warning("请选择一个文件再提交！")
              return
            }
            const formData = new FormData()
            formData.append('file', this.securityArchiveFile.raw)
            this.securityArchiveForm.bidSecurityId = this.securityForm.id
            createBidSecurityArchive(this.securityArchiveForm, formData).then(res => {
              this.$message.success('上传保证金附件成功！')
              this.getSecurityArchive()
              this.dialogVisibleSecurityArchive = false
            }).catch(err => { this.$message.error("上传失败！") })
          }
          // 编辑
          else {
            const formData2 = new FormData()
            formData2.append('file', this.securityArchiveFile.raw)
            this.securityArchiveForm.bidSecurityId = this.securityForm.id
            editBidSecurityArchive(this.securityArchiveForm, formData2).then(res => {
              this.$message.success('更新成功！')
              this.getSecurityArchive()
              this.dialogVisibleSecurityArchive = false
            }).catch(err => { this.$message.error("更新编辑失败！") })
          }
        }
      })
    },
    downloadSecurityArchive(data) {
      this.loading = true
      const pConfig = {
        url: process.env.VUE_APP_BASE_API + '/Bids/DownloadBidSecurityArchive?id=' + data.id
      }
      downloadFile(pConfig).then(res => {
        let blob = new Blob([res.data])
        const dotIdx = data.guid.lastIndexOf('.')
        const suffix = data.guid.substring(dotIdx)
        let fileName = data.name + suffix
        if ('download' in document.createElement('a')) { // 不是IE浏览器
          let url = window.URL.createObjectURL(blob)
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', fileName)
          document.body.appendChild(link)
          link.click()
          this.loading = false
          document.body.removeChild(link) // 下载完成移除元素
          window.URL.revokeObjectURL(url) // 释放掉blob对象
        } else { // IE 10+
          window.navigator.msSaveBlob(blob, fileName)
        }
      }).catch(err => { this.$message.error("获取下载文件失败" + err) })
    },
    deleteSecurityArchive(data) {
      this.$confirm('永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        delBidSecurityArchive(data).then((res) => {
          this.getSecurityArchive()
          this.$message.success('删除成功！');
        });
      }).catch((err) => { this.$message.info('删除操作已取消'); });
    },
    headerCellStyle() {
      return { color: '#444', fontSize: '14px', backgroundColor: '#F3F6FC' }
    },
    checkAuth
  },
};
</script>

<style scoped>
</style>
<style lang="scss">
.bid-detail {
  .title {
    font-size: 2rem;
    text-align: center;
    margin: 15px 0 15px 0;
    color: #333;
  }
  .el-collapse-item__header {
    font-size: 1rem;
    background-color: #f5f5f7;
    border-left: 5px solid #72b8ff;
    padding-left: 15px;
    &.is-active {
      border-left: 5px solid #0a76e2;
    }
  }
  .el-input.is-disabled .el-input__inner,
  .el-textarea.is-disabled .el-textarea__inner {
    background-color: #f5f7fa;
    border-color: #fff;
    border-bottom: 1px solid #ccc;
    color: #303133;
    cursor: pointer;
  }
  .el-select,
  .el-date-editor,
  .el-input-number {
    width: 100%;
  }
  .el-timeline-item__tail {
    border-left-color: #0a76e2;
  }
  .el-timeline-item__node--large {
    width: 30px;
    height: 30px;
    left: -10px;
    .el-timeline-item__icon {
      font-size: 16px;
    }
  }
  .el-timeline-item__timestamp {
    font-size: 16px;
    padding-left: 5px;
    padding-top: 10px;
    color: #303133;
    width: 300px;
    margin-bottom: 20px;
  }
  .el-collapse-item__content {
    padding: 15px 10px;
  }
  .upload-component {
    margin-top: -5px;
    .el-upload {
      width: 100%;
    }
    .el-upload-dragger {
      width: 100%;
      height: 60px;
      .el-upload__text {
        margin-top: 15px;
        line-height: 18px;
        font-size: 0.6rem;
      }
    }
  }
  .top-btns {
    margin-bottom: 10px;
  }
}
</style>