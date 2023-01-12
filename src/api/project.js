import request from '@/utils/request'
//#region 项目管理
// 获取项目列表（不分页，备用）
export function fetchProjectList() {
  return request({
    url: '/Projects/GetProjects',
    method: 'get',
  })
}
// 获取项目列表（后台分页）
export function fetchProjectListPaged(pa) {
  return request({
    url: '/Projects/GetProjects1',
    method: 'get',
    params: pa
  })
}
// 获取单个项目基本信息
export function fetchProjectBase(id) {
  return request({
    url: '/Projects/GetProject?id=' + id,
    method: 'get',
  })
}
// 获取新建项目（基本信息）时候一些枚举数据
export function newProjectBase(id) {
  return request({
    url: '/Projects/NewProject',
    method: 'get',
  })
}
// 创建项目
export function createProject(pa) {
  return request({
    url: '/Projects/CreateProject',
    method: 'post',
    params: pa,
  })
}
// 编辑项目基本信息
export function editProject(pa) {
  return request({
    url: '/Projects/EditProject',
    method: 'post',
    params: pa,
  })
}
// 获取单个项目详情
export function fetchProjectDetail(id) {
  return request({
    url: '/Projects/GetProjectDetail?id=' + id,
    method: 'get',
  })
}

// 删除项目
export function delProject(data) {
  return request({
    url: '/Projects/DeleteProject',
    method: 'delete',
    params: { id: data.id }
  })
}
//#endregion

//#region 项目人员任命
// 获取任命列表
export function fetchAppointList(data) {
  return request({
    url: '/Projects/GetProjectAppointments?projectId=' + data,
    method: 'get',
  })
}
// 初始化任命信息
export function fetchNewAppoint() {
  return request({
    url: '/Projects/NewProjectAppointment',
    method: 'get',
  })
}
// 创建任命信息
export function createPrjAppoint(pa) {
  return request({
    url: '/Projects/CreateProjectAppointment',
    method: 'post',
    params: pa,
  })
}
// 编辑任命信息
export function editPrjAppoint(pa) {
  return request({
    url: '/Projects/EditProjectAppointment',
    method: 'post',
    params: pa,
  })
}
// 删除任命信息
export function deletePrjAppoint(data) {
  return request({
    url: '/Projects/DeleteProjectAppointment',
    method: 'delete',
    params: { id: data.id }
  })
}
//#endregion

//#region 项目里程碑
// 获取里程碑列表
export function fetchMilestoneList(data) {
  return request({
    url: '/Projects/GetProjectMilestones?projectId=' + data,
    method: 'get',
  })
}
// 创建里程碑
export function createPrjMilestone(pa) {
  return request({
    url: '/Projects/CreateProjectMilestone',
    method: 'post',
    params: pa,
  })
}
// 编辑里程碑
export function editPrjMilestone(pa) {
  return request({
    url: '/Projects/EditProjectMilestone',
    method: 'post',
    params: pa,
  })
}
// 删除里程碑
export function deletePrjMilestone(data) {
  return request({
    url: '/Projects/DeleteProjectMilestone',
    method: 'delete',
    params: { id: data.id }
  })
}
//#endregion

//#region 项目分享
// 获取分享列表
export function fetchShareList(data) {
  return request({
    url: '/Projects/GetProjectShares?projectId=' + data,
    method: 'get',
  })
}
// 初始化分享
export function fetchNewShare(data) {
  return request({
    url: '/Projects/NewProjectShare?projectId=' + data,
    method: 'get',
  })
}
// 创建分享
export function createPrjShare(pa) {
  return request({
    url: '/Projects/CreateProjectShare',
    method: 'post',
    params: pa,
  })
}
// 编辑分享
export function editPrjShare(pa) {
  return request({
    url: '/Projects/EditProjectShare',
    method: 'post',
    params: pa,
  })
}
// 删除分享
export function deletePrjShare(data) {
  return request({
    url: '/Projects/DeleteProjectShare',
    method: 'delete',
    params: { id: data.id }
  })
}
//#endregion

//#region 项目阶段
// 项目阶段列表
export function fetchProjectStage() {
  return request({
    url: '/Projects/GetProjectStages',
    method: 'get',
  })
}
// 新增项目阶段
export function createProjectStage(pa) {
  return request({
    url: '/Projects/CreateProjectStage',
    method: 'post',
    params: pa,
  })
}
// 编辑项目阶段
export function editProjectStage(pa) {
  return request({
    url: '/Projects/EditProjectStage',
    method: 'post',
    params: pa,
  })
}
// 删除项目阶段
export function delProjectStage(data) {
  return request({
    url: '/Projects/DeleteProjectStage',
    method: 'delete',
    params: { id: data.id }
  })
}
//#endregion

//#region 项目类型
// 项目类型列表
export function fetchProjectType() {
  return request({
    url: '/Projects/GetProjectTypes',
    method: 'get',
  })
}
// 新增项目类型
export function createProjectType(pa) {
  return request({
    url: '/Projects/CreateProjectType',
    method: 'post',
    params: pa,
  })
}
// 编辑项目类型
export function editProjectType(pa) {
  return request({
    url: '/Projects/EditProjectType',
    method: 'post',
    params: pa,
  })
}
// 删除项目类型
export function delProjectType(data) {
  return request({
    url: '/Projects/DeleteProjectType',
    method: 'delete',
    params: { id: data.id }
  })
}
//#endregion

