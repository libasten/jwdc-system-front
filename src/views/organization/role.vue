<template>
  <!-- 角色管理 -->
  <div class="app-container">
    <div class="top-btns">
      <el-button-group>
        <el-button type="primary" size="small" icon="el-icon-plus" @click="createRole">新建</el-button>
        <el-button v-if="currentRow!=null" type="primary" size="small" icon="el-icon-edit" @click="editRole">编辑</el-button>
        <el-button v-if="currentRow!=null" type="primary" size="small" icon="el-icon-unlock" @click="showAuthorize">授权</el-button>
        <el-button v-if="currentRow!=null" type="primary" size="small" icon="el-icon-reading" @click="cancelSelected">取消选中</el-button>
        <el-button v-if="currentRow!=null" type="danger" size="small" icon="el-icon-news" @click="deleteRole">删除</el-button>
      </el-button-group>
    </div>
    <div class="table-view">
      <el-table ref="vTable" v-loading="listLoading" :data="list.slice((currentPage-1)*pageSize,currentPage*pageSize)" border fit stripe highlight-current-row :header-cell-style="headerCellStyle" :cell-style="columnStyle" @current-change="handleCurrentChange">
        <el-table-column v-if="false" label="id">
          <template slot-scope="{ row }">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="25%" label="名称" header-align="center" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="75%" label="描述" header-align="center" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span>{{ row.description }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="height:20px;width:100%;" />
    <el-pagination :current-page="currentPage" :page-sizes="[10, 20, 30]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="parseInt(total)" @size-change="handleSizeChange" @current-change="handleCurrentPageChange" />
    <el-dialog title="角色信息" :visible.sync="dialogVisible" :close-on-click-modal="false" width="50%" class="staff-form-div">
      <el-form ref="postForm" :model="postForm" :rules="rules" label-width="90px">
        <el-form-item v-if="false" label="id" prop="id">
          <el-input v-model="postForm.id" />
        </el-form-item>
        <el-row :gutter="10">
          <el-col :md="24">
            <el-form-item label="名称" prop="name">
              <el-input v-model="postForm.name" />
            </el-form-item>
          </el-col>
          <el-col :md="24">
            <el-form-item label="描述" prop="description">
              <el-input v-model="postForm.description" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 授权弹窗 -->
    <el-dialog :title="authorizeDialogTitle" :visible.sync="dialogVisibleAuthorize" :close-on-click-modal="false" width="50%" class="authorize-form-div">
      <el-form ref="authorizeForm" :model="authorizeForm" :rules="rules" label-width="90px">
        <div v-for="(authItem ,index) in authorizeList" :key="index" class="authorizeItemLine">
          <span class="auth-idx">{{authItem.id}}.</span>
          <span class="auth-name">{{authItem.name}}</span>
          <el-checkbox-group v-model="authorizeValueList[index]" class="chkbox-goroup">
            <el-checkbox v-for="(item,idx) in authItem.authorize" :key="idx" :label="item.id">{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleAuthorize = false">取 消</el-button>
        <el-button @click="checkAllAuthorize">全 选</el-button>
        <el-button @click="clearAllAuthorize">清 空</el-button>
        <el-button type="primary" @click="submitAuthorize">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import { fetchRoles, editRole, createRole, delRole, fetchAuthorize, editAuthorize } from '@/api/organization'
import { headerCellStyle, columnStyle, myString2Array, array2myString } from '@/utils/commonFunction'
import { deepClone } from '@/utils/index'
export default {
  name: 'Staff',
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
      dialogVisibleAuthorize: false,
      postForm: {
        id: '',
        name: '',
        description: '',
      },
      authorizeForm: {},
      authorizeList: [],
      authorizeValueList: [],
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
      }
    }
  },
  computed: {
    authorizeDialogTitle: function () {
      if (this.currentRow != null) {
        return this.currentRow.name + ' - 角色授权信息'
      }
      else {
        return '角色授权信息'
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    submit() {
      const that = this
      that.$refs.postForm.validate((valid) => {
        if (valid) {
          let pa = deepClone(this.postForm);
          // 新建
          if (that.postForm.id === '') {
            createRole(pa).then((res) => {
              that.$message.success('新建成功！')
              that.list.unshift(res.data)
              that.total++
              that.dialogVisible = false
            }).catch((err) => {
              that.$message.error('新建失败：' + err)
            })
          }
          // 编辑更新
          else {
            editRole(pa).then((res) => {
              that.$message.success('更新成功！')
              const idxTem = that.list.findIndex(x => x.id === res.data.id)
              that.list[idxTem] = res.data
              that.dialogVisible = false
            }).catch((err) => {
              that.$message.error('更新失败：' + err)
            })
          }
        }
      })
    },
    // 获取数据列表
    getList() {
      this.listLoading = true
      this.list = []
      fetchRoles().then((res) => {
        this.total = res.data.length
        this.list = res.data
        this.listLoading = false
      }).catch((err) => {
        this.$message({
          message: '错误信息：' + err,
          type: 'error'
        })
      })
    },
    createRole() {
      if (this.$refs.postForm !== undefined) {
        this.$refs.postForm.resetFields()
      }
      this.postForm = this.$options.data().postForm
      this.dialogVisible = true
    },
    editRole() {
      if (this.$refs.postForm !== undefined) {
        this.$refs.postForm.clearValidate()
      }
      this.postForm = this.currentRow
      this.dialogVisible = true
    },
    deleteRole() {
      this.$confirm('永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          delRole(this.currentRow).then((res) => {
            const idx = this.list.findIndex(a => a.id === this.currentRow.id)
            this.list.splice(idx, 1);
            this.total = this.list.length;
            this.$message({
              type: 'success',
              message: '删除成功!',
            });
          });
        })
        .catch((err) => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          });
        });
    },
    // 显示授权窗体
    showAuthorize() {
      fetchAuthorize(this.currentRow.id).then((res) => {
        this.authorizeList = []
        this.authorizeValueList = []
        res.data.forEach(element => {
          let authorizeInfo = []
          let authorizeSingleValueList = []
          for (let key in element.authorize) {
            const eAuth = element.authorize[key]
            authorizeInfo.push({ id: eAuth.id, name: eAuth.name, value: eAuth.value })
            if (eAuth.value === "1") {
              authorizeSingleValueList.push(eAuth.id)
            }
          }
          this.authorizeList.push({ id: element.id, name: element.name, authorize: authorizeInfo })
          this.authorizeValueList.push(authorizeSingleValueList)
        });
        this.dialogVisibleAuthorize = true
      }).catch((err) => {
        this.$message({
          message: '错误信息：' + err,
          type: 'error'
        })
      })
    },
    // 提交授权变动信息
    submitAuthorize() {
      let strParam = ''
      let idx = 0;
      this.authorizeValueList.forEach(sArray => {
        let strTemp = ''
        idx = idx + 1
        if (sArray.length > 0) {
          strTemp += idx + ':'
          sArray.forEach(item => {
            strTemp += item + ','
          })
          strTemp = strTemp.substring(0, strTemp.length - 1)
          strParam += strTemp + ';'
        }
      })
      const pa = {
        roleId: this.currentRow.id,
        resource: strParam
      }
      editAuthorize(pa).then(res => {
        this.$message.success('授权成功！')
      }).catch((err) => {
        this.$message({
          message: '错误信息：' + err,
          type: 'error'
        })
      })
    },
    // 清空全选
    checkAllAuthorize() {
      this.authorizeValueList = []
      this.authorizeList.forEach(e => {
        let tempArray = []
        e.authorize.forEach(item => {
          tempArray.push(item.id)
        })
        this.authorizeValueList.push(tempArray)
      })
    },
    // 清空全选
    clearAllAuthorize() {
      this.authorizeValueList = []
      this.authorizeList.forEach(e => {
        let tempArray = []
        this.authorizeValueList.push(tempArray)
      })
    },
    // 选中行
    handleCurrentChange(val) {
      this.currentRow = val
    },
    // 取消选中行
    cancelSelected() {
      this.$refs.vTable.setCurrentRow()
    },
    // 每页显示数目变动
    handleSizeChange(val) {
      this.pageSize = val
    },
    // 切换页码
    handleCurrentPageChange(val) {
      this.currentPage = val
    },
    headerCellStyle,
    columnStyle
  }
}
</script>

<style scoped>
</style>
<style lang="scss">
.staff-form-div {
  .el-checkbox.is-bordered.el-checkbox--medium {
    min-width: 225px;
    margin-bottom: 10px;
    margin-left: 0px;
  }
  .el-form-item {
    margin-bottom: 12px;
  }
  .el-form-item__error {
    padding-top: 0px;
  }
  .el-date-editor {
    width: 100%;
  }
  .el-select--medium {
    width: 100%;
  }
}
.authorize-form-div {
  .el-dialog__body {
    max-height: 400px;
    overflow-y: auto;
    .authorizeItemLine {
      border-bottom: 1px solid #ddd;
      padding-bottom: 8px;
      margin-bottom: 8px;
      .auth-name {
        display: inline-block;
        width: 110px;
        text-align: right;
        margin-right: 25px;
      }
      .chkbox-goroup {
        display: inline-block;
      }
    }
  }
}
</style>
