<template>
  <el-row class="app-header" :gutter="20">
    <el-col :span="10"><i class="iconfont icon-99"></i>江苏传智播客教育科技股份有限公司</el-col>
    <el-col :span="5" :offset="5">
    <el-dropdown trigger="click">
      <span class="el-dropdown-link">
         <img width="30" :src="$store.state.user.photo">
          {{ $store.state.user.name }}<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>用户设置</el-dropdown-item>
        <!--
          可以使用 .native 事件修饰符将原始的 html 页面注册到组件的根元素
         -->
        <el-dropdown-item @click.native="handleLogout">退出</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </el-col>
  </el-row>
</template>

<script>
// import { removeUser, getUser } from '@/utils/auth'
import { removeUser } from '@/utils/auth'
export default {
  name: 'AppHeader',
  data () {
    return {
      // userInfo: {}
    }
  },
  created () {
    // this.userInfo = JSON.parse(window.localStorage.getItem('user_info')) || {
    //   name: '123456789',
    //   photo: 'http://toutiao.meiduo.site/Fkj6tQi3xJwVXilu2swCElotfdCi'
    // }
    // this.userInfo = getUser()
  },
  methods: {
    handleLogout () {
      this.$confirm('你确定退出╭(╯^╰)╮?', '拜拜提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 清空本 地存储中的 user_info
        // window.localStorage.removeItem('user_info')
        removeUser()
        // 跳转到登录页
        this.$router.push({ name: 'login' })
        this.$message({
          type: 'success',
          message: '重新登录吧! 沙雕'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '不退就别特么点我！！'
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .app-header {
  height: 60px;
  display: flex;
  align-items: center;
}
  .el-dropdown-link {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #409EFF;
  img {
    border-radius: 50%;
  }
}
  .el-icon-arrow-down {
  font-size: 12px;
}
</style>
