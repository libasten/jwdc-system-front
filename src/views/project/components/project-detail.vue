<template>
  <!-- 项目详情 -->
  <div class="app-container">
    <el-form ref="postForm" :loading="loading" :model="postForm" :rules="rules" label-width="80px">
      <el-form-item label="id" v-if="false" prop="id">
        <el-input v-model="postForm.id"></el-input>
      </el-form-item>
      <el-form-item label="项目名称" prop="name">
        <el-input v-model="postForm.name"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="postForm.description"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submit">提交更新</el-button>
      <el-button @click="submit">返回列表</el-button>
    </span>
  </div>
</template>

<script>

import { fetchProjectDetail, editProjectImportance, createProjectImportance, delProjectImportance } from '@/api/project';
export default {
  name: 'ProjectDetail',
  components: {},
  data() {
    return {
      loading: true,
      postForm: {
        id: '', //当前项目的id，也是路由入参
        name: '',
      },
      dialogVisible: false,
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
      }
    };
  },
  props: {
    operateType: {
      type: String,
      default: 'edit',
    }
  },
  created() {
    if (this.operateType == 'edit') {
      this.postForm.id = this.$route.params && this.$route.params.id;
      this.getProjectDetail();
    }
    if (this.operateType == 'create') {
      // this.fetchEnumForCreate();
    }
    if (this.operateType == 'view') {
      // this.prjId = this.$route.params && this.$route.params.id;
      // this.fetchProjectDetail(this.ajid);
    }
  },
  methods: {
    submit() {
      this.$refs.postForm.validate((valid) => {
        if (valid) {
          // 新建
          // if (this.postForm.id === '') {
          //   createProjectImportance(this.postForm).then((res) => {
          //     this.$message.success('新建成功！')
          //     this.list.unshift(res.data);
          //     this.total++
          //     this.dialogVisible = false
          //   }).catch((err) => {
          //     this.$message.error('新建失败：' + err)
          //   })
        }
        // 编辑更新
        else {
          // editProjectImportance(this.postForm).then((res) => {
          //   this.$message.success('更新成功！')
          //   this.dialogVisible = false
          // }).catch((err) => {
          //   this.$message.error('更新失败：' + err)
          // })
          // }
        }
      })
    },
    // 获取数据列表
    getProjectDetail() {
      this.loading = true;
      this.list = [];
      fetchProjectDetail(this.postForm.id).then((res) => {
        console.log(res.data)
        this.postForm = res.data.project
        this.loading = false
      }).catch((err) => {
        this.$message({
          message: '错误信息：' + err,
          type: 'error'
        });
      });
    },
    createImportance() {
      this.postForm = {
        id: '',
        name: '',
        order: '',
        description: ''
      }
      if (this.$refs.postForm !== undefined) {
        this.$refs.postForm.clearValidate()
      }
      this.dialogVisible = true
    },
    editImportance() {
      if (this.$refs.postForm !== undefined) {
        this.$refs.postForm.clearValidate()
      }
      this.postForm = this.currentRow
      this.dialogVisible = true
    },
  },
};
</script>

<style scoped>
</style>
<style lang="scss">
</style>