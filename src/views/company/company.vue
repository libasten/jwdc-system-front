<template>
  <!-- 公司信息 -->
  <div class="app-container company-detail">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="1. 公司基本信息" name="1">
        <el-card>
          <el-form ref="postForm" :loading="loading" :model="postForm" :rules="rules" label-width="100px">
            <el-row>
              <el-col :span="24">
                <el-form-item label="id" v-if="false" prop="id">
                  <el-input v-model="postForm.id"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="公司全名" prop="name">
                  <el-input v-model="postForm.name"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="成立时间" prop="date">
                  <el-date-picker v-model="postForm.date" :clearable="false"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="公司地址" prop="address">
                  <el-input v-model="postForm.address"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="法人简介" prop="legalPersonDesc ">
                  <el-input type="textarea" :rows="1" v-model="postForm.legalPersonDesc"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="公司简介" prop="description ">
                  <el-input type="textarea" :rows="4" v-model="postForm.description"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div class="bottom-btns">
            <el-button size="mini" type="primary" v-if="checkAuth('1-2')" @click="editCompanyInfo">更新公司信息</el-button>
          </div>
        </el-card>
      </el-collapse-item>
      <el-collapse-item title="2. 附件文件" name="2">
        <div class="top-btns">
          <el-button size="mini" type="primary" v-if="checkAuth('2-3')" @click="addArchive">上传公司附件</el-button>
        </div>
        <el-table :data="archiveFileList" border :header-cell-style="headerCellStyle" v-loading="loading" element-loading-text="获取文件中...">
          <el-table-column label="文件名称" min-width="50" show-overflow-tooltip>
            <template slot-scope="{ row }">
              <span>{{ row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="上传日期" min-width="20" align="center" show-overflow-tooltip>
            <template slot-scope="{ row }">
              <span>{{ row.updateTimeFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" min-width="25">
            <template slot-scope="scope">
              <el-button-group>
                <el-button size="mini" type="primary" v-if="checkAuth('2-3')" plain @click="editArchive(scope.row)">编辑</el-button>
                <el-button size="mini" type="primary" v-if="checkAuth('2-5')" plain @click="downloadArchive(scope.row)">下载</el-button>
                <el-button size="mini" type="danger" v-if="checkAuth('2-4')" plain @click="deleteArchive(scope.row)">删除</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>
    <el-dialog title="公司附件文件信息" :visible.sync="dialogVisibleArchive" :close-on-click-modal="false" width="50%">
      <el-form ref="archiveForm" :model="archiveForm" :rules="rules" label-width="80px">
        <el-form-item label="id" v-if="false" prop="id">
          <el-input v-model="archiveForm.id"></el-input>
        </el-form-item>
        <el-form-item label="文件名称" prop="name">
          <el-input v-model="archiveForm.name"></el-input>
        </el-form-item>
        <el-upload class="upload-component" ref="upload" action="null" :http-request="archiveSubmit" :file-list="archiveUploadFileList" :auto-upload="false" :multiple="false" :on-change="handleFileChange" :on-remove="handleFileRemove" drag>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em><br>文件大小不超过500M</div>
        </el-upload>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleArchive = false">取 消</el-button>
        <el-button type="primary" @click="archiveSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import { fetchCompany, editCompany, fetchCompanyArchive, createCompanyArchive, editCompanyArchive, delCompanyArchive, } from '@/api/company';
import { deepClone } from '@/utils/index'
import { downloadFile } from '@/utils/req-down'
import { checkAuth } from "@/utils/permission";
export default {
  name: 'CompanyInfo',
  data() {
    return {
      loading: true,
      activeNames: ['1', '2'],
      allDisabled: false,
      postForm: {
        id: '',
        name: '',
        address: '',
        date: new Date(),
        legalPersonDesc: '',
        description: ''
      },
      // 公司附件部分
      archiveFileList: [], // 绑定在文件列表上的数据源
      archiveFile: '', // 上传操作中的文件
      archiveUploadFileList: [], //上传组件中的文件列表
      archiveForm: {
        id: '',
        name: '',
      },
      dialogVisibleArchive: false,
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        address: [{ required: true, message: '请输入地址', trigger: 'blur' }],
        date: [{ required: true, message: '请输入成立时间', trigger: 'blur' }],
      }
    };
  },
  created() {
    this.getCompanyInfo()
    this.allDisabled = true
  },
  methods: {
    // 获取数据详情
    getCompanyInfo() {
      this.loading = true;
      this.list = [];
      fetchCompany(this.postForm.id).then((res) => {
        this.postForm = deepClone(res.data)
        this.loading = false
        this.getArchive()
      }).catch((err) => { this.$message.error('错误信息：' + err) });
    },
    // 编辑保存公司信息
    editCompanyInfo() {
      this.$refs.postForm.validate((valid) => {
        if (valid) {
          editCompany(this.postForm).then(res => {
            this.postForm = deepClone(res.data)
            this.$message.success('更新成功！')
          }).catch(err => { this.$message.error('错误信息：' + err) })
        }

      })
    },
    // 获取附件列表
    getArchive() {
      fetchCompanyArchive().then((res) => {
        this.archiveFileList = res.data.filter(a => a.status === 1)
        this.loading = false
      }).catch((err) => { this.$message.error('获取公司文件错误，错误信息：' + err) });
    },
    addArchive() {
      if (this.$refs.archiveForm !== undefined) {
        // 清空校验信息
        this.$refs.archiveForm.resetFields()
      }
      // 这个方法用于重置data属性中的值。
      Object.assign(this.$data.archiveForm, this.$options.data().archiveForm)
      this.archiveUploadFileList = []
      this.archiveFile = ''
      this.dialogVisibleArchive = true
    },
    editArchive(data) {
      if (this.$refs.archiveForm !== undefined) {
        this.$refs.archiveForm.clearValidate()
      }
      this.archiveForm = deepClone(data)
      this.archiveUploadFileList = []
      this.archiveFile = ''
      this.dialogVisibleArchive = true
    },
    handleFileChange(file, fileList) {
      this.archiveForm.name = file.name
      this.archiveUploadFileList = [{ name: file.name }]
      this.archiveFile = file
    },
    handleFileRemove(file, fileList) {
      this.archiveForm.name = ''
      this.archiveUploadFileList = []
    },
    archiveSubmit() {
      this.$refs.archiveForm.validate((valid) => {
        if (valid) {
          // 新建
          if (this.archiveForm.id === '') {
            // 新建要求必须上传文件，编辑的话，可以只对文件元数据信息进行编辑，无需上传文件，若上传了则更新文件。
            if (this.archiveUploadFileList.length < 1) {
              this.$message.warning("请选择一个文件再提交！")
              return
            }
            const formData = new FormData()
            formData.append('file', this.archiveFile.raw)
            this.archiveForm.bidId = this.postForm.id
            createCompanyArchive(this.archiveForm, formData).then(res => {
              this.$message.success('上传附件成功！')
              this.getArchive()
              this.dialogVisibleArchive = false
            }).catch(err => { this.$message.error("上传失败！") })
          }
          // 编辑
          else {
            const formData = new FormData()
            formData.append('file', this.archiveFile.raw)
            this.archiveForm.bidId = this.postForm.id
            editCompanyArchive(this.archiveForm, formData).then(res => {
              this.getArchive()
              this.$message.success('更新成功！')
              this.dialogVisibleArchive = false
            }).catch(err => { this.$message.error("编辑失败！") })
          }
        }
      })
    },
    downloadArchive(data) {
      this.loading = true
      const pConfig = {
        url: process.env.VUE_APP_BASE_API + '/Companies/DownloadCompanyArchive?id=' + data.id
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
    deleteArchive(data) {
      this.$confirm('永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        delCompanyArchive(data).then((res) => {
          this.getArchive()
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
.company-detail {
  .el-collapse-item__header {
    font-size: 1rem;
    background-color: #f5f5f7;
    border-left: 5px solid #72b8ff;
    padding-left: 15px;
    &.is-active {
      border-left: 5px solid #0a76e2;
    }
  }
  .el-input.is-disabled .el-input__inner {
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
  .bottom-btns {
    text-align: right;
  }
}
</style>