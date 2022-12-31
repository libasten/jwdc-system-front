<template>
  <!-- 新建工作流 -->
  <div class="app-container workflow-page">
    <div class="flow-btns">
      <el-button icon="el-icon-edit-outline" size="small" :type="$route.name==='Todo'? 'primary' : 'info'" @click.native="goTodo">我的待办</el-button>
      <el-button icon="el-icon-news" size="small" :type="$route.name==='Create'? 'primary' : 'info'" @click.native="goCreate">新建流程</el-button>
      <el-button icon="el-icon-football" size="small" :type="$route.name==='Doing'? 'primary' : 'info'" @click.native="goDoing">经办流程</el-button>
      <el-button icon="el-icon-finished" size="small" :type="$route.name==='Done'? 'primary' : 'info'" @click.native="goDone">完结流程</el-button>
    </div>
    <el-card shadow="never" style="padding:10px 20px;margin-top:40px;">
      <el-button icon="el-icon-money" type="primary" size="large" plain @click.native="createExpense" style="width:100%">新建报销流程</el-button>
    </el-card>
  </div>
</template>

<script>
import { goTodo, goCreate, goDoing, goDone, headerCellStyle } from "@/utils/commonFunction";

export default {
  name: 'WorkFlowCreate',
  data() {
    return {

    };
  },
  created() {

  },
  methods: {
    goTodo,
    goCreate,
    goDoing,
    goDone,
    headerCellStyle,
    createExpense() {
      this.$router.push({ path: '/workflow/expense/create' })
    },
  },
};
</script>

<style scoped>
</style>
<style lang="scss">
.workflow-page {
  .flow-btns {
    margin-bottom: 20px;
    i {
      margin-right: 4px;
    }
  }
  .el-card {
    i {
      margin-right: 5px;
    }
  }
}
</style>