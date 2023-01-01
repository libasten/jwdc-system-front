<template>
  <!-- 报销单 -->
  <div class="app-container workflow-detail-page">
    <el-row :gutter="20">
      <el-col :md="18" class="detail-div">
        <el-card shadow="hover">
          <div slot="header" class="clearfix">
            <span style="font-size:1.4rem;font-weight:700;">报销单据</span>
          </div>
          <el-row class="base-info">
            <el-col :span="8">
              <span class="label">姓名：</span>
              <span class="text">{{staff}}</span>
            </el-col>
            <el-col :span="8">
              <span class="label">部门：</span>
              <span class="text">{{department}}</span>
            </el-col>
            <el-col :span="8">
              <span class="label">创建时间：</span>
              <span class="text">{{createTime}}</span>
            </el-col>
          </el-row>
          <el-divider></el-divider>
          <div class="section-title">报销信息</div>
          <div class="section-sub-title">报销明细</div>
          <div class="expense-table-div">
            <div class="top-btns">
              <el-button-group v-if="expenseEditable">
                <el-button type="primary" size="mini" icon="el-icon-plus" @click="addExpenseItem">新建</el-button>
                <el-button v-if="expenseCurrentRow!==null" type="primary" size="mini" icon="el-icon-edit" @click="editExpenseItem">编辑</el-button>
                <el-button v-if="expenseCurrentRow!==null" type="primary" size="mini" icon="el-icon-reading" @click="cancelExpenseSelected">取消选中</el-button>
                <el-button v-if="expenseCurrentRow!==null" type="danger" size="mini" icon="el-icon-delete" @click="deleteExpenseItem">删除</el-button>
              </el-button-group>
            </div>
            <div class="table-view">
              <el-table ref="expenseTable" v-loading="expenseLoading" :data="expenseList" border fit stripe highlight-current-row :header-cell-style="innerHeaderCellStyle" @current-change="handleExpenseCurrentChange">
                <el-table-column label="id" v-if="false">
                  <template slot-scope="{ row }">
                    <span>{{ row.id }}</span>
                  </template>
                </el-table-column>
                <el-table-column min-width="8%" label="序号" align="center" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{  scope.$index + 1 }}</span>
                  </template>
                </el-table-column>
                <el-table-column min-width="14%" label="类别" align="center" show-overflow-tooltip>
                  <template slot-scope="{ row }">
                    <span>{{ row.categoryName }}</span>
                  </template>
                </el-table-column>
                <el-table-column min-width="10%" label="单价" header-align="center" align="right" show-overflow-tooltip>
                  <template slot-scope="{ row }">
                    <span>{{ row.amount }}</span>
                  </template>
                </el-table-column>
                <el-table-column min-width="8%" label="数量" align="center" show-overflow-tooltip>
                  <template slot-scope="{ row }">
                    <span>{{ row.count }}</span>
                  </template>
                </el-table-column>
                <el-table-column min-width="10%" label="合计" header-align="center" align="right" show-overflow-tooltip>
                  <template slot-scope="{ row }">
                    <span>{{ row.totalAmount }}</span>
                  </template>
                </el-table-column>
                <el-table-column min-width="15%" label="时间" header-align="center" align="center" show-overflow-tooltip>
                  <template slot-scope="{ row }">
                    <span>{{ row.date|dateFormat }}</span>
                  </template>
                </el-table-column>
                <el-table-column min-width="34%" label="说明" align="center" show-overflow-tooltip>
                  <template slot-scope="{ row }">
                    <span>{{ row.description }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div class="section-sub-title" style="margin-top:10px;">报销总金额：<span class="sum">{{getExpenseSum}}</span>元</div>
          <div class="section-sub-title">报销说明</div>
          <el-input type="textarea" :disabled="!expenseEditable" v-model="flow.reason"></el-input>
          <div class="section-sub-title">关联项目 <span style="color:#909399;font-weight:500;font-size:0.6rem;">支持搜索，非必填</span></div>
          <el-select v-model="flow.projectId" filterable clearable :disabled="!expenseEditable">
            <el-option v-for="(item,idx) in projects" :key="idx" :label="item.text" :value="item.id"></el-option>
          </el-select>
          <div class="section-sub-title">行动日志</div>
          <div class="log-table-div">
            <div class="top-btns">
              <el-button-group v-if="expenseEditable">
                <el-button type="primary" size="mini" icon="el-icon-plus" @click="addLog">新建</el-button>
                <el-button v-if="logCurrentRow!==null" type="primary" size="mini" icon="el-icon-edit" @click="editLog">编辑</el-button>
                <el-button v-if="logCurrentRow!==null" type="primary" size="mini" icon="el-icon-reading" @click="cancelLogSelected">取消选中</el-button>
                <el-button v-if="logCurrentRow!==null" type="danger" size="mini" icon="el-icon-delete" @click="deleteLog">删除</el-button>
              </el-button-group>
            </div>
            <div class="table-view">
              <el-table ref="logTable" v-loading="logLoading" :data="logList" border fit stripe highlight-current-row :header-cell-style="innerHeaderCellStyle" @current-change="handleExpenseCurrentChange">
                <el-table-column label="id" v-if="false">
                  <template slot-scope="{ row }">
                    <span>{{ row.id }}</span>
                  </template>
                </el-table-column>
                <el-table-column min-width="8%" label="序号" align="center" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{  scope.$index + 1 }}</span>
                  </template>
                </el-table-column>
                <el-table-column min-width="15%" label="开始时间" align="center" show-overflow-tooltip>
                  <template slot-scope="{ row }">
                    <span>{{ row.startDate|dateFormat }}</span>
                  </template>
                </el-table-column>
                <el-table-column min-width="15%" label="结束时间" align="center" show-overflow-tooltip>
                  <template slot-scope="{ row }">
                    <span>{{ row.endDate|dateFormat }}</span>
                  </template>
                </el-table-column>
                <el-table-column min-width="12%" label="出发地" align="center" show-overflow-tooltip>
                  <template slot-scope="{ row }">
                    <span>{{ row.startLocation }}</span>
                  </template>
                </el-table-column>
                <el-table-column min-width="12%" label="目的地" align="center" show-overflow-tooltip>
                  <template slot-scope="{ row }">
                    <span>{{ row.targetLocation }}</span>
                  </template>
                </el-table-column>
                <el-table-column min-width="25%" label="行程安排" align="center" show-overflow-tooltip>
                  <template slot-scope="{ row }">
                    <span>{{ row.arrangement }}</span>
                  </template>
                </el-table-column>
                <el-table-column min-width="14%" label="备注说明" align="center" show-overflow-tooltip>
                  <template slot-scope="{ row }">
                    <span>{{ row.description }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <el-divider></el-divider>
          <div class="section-title">审批信息</div>
          <div class="section-sub-title">财务意见 </div>
          <el-input v-model="financeOffice" disabled> </el-input>
        </el-card>
      </el-col>
      <el-col :md="6" class="op-div">
        <el-card shadow="hover">
          <div slot="header" class="clearfix">
            <span style="font-size:1.4rem">流程操作</span>
          </div>
          <div class="op-btns">
            <el-button plain v-if="showSaveBtn" icon="el-icon-camera" type="primary" @click.native="save">保存</el-button>
            <el-button plain v-if="showCommitBtn" icon="el-icon-position" type="primary" @click.native="agree">提交</el-button>
            <el-button plain v-if="showAgreeBtn" icon="el-icon-check" type="primary" @click.native="agree">同意</el-button>
            <el-button plain v-if="showDisAgreeBtn" icon="el-icon-close" type="primary" @click.native="disagree">拒绝</el-button>
            <el-button plain icon="el-icon-d-arrow-left" @click.native="goTodo">返回</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog title="报销明细" :visible.sync="dialogVisibleExpense" :close-on-click-modal="false" width="60%">
      <el-form ref="expenseForm" :model="expenseForm" :rules="rules" label-width="60px">
        <el-form-item label="id" v-if="false" prop="id">
          <el-input v-model="expenseForm.id"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="类别" prop="category">
              <el-select v-model="expenseForm.category" filterable>
                <el-option v-for="(item,idx) in categories" :key=idx :value="item.id" :label="item.text"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="时间" prop="date">
              <el-date-picker v-model="expenseForm.date" :clearable="false"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单价" prop="amount">
              <el-tooltip effect="dark" content="单位：元，只接受2位小数，精确到角。" placement="bottom">
                <el-input-number v-model="expenseForm.amount" :min="0" :controls="false" :precision="2"></el-input-number>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="数量" prop="count">
              <el-tooltip effect="dark" content="只接受正整数。" placement="bottom">
                <el-input-number v-model="expenseForm.count" :min="0" :controls="false" :precision="0"></el-input-number>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="小计" prop="totalAmount">
              <el-tooltip effect="dark" content="单位：元，自动计算，无需编辑。" placement="bottom">
                <el-input v-model="totalAmount" disabled></el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="说明" prop="description">
              <el-input type="textarea" :rows="3" v-model="expenseForm.description" placeholder="请输入备注说明。"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleExpense = false">取 消</el-button>
        <el-button type="primary" @click="expenseSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="行动日志" :visible.sync="dialogVisibleLog" :close-on-click-modal="false" width="50%">
      <el-form ref="logForm" :model="logForm" :rules="rules" label-width="80px">
        <el-form-item label="id" v-if="false" prop="id">
          <el-input v-model="logForm.id"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="logForm.name"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="logForm.description"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleLog = false">取 消</el-button>
        <el-button type="primary" @click="logSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  saveExpense, fetchExpenseDetail, fetchLogList,
  newExpense, newExpenseCategory, fetchExpenseCategory, createExpenseCategory, editExpenseCategory, delExpenseCategory
} from "@/api/workflow";
import { goTodo } from "@/utils/commonFunction";
import { deepClone } from "@/utils/index";

