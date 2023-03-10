<template>
  <!-- 项目详情 -->
  <div class="app-container project-detail">
    <div class="prj-title">{{postForm.name}}</div>
    <el-collapse v-model="activeNames">
      <el-collapse-item title="基本信息" name="1">
        <el-form ref="postForm" :loading="loading" :model="postForm" :rules="rules" label-width="100px" :disabled="allDisabled">
          <el-row>
            <el-col :span="16">
              <el-form-item label="id" v-if="false" prop="id">
                <el-input v-model="postForm.id"></el-input>
              </el-form-item>
              <el-form-item label="名称" prop="name">
                <el-input v-model="postForm.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="编号" prop="code">
                <el-input v-model="postForm.code"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="承担部门" prop="departmentName">
                <el-input v-model="postForm.departmentName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="类型" prop="projectTypeName">
                <el-input v-model="postForm.projectTypeName"></el-input>
              </el-form-item>
            </el-col>
            <!-- 该处的合同金额单独权限控制 -->
            <el-col :span="8" v-if="showContractAmount">
              <el-form-item label="合同金额" prop="contractAmount">
                <el-input v-model="postForm.contractAmount" style="width:calc(100% - 70px)"></el-input>
                <!-- 单独开一个form只是为了控制按钮的可用性 -->
                <el-form :disabled="!canEditContractAmount" class="btnContractAmount">
                  <el-form-item>
                    <el-button type="primary" plain @click.prevent="openContractAmount()">设置 </el-button>
                  </el-form-item>
                </el-form>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="负责人" prop="projectManager">
                <el-input v-model="projectManager"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="开始时间" prop="startFormat">
                <el-input v-model="postForm.startFormat"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="结束时间" prop="completionFormat">
                <el-input v-model="postForm.completionFormat"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="城市" prop="cityName">
                <el-input v-model="postForm.cityName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="区县" prop="county">
                <el-input v-model="postForm.county"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="乡镇" prop="town">
                <el-input v-model="postForm.town"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="难易程度" prop="importanceName">
                <el-input v-model="postForm.importanceName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="技术负责" prop="projectTechniqueAdmins">
                <el-input v-model="projectTechniqueAdmins"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="市场负责" prop="projectMarketAdmins">
                <el-input v-model="projectMarketAdmins"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="甲方名称" prop="partA">
                <el-input v-model="postForm.partA"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="甲方联系人" prop="partAContact">
                <el-input v-model="postForm.partAContact"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="甲方电话" prop="partAPhone">
                <el-input v-model="postForm.partAPhone"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="项目评价" prop="evaluation">
                <el-input type="textarea" v-model="postForm.evaluation"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-collapse-item>
      <el-collapse-item title="进度节点" name="2">
        <!-- 用时间线实现节点信息，timestamp是阶段名称 -->
        <el-timeline>
          <el-timeline-item v-for="(stage, index) in stages" :key="index" :timestamp="stage.name" placement="top" size="large" icon="el-icon-location-information" type="primary" class="node-item-container">
            <el-card v-for="(node, idx) in stage.nodes" :key="idx" :class="[{leftNote: node.nodeType==2},{leftArchive:node.nodeType===1}]" v-loading="nodeLoading" element-loading-text="获取中...">
              <div v-if="node.nodeType===2">
                <div class="type-name">{{node.noteTypeName}}</div>
                <div class="node-content">{{node.content}}</div>
              </div>
              <div v-if="node.nodeType===1">
                <div class="type-name">{{node.archiveTypeName}}</div>
                <div class="node-content archive" title="点击下载该文件2" @click="downloadNodeFile(node)"><i class="el-icon-tickets"></i> {{node.name}}</div>
              </div>
              <div class="edit-info">{{node.updaterName}} @ {{node.updateTimeFormat}} <span v-if="node.nodeType===1"> | {{node.location}}</span></div>
              <div class="right-btns">
                <el-button v-if="node.canEdit" size="small" @click.native="editNode(node)">修改</el-button><br />
                <el-button type="danger" size="small" v-if="node.canDelete" @click.native="deleteNode(node)">删除</el-button>
              </div>
            </el-card>
          </el-timeline-item>
        </el-timeline>
        <div class="stage-btn">
          <el-button v-if="canAddProjectNote" type="primary" icon="el-icon-chat-line-square" plain @click.native="addNote">添加备注</el-button>
          <el-button v-if="canAddProjectArchive" type="primary" icon="el-icon-document" plain @click.native="addArchive">添加附件</el-button>
        </div>
      </el-collapse-item>
      <el-collapse-item title="项目合同" name="3" v-if="checkAuth('16-1')">
        <div v-if="contracts.length===0">该项目还没有合同</div>
        <div v-else>
          <el-table :data="contracts" border size="small" :header-cell-style="headerCellStyle">
            <el-table-column label="合同名称" min-width="75">
              <template slot-scope="{ row }">
                <span>{{ row.text }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" min-width="25">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" plain @click="viewContract(scope.row)">查看合同详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-divider content-position="center">开票回款信息</el-divider>
        <el-row :gutter="40">
          <el-col :md="12" :xs="24" :sm="24" style="margin-bottom:15px;" v-if="checkAuth('34-1')">
            <el-col :span="16">
              <el-form label-width="70px" label-position="left" :disabled="allDisabled">
                <el-form-item label="开票进度">
                  <el-select v-model="postForm.invoicingProgressName" placeholder="请选择开票进度">
                    <el-option label="未开票" value="1"></el-option>
                    <el-option label="部分开票" value="2"></el-option>
                    <el-option label="全额开票" value="3"></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="6">
              <el-form>
                <el-form-item>
                  <el-button type="primary" size="small" plain @click="addInvoice">新增开票信息</el-button>
                </el-form-item>
              </el-form>
            </el-col>
            <el-table :data="invoiceList" border size="mini" :header-cell-style="headerCellStyle">
              <el-table-column label="开票日期" min-width="30" align="center">
                <template slot-scope="{ row }">
                  <span>{{ row.dateFormat }}</span>
                </template>
              </el-table-column>
              <el-table-column label="开票金额" min-width="30" align="center">
                <template slot-scope="{ row }">
                  <span>{{ row.amount }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" min-width="40">
                <template slot-scope="scope">
                  <el-button-group>
                    <el-button size="mini" type="primary" plain @click="editInvoice(scope.row)">编辑</el-button>
                    <el-button size="mini" type="danger" plain @click="deleteInvoice(scope.row)">删除</el-button>
                  </el-button-group>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :md="12" :xs="24" :sm="24" style="margin-bottom:15px;" v-if="checkAuth('35-1')">
            <el-col :span="16">
              <el-form label-width="70px" label-position="left" :disabled="allDisabled">
                <el-form-item label="回款进度">
                  <el-select v-model="postForm.collectionProgressName" placeholder="请选择回款进度" style="width:100%">
                    <el-option label="未回款" value="1"></el-option>
                    <el-option label="部分回款" value="2"></el-option>
                    <el-option label="全额回款" value="3"></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="6">
              <el-form>
                <el-form-item>
                  <el-button type="primary" size="small" plain @click="addCollection">新增回款信息</el-button>
                </el-form-item>
              </el-form>
            </el-col>
            <el-table :data="collectionList" border size="mini" :header-cell-style="headerCellStyle">
              <el-table-column label="回款日期" min-width="30" align="center">
                <template slot-scope="{ row }">
                  <span>{{ row.dateFormat }}</span>
                </template>
              </el-table-column>
              <el-table-column label="回款金额" min-width="30" align="center">
                <template slot-scope="{ row }">
                  <span>{{ row.amount }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" min-width="40">
                <template slot-scope="scope">
                  <el-button-group>
                    <el-button size="mini" type="primary" plain @click="editCollection(scope.row)">编辑</el-button>
                    <el-button size="mini" type="danger" plain @click="deleteCollection(scope.row)">删除</el-button>
                  </el-button-group>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="24">
            <el-divider content-position="center">信息汇总</el-divider>
            <el-form label-width="85px" label-position="left" :disabled="allDisabled">
              <el-col :span="12">
                <el-form-item label="合同金额">
                  <el-input v-model="postForm.contractAmount"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="开票总金额">
                  <el-input v-model="postForm.invoicingTotal"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="回款金额">
                  <el-input v-model="postForm.collectionTotal"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="未回款金额">
                  <el-input v-model="postForm.unCollectionTotal"></el-input>
                </el-form-item>
              </el-col>
            </el-form>
          </el-col>
        </el-row>
      </el-collapse-item>
      <el-collapse-item title="招投标" name="4" v-if="checkAuth('18-1')">
        <div v-if="bids.length===0">该项目还没有关联招投标信息</div>
        <div v-else>
          <el-table :data="bids" border size="small" :header-cell-style="headerCellStyle">
            <el-table-column label="招投标名称" min-width="75">
              <template slot-scope="{ row }">
                <span>{{ row.text }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" min-width="25">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" plain @click="viewBid(scope.row)">查看招投标详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-collapse-item>
    </el-collapse>
    <el-dialog title="项目节点备注" :visible.sync="dialogVisibleNote" :close-on-click-modal="false" width="50%">
      <el-form ref="noteForm" :model="noteForm" :rules="rules" label-width="80px">
        <el-form-item label="id" v-if="false" prop="id">
          <el-input v-model="noteForm.id"></el-input>
        </el-form-item>
        <el-form-item label="项目阶段" prop="projectStageId" v-if="noteForm.id===''">
          <el-select v-model="noteForm.projectStageId" placeholder="请选择阶段">
            <el-option v-for="(item,idx) in stages" :key="idx" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注类型" prop="noteTypeId">
          <el-select v-model="noteForm.noteTypeId" placeholder="请选择阶段">
            <el-option v-for="(item,idx) in noteTypes" :key="idx" :label="item.text" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注内容" prop="content">
          <el-input type="textarea" v-model="noteForm.content"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleNote = false">取 消</el-button>
        <el-button type="primary" @click="noteSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="项目节点附件" :visible.sync="dialogVisibleArchive" :close-on-click-modal="false" width="50%">
      <el-form ref="archiveForm" :model="archiveForm" :rules="rules" label-width="78px">
        <el-form-item label="id" v-if="false" prop="id">
          <el-input v-model="archiveForm.id"></el-input>
        </el-form-item>
        <el-form-item label="项目阶段" prop="projectStageId" v-if="archiveForm.id===''">
          <el-select v-model="archiveForm.projectStageId" placeholder="请选择阶段">
            <el-option v-for="(item,idx) in stages" :key="idx" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="附件类型" prop="archiveTypeId">
          <el-select v-model="archiveForm.archiveTypeId" placeholder="请选择阶段">
            <el-option v-for="(item,idx) in archiveTypes" :key="idx" :label="item.text" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="上传时间" prop="date">
              <el-date-picker v-model="archiveForm.date" :clearable="false"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上传地点" prop="location">
              <el-input v-model="archiveForm.location"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="附件名称" prop="name">
          <el-input v-model="archiveForm.name"></el-input>
        </el-form-item>
        <!-- 这里的上传路径随便填，因为重写了上传方法 -->
        <el-upload class="upload-component" ref="upload" action="null" :http-request="archiveSubmit" :file-list="fileList" :auto-upload="false" :multiple="false" :on-change="handleFileChange" :on-remove="handleFileRemove" drag>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em><br>文件大小不超过500M</div>
        </el-upload>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleArchive = false">取 消</el-button>
        <el-button type="primary" @click="archiveSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="开票信息" :visible.sync="dialogVisibleInvoice" :close-on-click-modal="false" width="40%">
      <el-form ref="invoiceForm" :model="invoiceForm" :rules="rules" label-width="80px">
        <el-form-item label="id" v-if="false" prop="id">
          <el-input v-model="invoiceForm.id"></el-input>
        </el-form-item>
        <el-form-item label="开票日期" prop="date">
          <el-date-picker v-model="invoiceForm.date" :clearable="false"></el-date-picker>
        </el-form-item>
        <el-form-item label="开票金额" prop="amount ">
          <el-input-number v-model="invoiceForm.amount " :precision="2" :step="0.01"></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleInvoice = false">取 消</el-button>
        <el-button type="primary" @click="invoiceSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="回款信息" :visible.sync="dialogVisibleCollection" :close-on-click-modal="false" width="40%">
      <el-form ref="collectionForm" :model="collectionForm" :rules="rules" label-width="80px">
        <el-form-item label="id" v-if="false" prop="id">
          <el-input v-model="collectionForm.id"></el-input>
        </el-form-item>
        <el-form-item label="回款日期" prop="date">
          <el-date-picker v-model="collectionForm.date" :clearable="false"></el-date-picker>
        </el-form-item>
        <el-form-item label="回款金额" prop="amount">
          <el-input-number v-model="collectionForm.amount " :precision="2" :step="0.01"></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleCollection = false">取 消</el-button>
        <el-button type="primary" @click="collectionSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="编辑合同金额（单位：元）" :visible.sync="dialogVisibleEditContractAmount" :close-on-click-modal="false" width="40%">
      <el-form ref="contractAmountForm" :model="contractAmountForm" :rules="rules" label-position="right" label-width="0px">
        <el-form-item label="" prop="amount">
          <el-input-number v-model="contractAmountForm.amount" :precision="2" :step="0.01" :controls="false">
          </el-input-number>
        </el-form-item>
        <div>系统只接受数字，请不要输入其他字符。</div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleEditContractAmount = false">取 消</el-button>
        <el-button type="primary" @click="contractAmountSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import {
  fetchProjectDetail,
  newProjectNote, fetchProjectNote, createProjectNote, editProjectNote, delProjectNote,
  newProjectArchive, fetchProjectArchive, createProjectArchive, editProjectArchive, delProjectArchive,
  fetchInvoices, createInvoicingProgress, editInvoicingProgress, delInvoicingProgress,
  fetchCollections, createCollectionProgress, editCollectionProgress, delCollectionProgress,
  editProjectContractAmount
} from '@/api/project';
import { downloadFile } from '@/utils/req-down'
import { deepClone } from '@/utils/index'
import { checkAuth } from '@/utils/permission'
export default {
  name: 'ProjectDetail',
  data() {
    return {
      loading: true,
      activeNames: ['1', '2', '3', '4'],
      allDisabled: false,
      canAddProjectNote: true,
      canAddProjectArchive: true,
      postForm: {
        id: '', //当前项目的id，也是路由入参
        name: '',
        code: '',
        projectTypeName: '',
        startFormat: '',
        completionFormat: '',
        departmentName: '',
        importanceName: '',
        cityName: '',
        county: '',
        town: '',
        partA: '',
        partAContact: '',
        partAPhone: '',
        projectStage: [],
        invoicingProgressName: '',
        collectionProgressName: '',
        contractAmount: 0,
        invoicingTotal: 0,
        collectionTotal: 0,
        unCollectionTotal: 0,
      },
      // 单独编辑的项目基本信息中的合同金额
      contractAmountForm: { amount: 0 },
      // 显示项目基本信息中的合同金额
      showContractAmount: false,
      // 控制项目基本信息中的合同金额可否编辑
      canEditContractAmount: true,
      // 编辑项目金额的弹窗
      dialogVisibleEditContractAmount: false,
      projectManager: '', //项目负责人
      projectTechniqueAdmins: '', // 技术负责人
      projectMarketAdmins: '', // 市场负责人
      dialogVisibleNote: false,
      noteForm: {
        id: '',
        projectId: '',
        projectStageId: '',
        noteTypeId: '',
        content: '',
      },
      dialogVisibleArchive: false,
      archiveForm: {
        id: '',
        projectId: '',
        projectStageId: '',
        archiveTypeId: '',
        date: new Date(),
        location: '',
        name: '',
      },
      nodeLoading: false,
      stages: [],
      noteTypes: [],
      archiveTypes: [],
      fileList: [],
      archiveFile: '',
      contracts: [],
      bids: [],
      rules: {
        projectStageId: [{ required: true, message: '请选择阶段', trigger: 'blur' }],
        noteTypeId: [{ required: true, message: '请选择类型', trigger: 'blur' }],
        noteContent: [{ required: true, message: '请输入内容', trigger: 'blur' }],
        archiveTypeId: [{ required: true, message: '请选择附件类型', trigger: 'blur' }],
        date: [{ required: true, message: '请选择日期', trigger: 'blur' }],
        name: [{ required: true, message: '请输入文件名称', trigger: 'change' }],
      },
      dialogVisibleInvoice: false,
      invoiceForm: { id: '', projectId: '', date: new Date(), amount: 0 },
      invoiceList: [],
      dialogVisibleCollection: false,
      collectionForm: { id: '', projectId: '', date: new Date(), amount: 0 },
      collectionList: [],
    };
  },
  props: {},
  created() {
    this.postForm.id = this.$route.params && this.$route.params.id
    this.getProjectDetail()
    this.allDisabled = true
  },
  methods: {
    // 获取数据列表
    getProjectDetail() {
      this.loading = true;
      this.list = [];
      fetchProjectDetail(this.postForm.id).then(res => {
        console.log(res.data)
        this.postForm = res.data.project
        this.showContractAmount = res.data.showAmount
        this.canEditContractAmount = res.data.canEditAmount
        this.projectManager = res.data.projectManager
        this.projectTechniqueAdmins = res.data.projectTechniqueAdmins === null ? '' : res.data.projectTechniqueAdmins.toString()
        this.projectMarketAdmins = res.data.projectMarketAdmins === null ? '' : res.data.projectMarketAdmins.toString()
        this.stages = res.data.project.projectStages
        this.canAddProjectNote = res.data.canAddProjectNote
        this.canAddProjectArchive = res.data.canAddProjectArchive
        // 显示合同信息
        this.fillContracts()
        // 显示招投标信息
        this.fillBids()
        // 获取开票和回款信息列表-先检查权限，没有权限就不执行
        if (checkAuth('34-1')) {
          this.getInvoices()
        }
        if (checkAuth('35-1')) {
          this.getCollections()
        }
        this.loading = false
      }).catch(err => { this.$message.error({ message: '错误信息：' + err }) })
    },
    addNote() {
      newProjectNote().then((res) => {
        this.noteTypes = res.data.projectNoteTypes
        if (this.$refs.noteForm !== undefined) {
          // 清空校验信息
          this.$refs.noteForm.resetFields()
        }
        // 这个方法用于重置data属性中的值。
        Object.assign(this.$data.noteForm, this.$options.data().noteForm)
        this.dialogVisibleNote = true
      }).catch((err) => { this.$message.error('错误信息：' + err,) })
    },
    editNode(data) {
      const that = this
      if (data.noteTypeId !== undefined) {
        fetchProjectNote(data.id).then((res) => {
          that.noteTypes = res.data.projectNoteTypes
          if (that.$refs.noteForm !== undefined) {
            that.$refs.noteForm.clearValidate()
          }
          that.noteForm = res.data.projectNote
          that.dialogVisibleNote = true
        }).catch((err) => { this.$message.error('错误信息：' + err,) })
      }
      else {
        fetchProjectArchive(data.id).then((res) => {
          that.archiveTypes = res.data.projectArchiveTypes
          if (that.$refs.archiveForm !== undefined) {
            that.$refs.archiveForm.clearValidate()
          }
          that.archiveForm = res.data.projectArchive
          that.archiveForm.date = res.data.projectArchive.updateTime
          that.fileList = []
          that.archiveFile = ''
          that.dialogVisibleArchive = true
        }).catch((err) => { this.$message.error('错误信息：' + err,) })
      }
    },
    noteSubmit() {
      this.$refs.noteForm.validate((valid) => {
        if (valid) {
          this.noteForm.projectId = this.postForm.id
          // 新建
          if (this.noteForm.id === '') {
            createProjectNote(this.noteForm).then(res => {
              res.data.canEdit = true
              res.data.canDelete = true
              const idx = this.stages.findIndex(x => x.id === this.noteForm.projectStageId)
              if (this.stages[idx].nodes === null) {
                this.stages[idx].nodes = [res.data]
              }
              else {
                this.stages[idx].nodes.unshift(res.data)
              }
              this.$message.success('新建成功！')
              this.dialogVisibleNote = false
            }).catch(err => { this.$message.error('新建失败：' + err) })
          }
          // 编辑更新
          else {
            editProjectNote(this.noteForm).then((res) => {
              const idx = this.stages.findIndex(x => x.id === this.noteForm.projectStageId)
              const idy = this.stages[idx].nodes.findIndex(y => y.id === this.noteForm.id)
              res.data.canEdit = true
              res.data.canDelete = true
              this.stages[idx].nodes[idy] = res.data
              this.$message.success('更新成功！')
              this.dialogVisibleNote = false
            }).catch(err => { this.$message.error('更新失败：' + err) })
          }
        }
      })
    },
    // 删除节点中的卡片，含有备注和附件
    deleteNode(data) {
      this.$confirm('永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        if (data.noteTypeId !== undefined) {
          delProjectNote(data).then((res) => {
            const idx = this.stages.findIndex(x => x.id === data.projectStageId)
            const idy = this.stages[idx].nodes.findIndex(y => y.id === data.id)
            this.stages[idx].nodes.splice(idy, 1)
            this.$message.success('删除成功！');
          });
        }
        else {
          delProjectArchive(data).then((res) => {
            const idx = this.stages.findIndex(x => x.id === data.projectStageId)
            const idy = this.stages[idx].nodes.findIndex(y => y.id === data.id)
            this.stages[idx].nodes.splice(idy, 1)
            this.$message.success('删除成功！');
          });
        }
      }).catch((err) => { this.$message.info('删除操作已取消'); });
    },

    addArchive() {
      newProjectArchive().then((res) => {
        this.archiveTypes = res.data.projectArchiveTypes
        if (this.$refs.archiveForm !== undefined) {
          // 清空校验信息
          this.$refs.archiveForm.resetFields()
        }
        // 这个方法用于重置data属性中的值。
        Object.assign(this.$data.archiveForm, this.$options.data().archiveForm)
        this.fileList = []
        this.archiveFile = ''
        this.dialogVisibleArchive = true
      }).catch((err) => { this.$message.error('错误信息：' + err,) })
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
            this.archiveForm.projectId = this.postForm.id
            createProjectArchive(this.archiveForm, formData).then(res => {
              res.data.canEdit = true
              res.data.canDelete = true
              const idx = this.stages.findIndex(x => x.id === this.archiveForm.projectStageId)
              if (this.stages[idx].nodes === null) {
                this.stages[idx].nodes = [res.data]
              }
              else {
                this.stages[idx].nodes.unshift(res.data)
              }
              this.$message.success('上传附件成功！')
              this.dialogVisibleArchive = false
            }).catch(err => { this.$message.error("上传失败！") })
          }
          // 编辑
          else {
            const formData = new FormData()
            formData.append('file', this.archiveFile.raw)
            this.archiveForm.projectId = this.postForm.id
            editProjectArchive(this.archiveForm, formData).then(res => {
              const idx = this.stages.findIndex(x => x.id === this.archiveForm.projectStageId)
              const idy = this.stages[idx].nodes.findIndex(y => y.id === this.archiveForm.id)
              res.data.canEdit = true
              res.data.canDelete = true
              this.stages[idx].nodes[idy] = res.data
              this.$message.success('更新成功！')
              this.dialogVisibleArchive = false
            }).catch(err => { this.$message.error("编辑失败！") })
          }
        }
      })
    },
    // 下载节点上的文件
    downloadNodeFile(data) {
      this.nodeLoading = true
      const pConfig = {
        url: process.env.VUE_APP_BASE_API + '/Projects/DownloadProjectArchive?id=' + data.id
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
          this.nodeLoading = false
          document.body.removeChild(link) // 下载完成移除元素
          window.URL.revokeObjectURL(url) // 释放掉blob对象
        } else { // IE 10+
          window.navigator.msSaveBlob(blob, fileName)
        }
      }).catch(err => {
        this.$message.error("获取下载文件失败" + err)
        this.nodeLoading = false
      })
    },

    // 填充合同信息
    fillContracts() {
      if (this.postForm.contractNames !== null) {
        for (let k in this.postForm.contractNames) {
          const element = this.postForm.contractNames[k];
          const cTemp = { id: k, text: element }
          this.contracts.push(cTemp)
        }
      }
    },
    viewContract(data) {
      this.$router.push({ path: '/contract/detail/' + data.id })
    },

    // 填招投标同信息
    fillBids() {
      if (this.postForm.bidNames !== null) {
        for (let k in this.postForm.bidNames) {
          const element = this.postForm.bidNames[k];
          const cTemp = { id: k, text: element }
          this.bids.push(cTemp)
        }
      }
    },
    viewBid(data) {
      this.$router.push({ path: '/bid/detail/' + data.id })
    },
    // 获取开票信息
    getInvoices() {
      fetchInvoices(this.postForm.id).then((res) => {
        this.invoiceList = res.data.filter(a => a.status === 1)
        if (this.invoiceList.length > 0) {
          this.postForm.invoicingProgressName = '2'
          // 计算界面上的开票汇总信息
          this.postForm.invoicingTotal = 0
          this.invoiceList.forEach(e => {
            this.postForm.invoicingTotal += e.amount
          })
        }
        else {
          this.postForm.invoicingProgressName = '1'
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error("获取开票信息失败！");
      });
    },
    // 新增开票信息
    addInvoice() {
      if (this.$refs.invoiceForm !== undefined) {
        this.$refs.invoiceForm.resetFields()
      }
      Object.assign(this.$data.invoiceForm, this.$options.data().invoiceForm)
      this.dialogVisibleInvoice = true
    },
    // 编辑开票信息
    editInvoice(data) {
      if (this.$refs.invoiceForm !== undefined) {
        this.$refs.invoiceForm.clearValidate()
      }
      this.invoiceForm = deepClone(data)
      this.dialogVisibleInvoice = true
    },
    // 开票信息提交
    invoiceSubmit() {
      this.$refs.invoiceForm.validate((valid) => {
        if (valid) {
          this.invoiceForm.projectId = this.postForm.id
          // 新建
          if (this.invoiceForm.id === '') {
            createInvoicingProgress(this.invoiceForm).then((res) => {
              this.$message.success('新建成功！')
              this.getInvoices()
              this.dialogVisibleInvoice = false
            }).catch((err) => { this.$message.error('新建失败：' + err) })
          }
          // 编辑更新
          else {
            editInvoicingProgress(this.invoiceForm).then((res) => {
              this.$message.success('更新成功！')
              this.getInvoices()
              this.dialogVisibleInvoice = false
            }).catch((err) => { this.$message.error('更新失败：' + err) })
          }
        }
      })
    },
    // 删除开票信息
    deleteInvoice(data) {
      this.$confirm('永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        delInvoicingProgress(data).then((res) => {
          this.getInvoices()
          this.$message.success('删除成功！');
        });
      }).catch((err) => { this.$message.info('删除操作已取消'); });
    },
    // 获取回款信息
    getCollections() {
      fetchCollections(this.postForm.id).then(res => {
        this.collectionList = res.data.filter(a => a.status === 1)
        if (this.collectionList.length > 0) {
          this.postForm.collectionProgressName = '2'
          this.postForm.collectionTotal = 0
          this.collectionList.forEach(e => {
            this.postForm.collectionTotal += e.amount
          })
          this.postForm.invoicingTotal
          this.postForm.unCollectionTotal = this.postForm.contractAmount - this.postForm.collectionTotal
        }
        else { this.postForm.collectionProgressName = '1' }
      }).catch(err => { this.$message.error("获取回款信息失败！") });
    },
    // 新增回款信息
    addCollection() {
      if (this.$refs.collectionForm !== undefined) {
        this.$refs.collectionForm.resetFields()
      }
      Object.assign(this.$data.collectionForm, this.$options.data().collectionForm)
      this.dialogVisibleCollection = true
    },
    // 编辑回款信息
    editCollection(data) {
      if (this.$refs.collectionForm !== undefined) {
        this.$refs.collectionForm.clearValidate()
      }
      this.collectionForm = deepClone(data)
      this.dialogVisibleCollection = true
    },
    // 回款信息提交
    collectionSubmit() {
      this.$refs.collectionForm.validate((valid) => {
        if (valid) {
          this.collectionForm.projectId = this.postForm.id
          // 新建
          if (this.collectionForm.id === '') {
            createCollectionProgress(this.collectionForm).then((res) => {
              this.$message.success('新建成功！')
              this.getCollections()
              this.dialogVisibleCollection = false
            }).catch((err) => { this.$message.error('新建失败：' + err) })
          }
          // 编辑更新
          else {
            editCollectionProgress(this.collectionForm).then((res) => {
              this.$message.success('更新成功！')
              this.getCollections()
              this.dialogVisibleCollection = false
            }).catch((err) => { this.$message.error('更新失败：' + err) })
          }
        }
      })
    },
    // 删除回款信息
    deleteCollection(data) {
      this.$confirm('永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        delCollectionProgress(data).then((res) => {
          this.getCollections()
          this.$message.success('删除成功！');
        });
      }).catch((err) => { this.$message.info('删除操作已取消'); });
    },
    openContractAmount() {
      this.contractAmountForm.amount = this.postForm.contractAmount
      this.dialogVisibleEditContractAmount = true
    },
    // 编辑和金额
    contractAmountSubmit() {
      const param = {
        projectId: this.postForm.id,
        contractAmount: this.contractAmountForm.amount,
      }
      editProjectContractAmount(param).then(res => {
        this.postForm.contractAmount = this.contractAmountForm.amount
        this.$message.success('更新成功！')
        this.dialogVisibleEditContractAmount = false
      }).catch(err => { this.$message.error('更新失败：' + err) })
    },
    headerCellStyle() {
      return { color: '#444', fontSize: '14px', backgroundColor: '#F3F6FC' }
    },
    checkAuth,
  },
};
</script>

