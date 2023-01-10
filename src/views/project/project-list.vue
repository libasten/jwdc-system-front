<template>
  <!-- 项目列表-后台分页 -->
  <div class="app-container">
    <div class="top-btns">
      <el-button-group>
        <!-- 授权参考这里 -->
        <!-- 人员只能看到系统允许看到的项目，所以编辑、分享等功能不要再做权限控制 -->
        <el-button type="primary" size="small" icon="el-icon-plus" @click.native="goCreate" v-if="checkAuth('7-3')">新建</el-button>
        <el-button v-if="currentRow!=null && checkAuth('7-2')" type="primary" size="small" icon="el-icon-edit" @click.native="goEdit">编辑基本信息</el-button>
        <el-button v-if="currentRow!=null && checkAuth('7-1')" type="primary" size="small" icon="el-icon-view" @click.native="goView">查看信息分表</el-button>
        <el-button v-if="currentRow!=null && checkAuth('25-1')" type="primary" size="small" icon="el-icon-user" @click.native="showAppoint">人员任命</el-button>
        <el-button v-if="currentRow!=null && checkAuth('1-1')" type="primary" size="small" icon="el-icon-map-location" @click.native="showMilestone">里程碑</el-button>
        <el-button v-if="currentRow!=null && checkAuth('30-1')" type="primary" size="small" icon="el-icon-share" @click.native="showShare">分享</el-button>
        <el-button v-if="currentRow!=null" type="primary" size="small" icon="el-icon-reading" @click.native="cancelSelected">取消选中</el-button>
        <el-button v-if="currentRow!=null && checkAuth('7-4')" type="danger" size="small" icon="el-icon-delete" @click.native="deleteProject">删除</el-button>
      </el-button-group>
    </div>
    <div class="query-box">
      <el-collapse>
        <el-collapse-item title=" " name="1">
          <template slot="title"><i class="header-icon el-icon-s-operation"></i> 项目筛选框 </template>
          <el-form :model="searchForm" ref="searchForm" label-width="100px">
            <el-row>
              <el-col :span="10">
                <el-form-item label="筛选类别" prop="searchType">
                  <el-select v-model="searchForm.searchType" placeholder="筛选类型">
                    <el-option v-for="(item,idx) in searchForm.searchTypeOpts" :key="idx" :label="item.text" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="14">
                <el-form-item label="筛选关键字" prop="keyword">
                  <el-input v-model="searchForm.keyword" placeholder="请输入关键字（不输入关键字返回全部）" @clear="clearKW" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="日期选项" prop="dateType">
                  <el-select v-model="searchForm.dateType" placeholder="筛选类型">
                    <el-option v-for="(item,idx) in searchForm.dateTypes" :key="idx" :label="item.text" :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="14">
                <el-form-item label="日期区间" prop="seDate">
                  <el-date-picker v-model="searchForm.seDate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item style="float:right;margin-bottom:25px;">
                  <el-button type="primary" icon="el-icon-search" @click.native="doSearch(1, pageSize)">查询</el-button>
                  <el-button type="primary" icon="el-icon-refresh-left" @click.native="clearParams">重置</el-button>
                  <el-button type="primary" icon="el-icon-download" v-if="canDownload" @click.native="downloadProjects">下载</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-divider class="bottom-divider">
            <span v-if="!showQueryTip">无筛选条件，显示全部项目</span>
            <span v-if="showQueryTip">根据上方条件的搜索结果</span>
          </el-divider>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div class="table-view">
      <el-table v-loading="listLoading" ref="vTable" :data="list" @current-change="handleCurrentChange" border fit stripe highlight-current-row :header-cell-style="headerCellStyle" v-fit-columns>
        <el-table-column label="id" v-if="false">
          <template slot-scope="{ row }">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="10%" label="编号" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.code }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="20%" label="类型" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.projectTypeName }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="35%" label="名称" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="15%" label="进度" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.progressName }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="10%" label="部门" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.departmentName }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="10%" label="技术负责人" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.techniqueAdminsFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="10%" label="市场负责人" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.marketAdminNamesFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="10%" label="开始时间" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.startFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="10%" label="结束时间" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.completionFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="10%" label="录入时间" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.createTimeFormat }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="height:20px;width:100%;" />
    <el-pagination :current-page="currentPage" :page-sizes="[10, 20, 30]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="parseInt(total)" @size-change="handleSizeChange" @current-change="handleCurrentPageChange" />
    <!-- 人员任命 -->
    <el-dialog :title="pCurPrjTitle" :visible.sync="appointDialogVisible" :close-on-click-modal="false" @close="closeAppoint" width="66%">
      <project-appoint :projectId="pCurPrjId" v-if="appointFlag"></project-appoint>
      <span slot="footer" class="dialog-footer">
        <el-button @click="appointDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
    <!-- 里程碑 -->
    <el-dialog :title="pCurPrjTitle" :visible.sync="milestoneDialogVisible" :close-on-click-modal="false" @close="closeMilestone" width="60%">
      <project-milestone :projectId="pCurPrjId" v-if="milestoneFlag"></project-milestone>
      <span slot="footer" class="dialog-footer">
        <el-button @click="milestoneDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
    <!-- 分享 -->
    <el-dialog :title="pCurPrjTitle" :visible.sync="shareDialogVisible" :close-on-click-modal="false" @close="closeShare" width="60%">
      <project-share :projectId="pCurPrjId" v-if="shareFlag"></project-share>
      <span slot="footer" class="dialog-footer">
        <el-button @click="shareDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import { fetchProjectListPaged, delProject } from '@/api/project';
