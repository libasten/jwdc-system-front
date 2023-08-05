<template>
  <!-- 报销单 -->
  <div class="app-container workflow-detail-page">
    <div class="top-op-btns">
      <el-button type="primary" v-if="showSaveBtn" icon="el-icon-document-checked" @click.native="save">保存</el-button>
      <el-button type="primary" v-if="showCommitBtn" icon="el-icon-position" @click.native="agree">提交</el-button>
      <el-button type="primary" v-if="showAgreeBtn" icon="el-icon-check" @click.native="agree">同意</el-button>
      <el-button type="primary" v-if="showDisAgreeBtn" icon="el-icon-close" @click.native="disagree">拒绝</el-button>
      <el-button plain type="primary" icon=" el-icon-d-arrow-left" @click.native="goTodo">返回</el-button>
    </div>
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
      <el-input type="textarea" :disabled="!expenseEditable" v-model="reason"></el-input>
      <div class="section-sub-title">关联项目 <span style="color:#909399;font-weight:500;font-size:0.6rem;">支持搜索，非必填</span></div>
      <el-select v-model="projectId" filterable :clearable=false :disabled="!expenseEditable">
        <el-option v-for="(item,idx) in projects" :key="idx" :label="item.text" :value="item.id"></el-option>
      </el-select>
      <!-- 新增流程完结后保存按钮 -->
      <div class="completedSaveDiv" v-if="showCompletedSave">
        <el-button type="primary" size="small" icon="el-icon-circle-check" @click="saveCompleteWorkflow()">更新保存</el-button>
      </div>
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
          <el-table ref="logTable" v-loading="logLoading" :data="logList" border fit stripe highlight-current-row :header-cell-style="innerHeaderCellStyle" @current-change="handleLogCurrentChange">
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
            <el-table-column min-width="20%" label="开始时间" align="center" show-overflow-tooltip>
              <template slot-scope="{ row }">
                <span>{{ row.startDate|dateTimeFormat }}</span>
              </template>
            </el-table-column>
            <el-table-column min-width="20%" label="结束时间" align="center" show-overflow-tooltip>
              <template slot-scope="{ row }">
                <span>{{ row.endDate|dateTimeFormat }}</span>
              </template>
            </el-table-column>
            <el-table-column min-width="10%" label="出发地" align="center" show-overflow-tooltip>
              <template slot-scope="{ row }">
                <span>{{ row.startLocation }}</span>
              </template>
            </el-table-column>
            <el-table-column min-width="10%" label="目的地" align="center" show-overflow-tooltip>
              <template slot-scope="{ row }">
                <span>{{ row.targetLocation }}</span>
              </template>
            </el-table-column>
            <el-table-column min-width="25%" label="行程安排" align="center" show-overflow-tooltip>
              <template slot-scope="{ row }">
                <span>{{ row.arrangement }}</span>
              </template>
            </el-table-column>
            <el-table-column min-width="10%" label="说明" align="center" show-overflow-tooltip>
              <template slot-scope="{ row }">
                <span>{{ row.description }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <el-divider></el-divider>
      <div class="section-title">审批信息</div>
      <div class="section-sub-title">财务专员意见 </div>
      <el-input v-model="financeOfficeOpinion" disabled> </el-input>
      <div class="section-sub-title">财务经理意见 </div>
      <el-input v-model="financeOpinion" disabled> </el-input>
      <div class="section-sub-title"></div>
      <el-button type="primary" size="small" icon="el-icon-download" @click.native="downloadExpenseTable">下载</el-button>
    </el-card>
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
    <el-dialog title="行动日志" :visible.sync="dialogVisibleLog" :close-on-click-modal="false" width="66%">
      <el-form ref="logForm" :model="logForm" :rules="rules" label-width="80px">
        <el-form-item label="id" v-if="false" prop="id">
          <el-input v-model="logForm.id"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="24">
            <el-form-item label="起止时间" prop="seDate">
              <el-date-picker v-model="logForm.seDate" type="datetimerange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" :default-time="['9:00:00', '18:00:00']" :clearable="false"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出发地点" prop="startLocation">
              <el-input v-model="logForm.startLocation"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="目的地点" prop="targetLocation">
              <el-input v-model="logForm.targetLocation"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="行程安排" prop="arrangement">
              <el-input type="textarea" v-model="logForm.arrangement" placeholder="请输入行程安排"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注说明" prop="remark">
              <el-input type="textarea" v-model="logForm.remark" placeholder="请输入备注说明"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
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
  newExpense, newExpenseCategory, fetchExpenseCategory, createExpenseCategory, editExpenseCategory, delExpenseCategory,
  createLog, editLog, delLog,
  approveExpense, rejectExpense, saveCompleteFlow
} from "@/api/workflow";
import { goTodo } from "@/utils/commonFunction";
import { deepClone } from "@/utils/index";
const ExcelJS = require("exceljs");
import { saveAs } from "file-saver";
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
      logForm: {
        id: '',
        // 隶属的流程单据，刚初始化的时候不存在ID
        expenseWorkflowId: '',
        seDate: '',//行动日志的起止时间数组
        startDate: '', endDate: '',
        startLocation: '', targetLocation: '',
        arrangement: '', remark: ''
      },
      // 审批信息
      financeOfficeOpinion: '', //财务专员意见
      financeOpinion: '', //财务经理意见
      rules: {
        category: [{ required: true, message: '请选择费用类别', trigger: 'blur' }],
        date: [{ required: true, message: '请选择时间', trigger: 'blur' }],
        // 取消 报销单价的数值大于0的验证约束 - Leon@20230325
        // amount: [{ validator: checkAmount, trigger: 'blur' }],
        seDate: [{ required: true, message: '请选择起止时间', trigger: 'blur' }]
      },
      // 控制完结流程保存按钮的可见性
      showCompletedSave: false,
    }
  },
  computed: {
    // 报销明细的小计
    totalAmount: function () {
      return this.expenseForm.amount * this.expenseForm.count
    },
    // 报销总金额
    getExpenseSum: function () {
      let sumTemp = 0
      if (this.expenseList.length > 0) {
        this.expenseList.forEach(a => {
          sumTemp += a.totalAmount
        })
      }
      return sumTemp.toFixed(2)
    },
  },
  filters: {
    dateFormat(val) {
      let ojbDate = new Date(val)
      let temp = ojbDate.toLocaleDateString()
      const weekArr = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
      let wkIdx = ojbDate.getDay()
      return temp.replace(/\//g, '-') + '\xa0\xa0' + weekArr[wkIdx] // 利用正则可以将/换成-的分
    },
    dateTimeFormat(val) {
      let tempDate = new Date(val).toLocaleDateString().replace(/\//g, '-')
      let tempTime = new Date(val).toLocaleTimeString().substring(0, 5)
      return tempDate + ' ' + tempTime
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
          this.projects.unshift({ id: 0, text: '无项目' })
          this.projectId = 0
          this.expenseEditable = true
          this.showCommitBtn = false
          this.showAgreeBtn = false
          this.showDisAgreeBtn = false
          this.showCompletedSave = false
        }
        ).catch(err => { this.$message.error('初始化失败：' + err) })
      }
      // 编辑
      else {
        this.expenseLoading = true
        fetchExpenseDetail(this.flow.id).then(res => {
          this.flow = res.data.expenseWorkflow
          this.staff = this.flow.starterName
          this.department = this.flow.departmentName
          this.createTime = this.flow.createTimeFormat
          this.showSaveBtn = this.flow.canSaveWorkflow
          this.showCommitBtn = this.flow.canCommitWorkflow
          this.showAgreeBtn = this.flow.canApproveWorkflow
          this.showDisAgreeBtn = this.flow.canRejectWorkflow
          this.showCompletedSave = this.flow.canCompletedSave
          this.expenseEditable = this.flow.canReason
          this.reason = this.flow.reason
          this.projects = res.data.projects
          this.projects.unshift({ id: 0, text: '无项目' })
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
          this.financeOfficeOpinion = this.flow.financeOfficeOpinion
          this.financeOpinion = this.flow.financeOpinion
        }).catch(err => { this.$message.error('获取工作流详情失败：' + err) })
      }
    },
    // 新建报销明细
    addExpenseItem() {
      if (this.flow.id === undefined) {
        this.$message.warning('请先保存单据后再添加明细信息。')
        return
      }
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
      if (this.flow.id === undefined) {
        this.$message.warning('请先保存单据后再添加行动日志。')
        return
      }
      if (this.$refs.logForm !== undefined) {
        this.$refs.logForm.clearValidate()
      }
      Object.assign(this.$data.logForm, this.$options.data().logForm)
      this.dialogVisibleLog = true
    },
    // 编辑行动日志
    editLog() {
      if (this.$refs.logForm !== undefined) {
        this.$refs.logForm.clearValidate()
      }
      this.logCurrentRow.seDate = [this.logCurrentRow.startDate, this.logCurrentRow.endDate]
      this.logForm = deepClone(this.logCurrentRow)
      this.dialogVisibleLog = true
    },
    // 删除行动日志
    deleteLog() {
      this.$confirm('永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        delLog(this.logCurrentRow).then(res => {
          const idx = this.logList.findIndex(a => a.id === this.logCurrentRow.id)
          this.logList.splice(idx, 1);
          this.$message.success('删除成功!');
        });
      }).catch(err => { this.$message.info('已取消删除' + err) });
    },
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
      this.$refs.logForm.validate((valid) => {
        if (valid) {
          this.logForm.expenseWorkflowId = this.flow.id
          // 获取拆分开的行动日志起始时间
          this.logForm.startDate = this.logForm.seDate[0]
          this.logForm.endDate = this.logForm.seDate[1]
          // 新建
          if (this.logForm.id === '') {
            createLog(this.logForm).then(res => {
              this.logList.unshift(res.data);
              this.dialogVisibleLog = false
              this.$message.success('新建成功！')
            }).catch(err => { this.$message.error('创建报销明细项失败：' + err) })
          }
          // 编辑
          else {
            editLog(this.logForm).then(res => {
              const idx = this.logList.findIndex(a => a.id === this.logCurrentRow.id)
              // 采用这种方法修改数组vue计算属性才能监测到。
              this.$set(this.logList, idx, res.data)
              this.$refs.logTable.setCurrentRow(this.logList[idx]);
              this.$message.success('更新成功！')
              this.dialogVisibleLog = false
            }).catch(err => { this.$message.error('更新失败：' + err) })
          }
        }
      })
    },
    // 保存流程单据
    save() {
      if (this.reason === null || this.reason.trim() === '') {
        this.$message.warning('请填写报销说明。')
        return
      }
      let params = {
        id: this.flow.id === undefined ? -1 : this.flow.id,
        projectId: this.projectId,
        amount: this.getExpenseSum,
        reason: this.reason
      }
      console.log(params)
      saveExpense(params).then(res => {
        this.flow = res.data
        // 调用全局挂载的方法，关闭当前标签，跳转到详情路由
        if (this.$route.name === 'ExpenseCreate') {
          this.$store.dispatch("tagsView/delView", this.$route);
          this.$router.push({ path: '/workflow/expense/detail/' + this.flow.id })
        }
        this.showCommitBtn = true
        this.$message.success('保存单据成功！')
      }).catch(err => { this.$message.error('保存失败：' + err) })
    },
    // 同意（提交）流程
    agree() {
      let paraTemp = {
        id: this.flow.id,
        projectId: this.projectId,
        amount: this.getExpenseSum,
        reason: this.reason,
        departmentOpinion: this.flow.canDepartmentOpinion ? "同意" : "",
        financeOfficeOpinion: this.flow.canFinanceOfficeOpinion ? "同意" : "",
        generalManagerOpinion: this.flow.canGeneralManagerOpinion ? "同意" : "",
        financeOpinion: this.flow.canFinanceOpinion ? "同意" : "",
      };
      if (parseFloat(paraTemp.amount) === 0) {
        this.$message.warning('报销金额合计不能为0。')
        return;
      }
      approveExpense(paraTemp).then(res => {
        if (res.status == 1) {
          this.$message.success('操作成功！')
          this.$router.push({ path: '/workflow/todo' })
        }
      }).catch(err => { this.$message.error('同意操作失败！' + err) })
    },
    // 拒绝流程
    disagree() {
      let paraTemp = {
        id: this.flow.id,
        departmentOpinion: this.flow.canDepartmentOpinion ? "不同意" : "",
        financeOfficeOpinion: this.flow.canFinanceOfficeOpinion ? "不同意" : "",
        generalManagerOpinion: this.flow.canGeneralManagerOpinion ? "不同意" : "",
        financeOpinion: this.flow.canFinanceOpinion ? "不同意" : "",
      };
      rejectExpense(paraTemp).then(res => {
        if (res.status == 1) {
          this.$message.success('拒绝回退成功！')
          this.$router.push({ path: '/workflow/todo' })
        }
      }).catch(err => { this.$message.error('同意操作失败！' + err) })
    },

    // 更新保存已完结的流程
    saveCompleteWorkflow() {
      const paraTemp = {
        id: this.flow.id,
        projectId: this.projectId,
        reason: this.reason,
      };
      saveCompleteFlow(paraTemp).then(res => {
        if (res.status == 1) {
          this.$message.success('更新保存成功！')
        }
      }).catch(err => { this.$message.error('更新保存完成的流程失败！' + err) })
    },

    // 下载报销明细单据
    downloadExpenseTable() {
      const borderStyle = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" }, }
      const contentCenter = { vertical: "middle", horizontal: "center", wrapText: true, }
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet("报销明细表-单次报销", { views: [{ showGridLines: true }], })
      worksheet.addRow(["报销明细"]).height = 25
      worksheet.getCell("A1").border = borderStyle
      worksheet.mergeCells("A1", "G1")
      // 样式-对齐
      worksheet.getCell("A1").alignment = contentCenter
      // 样式-字体
      worksheet.getCell("A1").font = { size: 16, bold: true }
      let staffName = this.staff
      let departmentName = this.department
      let expenseDate = this.createTime
      let strBlank = "                     "
      worksheet.getCell("A2").value = "报销人：" + staffName + strBlank + "部门：" + departmentName + strBlank + " 报销时间：" + expenseDate
      worksheet.getCell("A2").border = borderStyle
      worksheet.getCell("A2").alignment = contentCenter
      worksheet.mergeCells("A2", "G2")
      worksheet.getRow(2).height = 25
      // 行填充信息
      let titles = ["序号", "科目", "单价", "数量", "合计", "时间", "备注说明"]
      const titleRow = worksheet.addRow(titles)
      titleRow.eachCell(function (cell, colNumber) {
        cell.border = borderStyle
        cell.alignment = contentCenter
      })
      //  从界面上的Table获数据
      let rowDataList = []
      // 样例数据
      // let rowDataList = [
      //     [1, "差旅费", 64.5, 1, 64.5, "2022.3.1", "高铁：南京南-常州北 （去程）"],
      //     [2, "交通费", 64.5, 1, 64.5, "2022.3.1", "高铁：南京南-常州北 （去程）"],
      // ]
      for (let i = 0; i < this.expenseList.length; i++) {
        const e = this.expenseList[i]
        let arrTmep = []
        arrTmep[0] = i + 1
        arrTmep[1] = e.categoryName
        arrTmep[2] = e.amount
        arrTmep[3] = e.count
        arrTmep[4] = e.totalAmount
        // arrTmep[5] = new Date(e.date).toLocaleDateString()
        arrTmep[5] = this.$options.filters['dateFormat'](e.date)
        arrTmep[6] = e.description === null ? '' : e.description
        rowDataList[i] = arrTmep
      }
      rowDataList.forEach((r) => {
        const tempRow = worksheet.addRow(r)
        tempRow.eachCell(function (cell, colNumber) {
          cell.border = borderStyle
          cell.alignment = contentCenter
        })
      })
      // 空行
      let nullRow1 = worksheet.addRow(["", "", "", "", "", "", ""])
      nullRow1.eachCell(function (cell, colNumber) {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFFFF" }, }
      })
      nullRow1.height = 25
      // 报销合计行
      var sumMoney = this.getExpenseSum
      const sumRow = worksheet.addRow(["报销金额合计", "", "", "", sumMoney, "", "",]) // 前两个合并，只要6个
      // 获取新加行的行次 sumRow.number
      worksheet.mergeCells("A" + sumRow.number, "B" + sumRow.number)
      sumRow.eachCell(function (cell, colNumber) {
        cell.border = borderStyle
        cell.alignment = contentCenter
      })
      // 合计信息加粗
      worksheet.getCell("A" + sumRow.number).font = { bold: true }
      worksheet.getCell("E" + sumRow.number).font = { bold: true }
      sumRow.height = 20
      // 空行
      let nullRow2 = worksheet.addRow(["", "", "", "", "", "", ""])
      nullRow2.eachCell(function (cell, colNumber) {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFFFF" }, }
      })
      nullRow2.height = 25
      // 报销说明
      const noteTitleRow = worksheet.addRow(["报销说明"])
      noteTitleRow.height = 20
      worksheet.getCell("A" + noteTitleRow.number).font = { bold: true }
      worksheet.getCell("A" + noteTitleRow.number).alignment = { vertical: "middle" }
      worksheet.mergeCells("A" + noteTitleRow.number, "G" + noteTitleRow.number)
      noteTitleRow.eachCell(function (cell, colNumber) {
        cell.border = borderStyle
      })
      let strNote = this.reason
      const noteRow = worksheet.addRow([strNote])
      worksheet.mergeCells("A" + noteRow.number, "G" + noteRow.number)
      noteRow.eachCell(function (cell, colNumber) {
        cell.border = borderStyle
        cell.alignment = { vertical: "middle", wrapText: true }
      })
      noteRow.height = 60
      // 空行
      let nullRow3 = worksheet.addRow(["", "", "", "", "", "", ""])
      nullRow3.eachCell(function (cell, colNumber) {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFFFF" }, }
      })
      nullRow3.height = 25
      // 关联项目
      const prjTitleRow = worksheet.addRow(["关联项目"])
      prjTitleRow.height = 20
      worksheet.getCell("A" + prjTitleRow.number).font = { bold: true }
      worksheet.getCell("A" + prjTitleRow.number).alignment = { vertical: "middle" }
      worksheet.mergeCells("A" + prjTitleRow.number, "G" + prjTitleRow.number)
      prjTitleRow.eachCell(function (cell, colNumber) { cell.border = borderStyle })
      // 项目名称
      let prjName = this.projects.find(x => x.id === this.projectId).text
      const prjNameRow = worksheet.addRow([" " + prjName])
      prjNameRow.height = 25
      worksheet.getCell("A" + prjNameRow.number).alignment = { vertical: "middle", wrapText: true, }
      worksheet.mergeCells("A" + prjNameRow.number, "G" + prjNameRow.number)
      prjNameRow.eachCell(function (cell, colNumber) {
        cell.border = borderStyle
      })
      // 行动日志
      const logTitleRow = worksheet.addRow(["行动日志"])
      logTitleRow.height = 20
      worksheet.getCell("A" + logTitleRow.number).font = { bold: true }
      worksheet.getCell("A" + logTitleRow.number).alignment = { vertical: "middle" }
      worksheet.mergeCells("A" + logTitleRow.number, "G" + logTitleRow.number)
      logTitleRow.eachCell(function (cell, colNumber) { cell.border = borderStyle })
      let logRow = worksheet.addRow(["序号", "开始时间", "结束时间", "出发前办公地点", "目的地办公地点", "行程安排", "备注说明"])
      logRow.eachCell(function (cell, colNumber) {
        cell.border = borderStyle
        cell.alignment = contentCenter
      })
      let rowLogList = []
      for (let i = 0; i < this.logList.length; i++) {
        const e = this.logList[i]
        let arrTmep = []
        arrTmep[0] = i + 1
        arrTmep[1] = new Date(e.startDate).toLocaleDateString() + ' ' + new Date(e.startDate).toLocaleTimeString()
        arrTmep[2] = new Date(e.endDate).toLocaleDateString() + ' ' + new Date(e.endDate).toLocaleTimeString()
        arrTmep[3] = e.startLocation === null ? '' : e.startLocation
        arrTmep[4] = e.targetLocation === null ? '' : e.targetLocation
        arrTmep[5] = e.arrangement === null ? '' : e.arrangement
        arrTmep[6] = e.remark === null ? '' : e.remark
        rowLogList[i] = arrTmep
      }
      rowLogList.forEach((r) => {
        const tempRow = worksheet.addRow(r)
        tempRow.eachCell(function (cell, colNumber) {
          cell.border = borderStyle
          cell.alignment = contentCenter
        })
      })

      // 空行
      let nullRow4 = worksheet.addRow(["", "", "", "", "", "", ""])
      nullRow4.eachCell(function (cell, colNumber) {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFFFF" }, }
      })
      nullRow4.height = 25
      // 签字区域
      let signText = "       经手人签字:\n\n       部门经理签字：\n\n       总（副总）经理签字："
      let signRow = worksheet.addRow([signText])
      signRow.height = 100
      worksheet.getCell("A" + signRow.number).alignment = {
        wrapText: true,
        vertical: "middle",
      }
      worksheet.getCell("A" + signRow.number).border = borderStyle
      worksheet.mergeCells("A" + signRow.number, "G" + signRow.number)
      // 设置列属性 - 宽度
      worksheet.getColumn(2).width = 20
      worksheet.getColumn(3).width = 20
      worksheet.getColumn(4).width = 20
      worksheet.getColumn(5).width = 20
      worksheet.getColumn(6).width = 40
      worksheet.getColumn(7).width = 35
      // 保存到本地
      workbook.xlsx.writeBuffer().then((buffer) => saveAs(new Blob([buffer]), "报销单导出.xlsx")).catch((err) => console.log("Error writing excel export", err))
    },
    innerHeaderCellStyle() {
      return { color: '#666', fontSize: '14px', backgroundColor: '#F3F6FC' }
    },
    goTodo,
  },
}
</script>

<style scoped>
</style>
<style lang="scss">
.workflow-detail-page {
  padding: 20px 40px;
  .top-op-btns {
    margin-bottom: 10px;
    border-bottom: 1px solid #ddd;
    padding-bottom: 10px;
  }
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
      font-weight: bold;
      margin-bottom: -6px;
    }
    .section-sub-title {
      font-weight: 700;
      margin: 20px 0px 6px 0px;
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

    .completedSaveDiv {
      margin: 10px 0;
    }

    .el-input.is-disabled .el-input__inner,
    .el-textarea.is-disabled .el-textarea__inner {
      background-color: #f5f7fa;
      border-color: #fff;
      border-bottom: 1px solid #ccc;
      color: #303133;
    }
  }

  .op-div {
    .el-card {
      text-align: center;
      .el-card__header {
        padding: 15px 10px;
        letter-spacing: 1px;
        border-top: 5px solid #409eff;
      }
      .el-card__body {
        .el-button {
          display: block;
          margin: 0 auto 10px auto;
          width: 100%;
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