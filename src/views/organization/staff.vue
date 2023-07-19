<template>
  <!-- 员工管理 -->
  <div class="app-container">
    <div class="top-btns">
      <el-button-group>
        <el-button v-if="checkAuth('4-2')" type="primary" size="small" icon="el-icon-plus" @click="createStaff">新建</el-button>
        <el-button v-if="currentRow!=null" type="primary" size="small" icon="el-icon-edit" @click="editStaff">编辑</el-button>
        <!-- <el-button v-if="currentRow!=null" type="primary" size="small" icon="el-icon-picture" @click="editStaff">附件</el-button> -->
        <el-button v-if="currentRow!=null && checkAuth('4-5')" type="primary" size="small" icon="el-icon-news" @click="leaveStaff">离职</el-button>
        <el-button v-if="currentRow!=null" type="primary" size="small" icon="el-icon-reading" @click="cancelSelected">取消选中</el-button>
      </el-button-group>
    </div>
    <div class="table-view">
      <el-table ref="vTable" v-loading="listLoading" :data="list.slice((currentPage-1)*pageSize,currentPage*pageSize)" border fit stripe highlight-current-row :header-cell-style="headerCellStyle" :cell-style="columnStyle" @current-change="handleCurrentChange">
        <el-table-column v-if="false" label="id">
          <template slot-scope="{ row }">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="10%" label="姓名" header-align="center" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="15%" label="部门" align="center" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span>{{ row.departmentName }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="20%" label="职务" align="center" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span>{{ row.post }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="10%" label="手机" align="center" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span>{{ row.telephone }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="30%" label="角色" align="center" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span>{{ row.roleNames }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="15%" label="入职时间" align="center" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span>{{ row.entryTimeFormat }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="height:20px;width:100%;" />
    <el-pagination :current-page="currentPage" :page-sizes="[10, 20, 30]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="parseInt(total)" @size-change="handleSizeChange" @current-change="handleCurrentPageChange" />
    <el-dialog title="员工信息" :visible.sync="dialogVisible" :close-on-click-modal="false" width="50%" class="staff-form-div">
      <el-form ref="postForm" :model="postForm" :rules="rules" label-width="90px">
        <el-form-item v-if="false" label="id" prop="id">
          <el-input v-model="postForm.id" />
        </el-form-item>
        <el-row :gutter="10">
          <el-col :md="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="postForm.name" />
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="性别" prop="sex">
              <el-input v-model="postForm.sex" />
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="手机" prop="telephone">
              <el-input v-model="postForm.telephone" />
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="密码" prop="password">
              <el-input v-model="postForm.password" />
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="身份证号" prop="idNum">
              <el-input v-model="postForm.idNum" />
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="postForm.email" />
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="部门" prop="departmentId">
              <el-select v-model="postForm.departmentId" placeholder="请选择">
                <el-option v-for="item in departments" :key="item.id" :label="item.text" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="员工类型" prop="staffTypeId">
              <el-select v-model="postForm.staffTypeId" placeholder="请选择">
                <el-option v-for="item in staffTypes" :key="item.id" :label="item.text" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="24">
            <el-form-item label="角色" prop="roleIds">
              <el-select v-model="postForm.roleIds" multiple placeholder="请选择">
                <el-option v-for="item in roles" :key="item.id" :label="item.text" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="职务" prop="post">
              <el-input v-model="postForm.post" />
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="生日" prop="birthday">
              <el-date-picker v-model="postForm.birthday" />
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="毕业院校" prop="college">
              <el-input v-model="postForm.college" />
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="专业名称" prop="major">
              <el-input v-model="postForm.major" />
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="毕业时间" prop="graduation">
              <el-date-picker v-model="postForm.graduation" />
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="入职日期" prop="entryTime">
              <el-date-picker v-model="postForm.entryTime" />
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="紧急联系人" prop="emergencyPeople">
              <el-input v-model="postForm.emergencyPeople" />
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="联系人电话" prop="emergencyPhone">
              <el-input v-model="postForm.emergencyPhone" />
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="联系人关系" prop="emergencyRelationship">
              <el-input v-model="postForm.emergencyRelationship" />
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

import { fetchStaffs, editStaff, createStaff, resignStaff, getStaffEnum, getStaff } from '@/api/organization'
import { headerCellStyle, columnStyle, myString2Array, array2myString } from '@/utils/commonFunction'
import { deepClone } from '@/utils/index'
import { checkAuth } from '@/utils/permission'
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
      departments: [],
      staffTypes: [],
      roles: [],
      dialogVisible: false,
      postForm: {
        id: '',
        name: '',
        sex: '',
        birthday: new Date(),
        password: '',
        phone: '',
        email: '',
        idNum: '',
        college: '',
        major: '',
        graduation: new Date(),
        departmentId: '',
        staffTypeId: '',
        roleIds: [],
        post: '',
        entryTime: new Date(),
        emergencyPeople: '',
        emergencyRelationship: '',
        emergencyPhone: '',
      },
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        telephone: [{ required: true, message: '请输入电话', trigger: 'blur' }],
        idNum: [{ required: true, message: '请输入身份证号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        staffTypeId: [{ required: true, message: '请至少选择一个类型', trigger: 'change' }],
        departmentId: [{ required: true, message: '请至少选择一个类型', trigger: 'change' }],
        roleIds: [{ type: 'array', required: true, message: '请至少选择一个角色', trigger: 'change' }],
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
          pa.roleIds = array2myString(pa.roleIds)
          pa.phone = pa.telephone
          // 新建
          if (that.postForm.id === '') {
            createStaff(pa).then(res => {
              that.$message.success('新建成功！')
              that.list.unshift(res.data)
              that.total++
              that.dialogVisible = false
            }).catch(err => { that.$message.error('新建失败：' + err) })
          }
          // 编辑更新
          else {
            console.log(pa)
            editStaff(pa).then(res => {
              that.$message.success('更新成功！')
              const idxTem = that.list.findIndex(x => x.id === res.data.id)
              that.list[idxTem] = res.data
              that.dialogVisible = false
            }).catch(err => { that.$message.error('更新失败：' + err) })
          }
        }
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
    // 获取数据列表
    getList() {
      this.listLoading = true
      this.list = []
      fetchStaffs().then(res => {
        this.total = res.data.length
        this.list = res.data
        this.listLoading = false
      }).catch(err => {
        this.$message.error('错误信息：' + err)
      })
    },
    createStaff() {
      console.log(this.$refs.postForm)
      getStaffEnum().then(res => {
        if (this.$refs.postForm !== undefined) {
          this.$refs.postForm.resetFields()
        }
        this.roles = res.data.roles
        this.departments = res.data.departments
        this.staffTypes = res.data.staffTypes
        this.dialogVisible = true
      }).catch(err => { this.$message.error('错误信息：' + err) })
    },
    editStaff() {
      const that = this
      getStaff(that.currentRow.id).then(res => {
        if (that.$refs.postForm !== undefined) {
          that.$refs.postForm.clearValidate()
        }
        console.log(res)
        that.departments = res.data.departments
        that.staffTypes = res.data.staffTypes
        that.roles = res.data.roles
        that.postForm = deepClone(res.data.staff)
        that.postForm.roleIds = myString2Array(that.postForm.roleIds)
        that.dialogVisible = true
      }).catch(err => { this.$message.error('错误信息：' + err) })
    },
    // 设置离职
    leaveStaff() {
      this.$confirm('是否确定设置离职状态?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          resignStaff(this.currentRow).then((res) => {
            const idx = this.list.findIndex(a => a.id === this.currentRow.id)
            this.list.splice(idx, 1)
            this.total = this.list.length
            this.$message({
              type: 'success',
              message: '设置离职成功!'
            })
          })
        })
        .catch((err) => {
          this.$message({
            type: 'info',
            message: '已取消！'
          })
        })
    },
    // 每页显示数目变动
    handleSizeChange(val) {
      this.pageSize = val
    },
    // 切换页码
    handleCurrentPageChange(val) {
      this.currentPage = val
    },
    checkAuth,
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
</style>