//#region 项目难易程度
// 项目难易程度列表
export function fetchProjectImportance() {
  return request({
    url: '/Projects/GetProjectImportances',
    method: 'get',
  })
}
// 新增项目难易程度
export function createProjectImportance(pa) {
  return request({
    url: '/Projects/CreateProjectImportance',
    method: 'post',
    params: pa,
  })
}
// 编辑项目难易程度
export function editProjectImportance(pa) {
  return request({
    url: '/Projects/EditProjectImportance',
    method: 'post',
    params: pa,
  })
}
// 删除项目难易程度
export function delProjectImportance(data) {
  return request({
    url: '/Projects/DeleteProjectImportance',
    method: 'delete',
    params: { id: data.id }
  })
}
//#endregion

//#region 项目备注类型
// 项目备注类型列表
export function fetchProjectNoteType() {
  return request({
    url: '/Projects/GetProjectNoteTypes',
    method: 'get',
  })
}
// 新增项目备注类型
export function createProjectNoteType(pa) {
  return request({
    url: '/Projects/CreateProjectNoteType',
    method: 'post',
    params: pa,
  })
}
// 编辑项目备注类型
export function editProjectNoteType(pa) {
  return request({
    url: '/Projects/EditProjectNoteType',
    method: 'post',
    params: pa,
  })
}
// 删除项目备注类型
export function delProjectNoteType(data) {
  return request({
    url: '/Projects/DeleteProjectNoteType',
    method: 'delete',
    params: { id: data.id }
  })
}
//#endregion

//#region 项目附件类型
// 项目附件类型列表
export function fetchProjectArchiveType() {
  return request({
    url: '/Projects/GetProjectArchiveTypes',
    method: 'get',
  })
}
// 新增项目附件类型
export function createProjectArchiveType(pa) {
  return request({
    url: '/Projects/CreateProjectArchiveType',
    method: 'post',
    params: pa,
  })
}
// 编辑项目附件类型
export function editProjectArchiveType(pa) {
  return request({
    url: '/Projects/EditProjectArchiveType',
    method: 'post',
    params: pa,
  })
}
// 删除项目附件类型
export function delProjectArchiveType(data) {
  return request({
    url: '/Projects/DeleteProjectArchiveType',
    method: 'delete',
    params: { id: data.id }
  })
}
//#endregion

//#region 项目节点备注
// 初始化节点备注
export function newProjectNote() {
  return request({
    url: '/Projects/NewProjectNote',
    method: 'get',
  })
}
// 获取备注详情
export function fetchProjectNote(noteId) {
  return request({
    url: '/Projects/GetProjectNote?id=' + noteId,
    method: 'get',
  })
}
// 新增项目备注
export function createProjectNote(pa) {
  return request({
    url: '/Projects/CreateProjectNote',
    method: 'post',
    params: pa,
  })
}
// 编辑项目备注
export function editProjectNote(pa) {
  return request({
    url: '/Projects/EditProjectNote',
    method: 'post',
    params: pa,
  })
}
// 删除项目备注
export function delProjectNote(data) {
  return request({
    url: '/Projects/DeleteProjectNote',
    method: 'delete',
    params: { id: data.id }
  })
}
//#endregion

//#region 项目节点附件
// 初始化节点附件
export function newProjectArchive() {
  return request({
    url: '/Projects/NewProjectArchive',
    method: 'get',
  })
}
// 获取节点附件详情
export function fetchProjectArchive(archiveId) {
  return request({
    url: '/Projects/GetProjectArchive?id=' + archiveId,
    method: 'get',
  })
}
// 新增节点附件
export function createProjectArchive(pa, data) {
  return request({
    url: '/Projects/CreateProjectArchive',
    method: 'post',
    params: pa,
    data: data,
  })
}
// 编辑节点附件
export function editProjectArchive(pa, data) {
  return request({
    url: '/Projects/EditProjectArchive',
    method: 'post',
    params: pa,
    data: data,
  })
}
// 删除节点附件
export function delProjectArchive(data) {
  return request({
    url: '/Projects/DeleteProjectArchive',
    method: 'delete',
    params: { id: data.id }
  })
}
//#endregion

//#region 开票信息
// 获取开票信息列表 - 通过项目ID
export function fetchInvoices(id) {
  return request({
    url: '/InvoicingProgresses/GetInvoicingProgresses?projectId=' + id,
    method: 'get',
  })
}
// 新增开票信息
export function createInvoicingProgress(pa) {
  return request({
    url: '/InvoicingProgresses/CreateInvoicingProgress',
    method: 'post',
    params: pa,
  })
}
// 编辑开票信息
export function editInvoicingProgress(pa) {
  return request({
    url: '/InvoicingProgresses/EditInvoicingProgress',
    method: 'post',
    params: pa,
  })
}
// 删除开票信息
export function delInvoicingProgress(data) {
  return request({
    url: '/InvoicingProgresses/DeleteInvoicingProgress',

    method: 'delete',
    params: { id: data.id }
  })
}
//#endregion

//#region 回款信息
// 获取回款信息列表 - 通过项目ID
export function fetchCollections(id) {
  return request({
    url: '/CollectionProgresses/GetCollectionProgresses?projectId=' + id,
    method: 'get',
  })
}
// 新增回款信息
export function createCollectionProgress(pa) {
  return request({
    url: '/CollectionProgresses/CreateCollectionProgress',
    method: 'post',
    params: pa,
  })
}
// 编辑回款信息
export function editCollectionProgress(pa) {
  return request({
    url: '/CollectionProgresses/EditCollectionProgress',
    method: 'post',
    params: pa,
  })
}
// 删除回款信息
export function delCollectionProgress(data) {
  return request({
    url: '/CollectionProgresses/DeleteCollectionProgress',
    method: 'delete',
    params: { id: data.id }
  })
}
//#endregion

// 下载项目列表
export function downProjects(pa) {
  return request({
    url: '/Projects/GetProjects2',
    method: 'get',
    params: pa,
  })
}

