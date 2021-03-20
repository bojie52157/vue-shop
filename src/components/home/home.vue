<template>
  <el-container class="container">
    <el-header class="header">
      <el-row>
        <el-col :span="2">
          <div class="grid-content bg-purple">
            <h3>这是图标的位置</h3>
          </div>
        </el-col>
        <el-col :span="20" class="middle">
          <h3>电商后台管理系统</h3>
        </el-col>
        <el-col :span="2">
          <div class="grid-content bg-purple">
            <a href="#" class="logout" @click.prevent="handleSignout()">退出</a>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside class="aside" width="200px">
        <el-menu 
        :unique-opened="true"
        :router="true"
        >
          <el-submenu :index="item1.order+''" v-for="(item1,index) in menus" :key="index">
            <template slot="title">
              <i class="el-icon-user-solid"></i>
              <span>{{item1.authName}}</span>
            </template>
            <el-menu-item :index="item2.path+''" v-for="(item2,index) in item1.children" :key="index">
              <i class="el-icon-user-solid"></i>
              <span>{{item2.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="main"><router-view></router-view></el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menus:[],
    }
  },
  /**在home加载之前判断浏览器中是否登录过，有token，渲染页面，没有token跳转登录页 */
  // beforeCreate() {
  //   const token = localStorage.getItem("token");
  //   if (!token) {
  //     this.$router.push({ name: "login" });
  //   }
  // },
  created() {
    this.getMenus()
  },
  methods: {
    /**动态获取导航 */
    async getMenus() {
      const res = await this.$http.get(`menus`)
      this.menus = res.data.data
    },
    /**退出 */
    handleSignout() {
      localStorage.clear();
      this.$message.success("退出成功");
      this.$router.push({ name: "login" });
    },
  },
};
</script>

<style>
.container {
  height: 100%;
}
.container .header {
  background-color: #b3c0d1;
}
.container .header .middle {
  text-align: center;
}
.container .header .logout {
  text-decoration: none;
  line-height: 60px;
}
.container .aside {
  background-color: beige;
}
.container .main {
  background-color:azure
}
</style>