<style scoped>
</style>
<style lang="scss">
.project-detail {
  .prj-title {
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
  .el-textarea.is-disabled .el-textarea__inner,
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
  .sub-title {
    font-size: 0.9rem;
    margin-top: 10px;
    padding-left: 10px;
    border-top: 1px solid #0a1ce2;
  }
}
.node-item-container {
  .leftNote {
    border-left: 4px solid #1e7e34;
  }
  .leftArchive {
    border-left: 4px solid #ff851b;
  }
  .el-card {
    margin-top: 10px;
    margin-bottom: 10px;
    position: relative;
    &:last-child {
      margin-bottom: 0px;
    }
  }
  .el-card__body {
    padding: 10px 20px;
    .right-btns {
      position: absolute;
      top: 1rem;
      right: 1rem;
      .el-button {
        margin-top: 10px;
        &:first-child {
          margin-top: 0;
        }
      }
    }
  }
  .el-timeline-item__timestamp {
    font-size: 1.1rem !important;
  }
  &:last-child {
    margin-bottom: 0px;
  }
  .type-name,
  .edit-info {
    color: #606266;
  }
  .node-content {
    font-size: 1rem;
    margin: 5px 0;
    &.archive {
      cursor: pointer;
      color: #0e82f5;
    }
  }
}
.btnContractAmount {
  position: absolute;
  top: 0;
  right: 0;
}
</style>