import { headerCellStyle, columnStyle } from '@/utils/commonFunction'
import ProjectAppoint from '@/views/project/components/project-appoint'
import ProjectMilestone from '@/views/project/components/project-milestone'
import ProjectShare from '@/views/project/components/project-share'
import { checkAuth } from '@/utils/permission'
export default {
  name: 'ProjectList',
  components: { ProjectAppoint, ProjectMilestone, ProjectShare },
  data() {
    return {
      rules: {},
      list: [],
      listLoading: true,
      pageSize: 10,
      currentPage: 1,
      total: 0,
      currentRow: null,
      appointFlag: false,
      appointDialogVisible: false,
      milestoneFlag: false,
      milestoneDialogVisible: false,
      shareFlag: false,
      shareDialogVisible: false,
      pCurPrjTitle: '',
      // 当前选中的项目ID,传递给子组件
      pCurPrjId: '',
      searchForm: {
        searchType: 0,
        keyword: '',
        searchTypeOpts: [
          { text: '全部', value: 0 },
          { text: '项目名称', value: 3 },
          { text: '项目类型', value: 1 },
          { text: '承担部门', value: 2 },
          { text: '项目负责', value: 4 },
          { text: '市场负责', value: 5 },
          { text: '技术负责', value: 6 },],
        // 日期过滤的枚举， 0 创建日期 1 开始日期  2 结束日期 ，落在下面的区间内
        dateType: 0,
        dateTypes: [{ id: 0, text: '创建时间' }, { id: 1, text: '开始日期' }, { id: 2, text: '结束日期' }],
        seDate: '',
        startDate: new Date(),
        endDate: new Date(),
      },
      showQueryTip: false,
      canDownload: false,
    };
  },
  computed: {},
  created() {
    this.getList(1, this.pageSize);
  },
  methods: {
    // 获取数据列表
    getList(cPage, pSize) {
      let that = this
      that.listLoading = true
      that.list = []
      const param = {
        skpCount: (cPage - 1) * this.pageSize,
        maxCount: pSize,
        searchType: 0, searchValue: '',
        dateType: 0, steartDate: '1900-1-1', endDate: '2099-12-31'
      }
      fetchProjectListPaged(param).then(res => {
        that.total = res.data.totalCount
        that.list = res.data.items
        that.canDownload = res.data.canDownloadProjects
        that.listLoading = false
      }).catch(err => { that.$message.error('错误信息：' + err) })
    },
    // 执行搜索
    doSearch(cPage, pSize) {
      let that = this
      that.listLoading = true
      that.list = []
      const param = {
        skpCount: (cPage - 1) * this.pageSize,
        maxCount: pSize,
        searchType: that.searchForm.searchType,
        searchValue: that.searchForm.keyword,
        dateType: that.searchForm.dateType, startDate: that.searchForm.seDate[0], endDate: that.searchForm.seDate[1]
      }
      // 后台逻辑: 如果不输入关键字, 要把搜索类型设置为"全部"
      if (param.searchValue === '') {
        param.searchType = 0
      }
      if (param.startDate === undefined || param.endDate === undefined) {
        if (param.searchValue === '') {
          this.getList(1, this.pageSize);
        } else {
          // 因为日期区间是后台必填项,这里设置一个长期的时间段.
          param.startDate = '1979-1-1'
          param.endDate = '2099-12-31'
          fetchProjectListPaged(param).then(res => {
            that.total = res.data.totalCount
            that.list = res.data.items
            that.listLoading = false
            that.canDownload = res.data.canDownloadProjects
            that.showQueryTip = true
          }).catch(err => { that.$message.error('错误信息：' + err) })
        }
      }
    },
    // 清空关键字
    clearKW() {
      this.getList(1, this.pageSize);
      this.showQueryTip = false;
    },
    clearParams() {
      this.getList(1, this.pageSize);
      Object.assign(this.$data.searchForm, this.$options.data().searchForm)
      this.showQueryTip = false;
    },
    goEdit() {
      this.$router.push({ path: '/project/edit/' + this.currentRow.id })
    },
    goView() {
      this.$router.push({ path: '/project/view/' + this.currentRow.id })
    },
    goCreate() {
      this.$router.push({ path: '/project/create' })
    },
    // 人员任命
    showAppoint() {
      if (this.appointDialogVisible === false) {
        this.pCurPrjTitle = this.currentRow.name + ' - 项目人员'
        this.pCurPrjId = this.currentRow.id
        this.appointFlag = true
        this.appointDialogVisible = true
      }
    },
    closeAppoint() {
      this.appointFlag = false
      this.appointDialogVisible = false
    },
    // 里程碑
    showMilestone() {
      if (this.milestoneDialogVisible === false) {
        this.pCurPrjTitle = this.currentRow.name + ' - 里程碑'
        this.pCurPrjId = this.currentRow.id
        this.milestoneFlag = true
        this.milestoneDialogVisible = true
      }
    },
    closeMilestone() {
      this.milestoneFlag = false
      this.milestoneDialogVisible = false
    },
    // 分享
    showShare() {
      if (this.shareDialogVisible === false) {
        this.pCurPrjTitle = this.currentRow.name + ' - 分享'
        this.pCurPrjId = this.currentRow.id
        this.shareFlag = true
        this.shareDialogVisible = true
      }
    },
    closeShare() {
      this.shareFlag = false
      this.shareDialogVisible = false
    },
    // 删除项目
    deleteProject() {
      this.$confirm('永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        delProject(this.currentRow).then((res) => {
          const idx = this.list.findIndex(a => a.id === this.currentRow.id)
          this.list.splice(idx, 1);
          this.total = this.list.length;
          this.$message({
            type: 'success',
            message: '删除成功!',
          });
        }).catch(error => { this.$message.error("删除失败，错误：" + error) });
      }).catch((err) => {
        this.$message({
          type: 'info',
          message: '已取消删除',
        });
      });
    },
    downloadProjects() {
      console.log('todo')
    },
    // 选中行
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    // 取消选中行
    cancelSelected() {
      this.$refs.vTable.setCurrentRow()
      this.pCurPrjId = null
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
    headerCellStyle,
    columnStyle,
    checkAuth
  },
};
</script>

<style lang="scss">
.query-box {
  .el-collapse-item__header {
    font-size: 1rem;
    background-color: #f5f5f7;
    border-top: 2px solid #72b8ff;
    padding-left: 15px;
    margin-bottom: 10px;
    &.is-active {
      border-top: 2px solid #0a76e2;
    }
    i {
      margin-right: 10px;
    }
  }
  .el-select,
  .el-date-editor {
    width: 100%;
  }
  .bottom-divider {
    margin-top: 0px;
  }
}
</style>
<style lang="scss">
</style>