export default {
  name: 'WorkFlowExpense',
  data() {
    // 自定义校验
    var checkAmount = (rule, value, callback) => {
      if (parseInt(value) === 0) {
        return callback(new Error('不能为0和空值'));
      }
      else {
        callback();
      }
    }
    return {
      flow: {},
      staff: '',
      department: '',
      createTime: '',
      reason: '',
      expenseSum: 0, //报销总金额
      expenseLoading: '',
      expenseList: [],
      expenseCurrentRow: null,
      dialogVisibleExpense: false,
      expenseForm: {
        id: '',
        // 隶属的流程单据，刚初始化的时候不存在ID
        expenseWorkflowId: '',
        // 类别，就是会计科目
        category: '',
        date: new Date(),
        amount: 0,
        count: 1,
        description: '',
      },
      // 会计科目
      categories: [],
      projectId: '',
      projects: [],
      // 单据上信息可否编辑
      expenseEditable: true,
      showSaveBtn: true,
      showCommitBtn: true,
      showAgreeBtn: true,
      showDisAgreeBtn: true,
      logLoading: '',
      logList: [],
      logCurrentRow: null,
      dialogVisibleLog: false,
      logForm: { id: '' },
      // 审批信息
      financeOffice: '同意', //财务专员意见-目前只要审批到这里，只有一个节点。
      rules: {
        category: [{ required: true, message: '请选择费用类别', trigger: 'blur' }],
        date: [{ required: true, message: '请选择时间', trigger: 'blur' }],
        amount: [{ validator: checkAmount, trigger: 'blur' }]
      }
    }
  },
  computed: {
    // 报销明细的小计
    totalAmount: function () {
      return this.expenseForm.amount * this.expenseForm.count
    },
    getExpenseSum: function () {
      let sumTemp = 0
      if (this.expenseList.length > 0) {
        this.expenseList.forEach(a => {
          sumTemp += a.totalAmount
        })
        return sumTemp.toFixed(2)
      }
    },
  },
  filters: {
    dateFormat(val) {
      let temp = new Date(val).toLocaleDateString()
      return temp.replace(/\//g, '-') // 利用正则可以将/换成-的分隔符
    }
  },
  created() {
    this.flow.id = this.$route.params && this.$route.params.id
    this.initPage()
  },
  methods: {
    initPage() {
      this.projects = []
      // 新建
      if (this.flow.id === undefined) {
        newExpense().then(res => {
          this.staff = res.data.starter
          this.department = res.data.department
          this.createTime = res.data.createTime
          this.projects = res.data.projects
          this.expenseEditable = true
          this.showCommitBtn = false
          this.showAgreeBtn = false
          this.showDisAgreeBtn = false
        }
        ).catch(err => { this.$message.error('创建失败：' + err) })
      }
      // 编辑
      else {
        this.expenseLoading = true
        fetchExpenseDetail(this.flow.id).then(res => {
          console.log(res.data)
          this.flow = res.data.expenseWorkflow
          this.staff = this.flow.starterName
          this.department = this.flow.departmentName
          this.createTime = this.flow.createTimeFormat
          this.showSaveBtn = this.flow.canSaveWorkflow
          this.showCommitBtn = this.flow.canCommitWorkflow
          this.showAgreeBtn = this.flow.canApproveWorkflow
          this.showDisAgreeBtn = this.flow.canRejectWorkflow
          this.expenseEditable = this.flow.canReason
          this.reason = this.flow.reason
          this.projects = res.data.projects
          this.projectId = this.flow.projectId
          // 报销明细表
          this.expenseList = res.data.categories
          this.expenseLoading = false
          // 获取行动日志
          this.logLoading = true
          fetchLogList(this.flow.id).then(res => {
            this.logList = res.data
            this.logLoading = false
          })
        }).catch(err => { this.$message.error('获取工作流详情失败：' + err) })
      }
    },
    // 新建报销明细
    addExpenseItem() {
      this.categories = []
      newExpenseCategory().then(res => {
        this.categories = res.data.categories
        this.expenseForm.category = 1
      }).catch(err => { this.$message.error('获取报销费用类别失败：' + err) })
      if (this.$refs.expenseForm !== undefined) {
        this.$refs.expenseForm.clearValidate()
      }
      Object.assign(this.$data.expenseForm, this.$options.data().expenseForm)
      this.dialogVisibleExpense = true
    },
    // 编辑报销明细
    editExpenseItem() {
      if (this.$refs.expenseForm !== undefined) {
        this.$refs.expenseForm.clearValidate()
      }
      fetchExpenseCategory(this.expenseCurrentRow.id).then(res => {
        this.categories = res.data.categories
      }).catch(err => { this.$message.error('获取报销明细项失败：' + err) })
      this.expenseForm = deepClone(this.expenseCurrentRow)
      this.dialogVisibleExpense = true
    },
    // 删除报销明细
    deleteExpenseItem() {
      this.$confirm('永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        delExpenseCategory(this.expenseCurrentRow).then(res => {
          const idx = this.expenseList.findIndex(a => a.id === this.expenseCurrentRow.id)
          this.expenseList.splice(idx, 1);
          this.$message.success('删除成功!');
        });
      }).catch(err => { this.$message.info('已取消删除' + err) });
    },
    // 选中报销明细行
    handleExpenseCurrentChange(val) {
      this.expenseCurrentRow = val;
    },
    // 取消选中报销明细行
    cancelExpenseSelected() {
      this.$refs.expenseTable.setCurrentRow();
    },
    // 报销明细提交
    expenseSubmit() {
      this.$refs.expenseForm.validate((valid) => {
        if (valid) {
          this.expenseForm.expenseWorkflowId = this.flow.id
          // 新建
          if (this.expenseForm.id === '') {
            createExpenseCategory(this.expenseForm).then(res => {
              this.expenseList.unshift(res.data);
              this.dialogVisibleExpense = false
              this.$message.success('新建成功！')
            }).catch(err => { this.$message.error('创建报销明细项失败：' + err) })
          }
          // 编辑
          else {
            editExpenseCategory(this.expenseForm).then(res => {
              const idx = this.expenseList.findIndex(a => a.id === this.expenseCurrentRow.id)
              // 采用这种方法修改数组vue计算属性才能监测到。
              this.$set(this.expenseList, idx, res.data)
              this.$refs.expenseTable.setCurrentRow(this.expenseList[idx]);
              this.$message.success('更新成功！')
              this.dialogVisibleExpense = false
            }).catch(err => { this.$message.error('更新失败：' + err) })
          }
        }
      })
    },
    // 新建行动日志
    addLog() {
      this.dialogVisibleLog = true
    },
    // 编辑行动日志
    editLog() { },
    // 删除行动日志
    deleteLog() { },
    // 选中行动日志行
    handleLogCurrentChange(val) {
      this.logCurrentRow = val;
    },
    // 取消选中行动日志行
    cancelLogSelected() {
      this.$refs.logTable.setCurrentRow();
    },
    // 行动日志提交
    logSubmit() {

    },
    // 保存流程单据
    save() {
      if (this.flow.reason.trim() === '') {
        this.$message.warning('请填写报销说明。')
        return
      }
      saveExpense().then(res => {
        this.flow = res.data
        this.showCommitBtn = true
        this.$message.success('保存单据成功！')
      }).catch(err => { this.$message.error('保存失败：' + err) })
    },
    // 同意流程
    agree() { },
    // 拒绝流程
    disagree() { },
    // 下载报销明细单据
    downloadExpenseTable() { },
    innerHeaderCellStyle() {
      return { color: '#666', fontSize: '14px', backgroundColor: '#F3F6FC' }
    },
    goTodo,
  },
};
</script>

