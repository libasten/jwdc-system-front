<template>
  <!-- 投标管理列表 -->
  <div class="app-container">
    <div class="top-btns">
      <el-button-group>
        <el-button type="primary" size="small" icon="el-icon-plus" @click="goAdd">新建</el-button>
        <el-button v-if="currentRow!=null" type="primary" size="small" icon="el-icon-edit" @click="goEdit">编辑</el-button>
        <el-button v-if="currentRow!=null" type="primary" size="small" icon="el-icon-view" @click="goView">查看</el-button>
        <el-button v-if="currentRow!=null" type="primary" size="small" icon="el-icon-reading" @click="cancelSelected">取消选中</el-button>
        <el-button v-if="currentRow!=null" type="danger" size="small" icon="el-icon-delete" @click="goDelete">删除</el-button>
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
          <!-- <template slot-scope="{ row }">
            <span>{{ row.partA }}</span>
          </template> -->
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
          <!-- <template slot-scope="{ row }">
            <span>{{ row.description }}</span>
          </template> -->
        </el-table-column>
        <el-table-column min-width="10%" label="投标进度" header-align="center" show-overflow-tooltip>
          <!-- <template slot-scope="{ row }">
            <span>{{ row.projectCode }}</span>
          </template> -->
        </el-table-column>
      </el-table>
    </div>
    <div style="height:20px;width:100%;" />
    <el-pagination :current-page="currentPage" :page-sizes="[10, 20, 30]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="parseInt(total)" @size-change="handleSizeChange" @current-change="handleCurrentPageChange" />
    <el-dialog title="投标信息" :visible.sync="dialogVisible" :close-on-click-modal="false" width="66%">
      <el-form ref="postForm" :model="postForm" :rules="rules" label-width="100px">
        <el-row>
          <el-form-item label="id" v-if="false" prop="id">
            <el-input v-model="postForm.id"></el-input>
          </el-form-item>
          <el-col :span="24">
            <el-form-item label="名称" prop="name">
              <el-input v-model="postForm.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="编号" prop="code">
              <el-input v-model="postForm.code"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="投标类型" prop="bidType">
              <el-select v-model="postForm.bidType" placeholder="请选择投标类型">
                <el-option v-for="(item,idx) in bidTypes" :key="idx" :label="item.text" :value="item.id"></el-option>
              </el-select>
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
            <el-form-item label="投标负责人" prop="charge">
              <el-input v-model="postForm.charge"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="市场负责人" prop="charge">
              <el-input v-model="postForm.charge"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="采购方式" prop="procurement ">
              <el-input v-model="postForm.procurement"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="投标进度" prop="progress ">
              <el-select v-model="postForm.progress" placeholder="请选择投标类型">
                <el-option v-for="(item,idx) in progresses" :key="idx" :label="item.text" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="描述说明" prop="description ">
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

import { fetchBids, editBid, createBid, deleteBid } from '@/api/bid';
import { headerCellStyle } from '@/utils/commonFunction'
import { deepClone } from '@/utils/index'
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
        bidType: '',
        progress: '',
        regDeadline: new Date(),
        openTime: new Date(),
        description: ''
      },
      bidTypes: [{ id: 1, text: '竞争性项目' }, { id: 2, text: '参与性项目' }, { id: 3, text: '拓展性项目' }],
      progresses: [{ id: 1, text: '立项（10%）' }, { id: 2, text: '报名（20%）' }, { id: 3, text: '开标（50%）' },
      { id: 4, text: '合同签订（90 %）' }, { id: 5, text: '合同归档（100 %）' }],
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
      fetchBids().then((res) => {
        this.total = res.data.length
        this.list = res.data.filter(a => a.status === 1)
        this.listLoading = false
      }).catch((err) => {
        this.$message.error('错误信息：' + err);
      });
    },
    goAdd() {
      if (this.$refs.postForm !== undefined) {
        this.$refs.postForm.clearValidate()
      }
      // 这个方法用于重置data属性中的值。
      Object.assign(this.$data.postForm, this.$options.data().postForm)
      this.dialogVisible = true
    },
    goEdit() {
      if (this.$refs.postForm !== undefined) {
        this.$refs.postForm.clearValidate()
      }
      this.postForm = deepClone(this.currentRow)
      this.dialogVisible = true
    },
    submit() {
      this.$refs.postForm.validate((valid) => {
        if (valid) {
          // 新建
          if (this.postForm.id === '') {
            createBid(this.postForm).then((res) => {
              this.list.unshift(res.data)
              this.$message.success('新建成功！')
              this.dialogVisible = false
            }).catch((err) => { this.$message.error('新建失败：' + err) })
          }
          // 编辑更新
          else {
            editBid(this.postForm).then((res) => {
              const idx = this.list.findIndex(a => a.id === this.currentRow.id)
              this.list[idx] = res.data
              this.$refs.vTable.setCurrentRow(this.list[idx]);
              this.$message.success('更新成功！')
              this.dialogVisible = false
            }).catch((err) => { this.$message.error('更新失败：' + err) })
          }
        }
      })
    },
    goView() {
      this.$router.push({ path: '/bid/detail/' + this.currentRow.id })
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
      })
        .catch((err) => {
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
    headerCellStyle
  },
};
</script>

<style scoped>
</style>
<style lang="scss">
.app-container {
  .el-select {
    width: 100%;
  }
  .el-date-editor {
    width: 100%;
  }
}
</style>