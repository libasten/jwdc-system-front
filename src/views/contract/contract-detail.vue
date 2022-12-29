<template>
  <!-- 合同详情 -->
  <div class="app-container contract-detail">
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
            <el-col :span="12">
              <el-form-item label="登记编号" prop="code">
                <el-input v-model="postForm.code"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="项目编号" prop="projectCode">
                <el-input v-model="postForm.projectCode"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="合同名称" prop="name">
                <el-input v-model="postForm.name"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="甲方名称" prop="partA">
                <el-input v-model="postForm.partA"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="合同金额" prop="amount">
                <el-input v-model="postForm.amount"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="合同描述" prop="description">
                <el-input type="textarea" v-model="postForm.description"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-collapse-item>
      <el-collapse-item title="2. 合同文件" name="2">
        <div class="top-btns">
          <el-button size="mini" type="primary" @click="addArchive">上传文件</el-button>
        </div>
        <el-table :data="contractFileList" border :header-cell-style="headerCellStyle" v-loading="loading" element-loading-text="获取文件中...">
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
                <el-button size="mini" type="primary" plain @click="editArchive(scope.row)">编辑</el-button>
                <el-button size="mini" type="primary" plain @click="downloadArchive(scope.row)">下载</el-button>
                <el-button size="mini" type="danger" plain @click="deleteArchive(scope.row)">删除</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>
    <el-dialog title="合同文件信息" :visible.sync="dialogVisibleArchive" :close-on-click-modal="false" width="50%">
      <el-form ref="archiveForm" :model="archiveForm" :rules="rules" label-width="60px">
        <el-form-item label="id" v-if="false" prop="id">
          <el-input v-model="archiveForm.id"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="archiveForm.name"></el-input>
        </el-form-item>
        <el-upload class="upload-component" ref="upload" action="null" :http-request="archiveSubmit" :file-list="fileList" :auto-upload="false" :multiple="false" :on-change="handleFileChange" :on-remove="handleFileRemove" drag>
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

import {
  fetchContractDetail, fetchContractArchive,
  createContractArchive, editContractArchive, delContractArchive
} from '@/api/contract';
import { deepClone } from '@/utils/index'
import { downloadFile } from '@/utils/req-down'

export default {
  name: 'ContractDetail',
  data() {
    return {
      loading: true,
      activeNames: ['2'],
      allDisabled: false,
      postForm: {
        id: '', //当前项目的id，也是路由入参
        name: '',
        code: '',
        projectCode: '',
        partA: '',
        amount: '',
        description: '',
      },
      dialogVisible: false,
      contractFileList: [],
      archiveFile: '',
      fileList: [],
      archiveForm: {
        id: '',
        contractId: '',
        name: '',
      },
      dialogVisibleArchive: false,
      rules: {
        code: [{ required: true, message: '请输入编号', trigger: 'blur' }],
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        // archiveName: [{ required: true, message: '请输入附件名称', trigger: 'change' }],
      }
    };
  },
  props: {},
  created() {
    this.postForm.id = this.$route.params && this.$route.params.id
    this.getContractDetail()
    this.getContractArchive()
    this.allDisabled = true
  },
  methods: {
    // 获取数据详情
    getContractDetail() {
      this.loading = true;
      this.list = [];
      fetchContractDetail(this.postForm.id).then((res) => {
        this.postForm = res.data
        this.loading = false
      }).catch((err) => { this.$message.error('错误信息：' + err) });
    },
    // 获取合同附件列表
    getContractArchive() {
      fetchContractArchive(this.postForm.id).then((res) => {
        this.contractFileList = res.data.filter(a => a.status === 1)
        this.loading = false
      }).catch((err) => { this.$message.error('获取合同附件错误，错误信息：' + err) });
    },

    addArchive() {
      if (this.$refs.archiveForm !== undefined) {
        // 清空校验信息
        this.$refs.archiveForm.resetFields()
      }
      // 这个方法用于重置data属性中的值。
      Object.assign(this.$data.archiveForm, this.$options.data().archiveForm)
      this.fileList = []
      this.archiveFile = ''
      this.dialogVisibleArchive = true
    },
    editArchive(data) {
      if (this.$refs.archiveForm !== undefined) {
        this.$refs.archiveForm.clearValidate()
      }
      this.archiveForm = deepClone(data)
      this.fileList = []
      this.archiveFile = ''
      this.dialogVisibleArchive = true
    },
    handleFileChange(file, fileList) {
      this.archiveForm.name = file.name
      this.fileList = [{ name: file.name }]
      this.archiveFile = file
    },
    handleFileRemove(file, fileList) {
      this.archiveForm.name = ''
      this.fileList = []
    },
    archiveSubmit() {
      this.$refs.archiveForm.validate((valid) => {
        if (valid) {
          // 新建
          if (this.archiveForm.id === '') {
            // 新建要求必须上传文件，编辑的话，可以只对文件元数据信息进行编辑，无需上传文件，若上传了则更新文件。
            if (this.fileList.length < 1) {
              this.$message.warning("请选择一个文件再提交！")
              return
            }
            const formData = new FormData()
            formData.append('file', this.archiveFile.raw)
            this.archiveForm.contractId = this.postForm.id
            createContractArchive(this.archiveForm, formData).then(res => {
              this.$message.success('上传附件成功！')
              this.getContractArchive()
              this.dialogVisibleArchive = false
            }).catch(err => { this.$message.error("上传失败！") })
          }
          // 编辑
          else {
            const formData = new FormData()
            formData.append('file', this.archiveFile.raw)
            this.archiveForm.contractId = this.postForm.id
            editContractArchive(this.archiveForm, formData).then(res => {
              this.getContractArchive()
              this.$message.success('更新成功！')
              this.dialogVisibleArchive = false
            }).catch(err => { this.$message.error("编辑失败！") })
          }
        }
      })
    },
    // 下载合同文件
    downloadArchive(data) {
      this.loading = true
      const pConfig = {
        url: process.env.VUE_APP_BASE_API + '/Contracts/DownloadContractArchive?id=' + data.id
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
        delContractArchive(data).then((res) => {
          this.getContractArchive()
          this.$message.success('删除成功！');
        });
      }).catch((err) => { this.$message.info('删除操作已取消'); });
    },
    headerCellStyle() {
      return { color: '#444', fontSize: '14px', backgroundColor: '#F3F6FC' }
    }
  },
};
</script>

<style scoped>
</style>
<style lang="scss">
.contract-detail {
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