<style scoped>
</style>
<style lang="scss">
.workflow-detail-page {
  padding: 30px 40px;
  .detail-div {
    .el-card {
      padding-bottom: 20px;
      .el-card__header {
        padding: 14px 10px;
        color: #fff;
        text-align: center;
        letter-spacing: 5px;
        background-color: #409eff;
      }
      .section-title {
        color: #1d8eff;
        font-size: 1.1rem;
        margin-bottom: 15px;
      }
      .section-sub-title {
        font-weight: 700;
        margin: 16px 0px 6px 0;
      }
      .base-info {
        margin-top: 10px;
        .label {
          font-weight: 700;
        }
      }
      .sum {
        font-size: 1.2rem;
        margin: 0 10px;
        color: #ff0000;
      }

      .el-input.is-disabled .el-input__inner,
      .el-textarea.is-disabled .el-textarea__inner {
        background-color: #f5f7fa;
        border-color: #fff;
        border-bottom: 1px solid #ccc;
        color: #303133;
      }
    }
  }
  .op-div {
    .el-card {
      text-align: center;
      .el-card__header {
        padding: 14px 10px;
        letter-spacing: 2px;
        border-top: 4px solid #409eff;
      }
      .el-card__body {
        .el-button {
          display: block;
          margin: 0 auto 10px auto;
          width: 140px;
        }
      }
    }
  }
  .el-input-number,
  .el-date-editor,
  .el-select {
    width: 100%;
  }
  .el-input.is-disabled {
    .el-input__inner {
      background-color: rgb(246, 246, 246);
      border-bottom: 1px solid #ababab;
      color: #303133;
      cursor: default;
    }
  }
}
</style>