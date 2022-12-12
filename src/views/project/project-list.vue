<template>
  <!-- 项目列表-后台分页 -->
  <div class="app-container">
    <div class="top-btns">
      <el-button-group>
        <el-button type="primary" size="small" icon="el-icon-plus" @click.native="goCreate">新建</el-button>
        <el-button v-if="currentRow!=null" type="primary" size="small" icon="el-icon-view" @click.native="goEdit">查看编辑</el-button>
        <el-button v-if="currentRow!=null" type="primary" size="small" icon="el-icon-user" @click.native="showMember">人员</el-button>
        <el-button v-if="currentRow!=null" type="primary" size="small" icon="el-icon-map-location" @click.native="showMilestone">里程碑</el-button>
        <el-button v-if="currentRow!=null" type="primary" size="small" icon="el-icon-share" @click.native="showShare">分享</el-button>
        <el-button v-if="currentRow!=null" type="primary" size="small" icon="el-icon-reading" @click.native="cancelSelected">取消选中</el-button>
        <el-button v-if="currentRow!=null" type="danger" size="small" icon="el-icon-delete" @click.native="deleteProject">删除</el-button>
      </el-button-group>
    </div>
    <div class="query-box">
      <el-divider content-position="center"><span>项目筛选</span></el-divider>
      <el-form :inline="true" :model="searchForm" ref="searchForm">
        <el-form-item label="筛选类别">
          <el-select v-model="searchForm.searchType" placeholder="筛选类型">
            <el-option v-for="(item,idx) in searchForm.searchTypeOpts" :key="idx" :label="item.text" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="筛选过滤关键字" prop="keyword" style="margin-left:20px;">
          <el-input v-model="searchForm.keyword" placeholder="请输入关键字（不输入关键字返回全部）" @clear="clearKW" clearable style="width:500px;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="doSearch(1, pageSize)">查询</el-button>
        </el-form-item>
      </el-form>
      <el-divider class="bottom-divider"><span v-if="showQueryTip">根据<span class="keyword-span">{{queryTypeTip}}</span>类别下，关键字<span class="keyword-span">“ {{searchForm.keyword}} ”</span>的筛选结果</span></el-divider>
    </div>
    <div class="table-view">
      <el-table v-loading="listLoading" ref="vTable" :data="list" @current-change="handleCurrentChange" border fit stripe highlight-current-row :header-cell-style="heaerCellStyle">
        <el-table-column label="id" v-if="false">
          <template slot-scope="{ row }">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="10%" label="编号" align="center" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span>{{ row.code }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="20%" label="类型" align="center" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span>{{ row.projectTypeName }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="35%" label="名称" align="center" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="15%" label="进度" align="center" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span>{{ row.progressName }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="10%" label="部门" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.departmentName }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="10%" label="负责人" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.manager }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="height:20px;width:100%;" />
    <el-pagination :current-page="currentPage" :page-sizes="[10, 20, 30]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="parseInt(total)" @size-change="handleSizeChange" @current-change="handleCurrentPageChange" />
    <el-dialog title="项目信息" :visible.sync="dialogVisible" :close-on-click-modal="false" width="50%">
      <el-form ref="postForm" :model="postForm" :rules="rules" label-width="80px">
        <el-form-item label="id" v-if="false" prop="id">
          <el-input v-model="postForm.id"></el-input>
        </el-form-item>
        <el-form-item label="难易程度" prop="name">
          <el-input v-model="postForm.name"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="postForm.description"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import { fetchProjectListPaged, editProjectImportance, createProjectImportance, delProjectImportance } from '@/api/project';
import { heaerCellStyle, columnStyle } from '@/utils/commonFunction'
export default {
  name: 'ProjectList',
  components: {},
  data() {
    return {
      rules: {},
      list: [],
      listLoading: true,
      pageSize: 10,
      currentPage: 1,
      total: 0,
      currentRow: null,
      searchForm: {
        searchType: 1,
        keyword: '',
        // value为0的时候，返回全部，无需关键字，在getList方法中使用。
        searchTypeOpts: [
          { text: '项目类型', value: 1 },
          { text: '项目名称', value: 3 },
          { text: '承担部门', value: 2 },
          { text: '项目负责', value: 4 },
          { text: '市场负责', value: 5 },
          { text: '技术负责', value: 6 },],
      },
      showQueryTip: false,
      dialogVisible: false,
      postForm: {
        id: '',
        name: '',
        order: '',
        description: ''
      },
    };
  },
  computed: {
    queryTypeTip() {
      return this.searchForm.searchTypeOpts.find(a => a.value === this.searchForm.searchType).text
    },
  },
  created() {
    this.getList(1, this.pageSize);
  },
  methods: {
    submit() {
      // this.$refs.postForm.validate((valid) => {
      //   if (valid) {
      //     // 新建
      //     if (this.postForm.id === '') {
      //       createProjectImportance(this.postForm).then((res) => {
      //         this.$message.success('新建成功！')
      //         this.list.unshift(res.data);
      //         this.total++
      //         this.dialogVisible = false
      //       }).catch((err) => {
      //         this.$message.error('新建失败：' + err)
      //       })
      //     }
      //     // 编辑更新
      //     else {
      //       editProjectImportance(this.postForm).then((res) => {
      //         this.$message.success('更新成功！')
      //         this.dialogVisible = false
      //       }).catch((err) => {
      //         this.$message.error('更新失败：' + err)
      //       })
      //     }
      //   }
      // })
    },
    // 获取数据列表
    getList(cPage, pSize) {
      let that = this
      that.listLoading = true
      that.list = []
      const param = { skpCount: (cPage - 1) * this.pageSize, maxCount: pSize, searchType: 0, searchValue: '' }
      fetchProjectListPaged(param).then((res) => {
        that.total = res.data.totalCount
        that.list = res.data.items
        that.listLoading = false
      }).catch((err) => {
        that.$message({
          message: '错误信息：' + err,
          type: 'error'
        });
      });
    },
    // 执行搜索
    doSearch(cPage, pSize) {
      let that = this
      if (that.searchForm.keyword.trim().length < 1) {
        return
      }
      that.listLoading = true
      that.list = []
      const param = {
        skpCount: (cPage - 1) * this.pageSize,
        maxCount: pSize,
        searchType: that.searchForm.searchType,
        searchValue: that.searchForm.keyword
      }
      fetchProjectListPaged(param).then((res) => {
        that.total = res.data.totalCount
        that.list = res.data.items
        that.listLoading = false
        this.showQueryTip = true;
      }).catch((err) => {
        that.$message({
          message: '错误信息：' + err,
          type: 'error'
        });
      });
    },
    // 清空关键字
    clearKW() {
      this.getList(1, this.pageSize);
      this.showQueryTip = false;
    },
    goEdit() {
      this.$router.push({ path: '/project/edit/' + this.currentRow.id })
    },
    goCreate() { },
    showMember() { },
    showMilestone() { },
    showShare() { },
    deleteProject() { },
    // 选中行
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    // 取消选中行
    cancelSelected() {
      this.$refs.vTable.setCurrentRow();
    },
    // 每页显示数目变动
    handleSizeChange(val) {
      this.pageSize = val;
      if (this.searchForm.keyword.trim() === "") {
        this.getList(this.currentPage, this.pageSize);
      }
      else {
        this.doSearch(this.currentPage, this.pageSize)
      }
    },
    // 切换页码-后台分页
    handleCurrentPageChange(val) {
      this.currentPage = val;
      if (this.searchForm.keyword.trim() === "") {
        this.getList(this.currentPage, this.pageSize);
      }
      else {
        this.doSearch(this.currentPage, this.pageSize)
      }
    },
    heaerCellStyle,
    columnStyle
  },
};
</script>

<style lang="scss" scoped>
.query-box {
  margin-top: 20px;
  .bottom-divider {
    margin-top: 0px;
    margin-bottom: 30px;
  }
}
.keyword-span {
  font-size: 1.1rem;
  margin: 0 8px;
  font-weight: 700;
  color: #2264f3;
}
</style>
<style lang="scss">
</style>