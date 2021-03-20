<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索 -->
    <el-row class="searchRow">
      <el-col :span="6">
        <el-input
          placeholder="请输入内容"
          v-model="query"
          class="inpuSearch"
          clearable
          @clear="loadUserList()"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="searchUser()"
          ></el-button>
        </el-input>
      </el-col>
      <el-col :span="18">
        <el-button type="success" class="addBtn" @click="showAddUserDia()"
          >添加用户</el-button
        >
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table :data="userList" style="width: 100%">
      <el-table-column type="index" label="#" width="60"> </el-table-column>
      <el-table-column prop="username" label="姓名" width="100">
      </el-table-column>
      <el-table-column prop="email" label="邮箱"> </el-table-column>
      <el-table-column prop="mobile" label="电话"> </el-table-column>
      <el-table-column label="创建时间">
        <!-- 如果单元格内显示的内容不是字符串，需要给被显示的内容外层包裹一个template
            template内部要用数据设置slot-scope属性，该属性的值要用数据create_time的数据源userlist
            slot_scope的值userlist其实是el-table绑定的数据userlist
            slot_scope作用：传值，会自动去上一级找最外层标签el-table所绑定的数据userlist
            userlist.row->数据中的每个对象
         -->
        <template slot-scope="userList">
          {{ userList.row.create_time | fmtdate }}
        </template>
      </el-table-column>
      <el-table-column prop="mg_state" label="用户状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            @change="changeMgState(scope.row)"
            active-color="#13ce66"
            inactive-color="#ff4949"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            plain
            type="primary"
            icon="el-icon-edit"
            circle
            @click="showEditUserDia(scope.row)"
          ></el-button>
          <el-button
            size="mini"
            plain
            type="danger"
            icon="el-icon-delete"
            circle
            @click="showDeleUserMsgBox(scope.row.id)"
          ></el-button>
          <el-button
            size="mini"
            plain
            type="success"
            icon="el-icon-check"
            circle
            @click="showSetUserRoleDia(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[12, 14]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <!-- 对话框 -->
    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="form">
        <el-form-item label="用户名" label-width="100px">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="100px">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="100px">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="100px">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="form">
        <el-form-item label="用户名" label-width="100px">
          <el-input
            v-model="form.username"
            autocomplete="off"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="100px">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="100px">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配用户权限对话框 -->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRol">
      <el-form :model="form">
        <el-form-item label="用户名" label-width="100px">
          {{ currUsername }}
        </el-form-item>
        <el-form-item label="角色" label-width="100px">
          <el-select v-model="currRoleId">
            <el-option label="请选择" :value="-1"></el-option>
            <el-option
              :label="item.roleName"
              :value="item.id"
              v-for="(item, i) in roles"
              :key="i"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRol = false">取 消</el-button>
        <el-button type="primary" @click="setRole()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      query: "",
      pagenum: 1,
      pagesize: 2,
      total: 0,
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false,
      dialogFormVisibleRol: false,
      currUsername: "",
      roles: [],
      currRoleId: -1,
      currUserId: -1,
      form: {
        username: "",
        password: "",
        email: "",
        mobile: "",
        id: "",
      },
      userList: [
        {
          create_time: "",
          email: "",
          mg_state: "",
          mobile: "",
          username: "",
        },
      ],
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    /**分配角色-发送请求 */
    async setRole() {
      /**id：要修改的用户id值； 请求体中rid新的id值 */
      const res = this.$http.put(`users/${this.currUserId}`, {
        rid: this.currRoleId,
      });
      this.dialogFormVisibleRol = false;
    },
    /**分配角色-打开对话框 */
    async showSetUserRoleDia(user) {
      this.currUsername = user.username;
      this.currUserId = user.id;
      const res1 = await this.$http.get(`roles`);
      this.roles = res1.data.data;
      //获取当前角色用户id->rid
      const res = await this.$http.put(`users/${user.id}`);
      this.currRoleId = res.data.data.rid;
      this.dialogFormVisibleRol = true;
    },
    /**修改用户状态 */
    async changeMgState(user) {
      const res = await this.$http.put(
        `users/${user.id}/state/${user.mg_state}`
      );
    },
    /**编辑用户-发送请求 */
    async editUser() {
      const res = await this.$http.put(`users/${this.form.id}`, this.form);
      console.log(res);
      this.dialogFormVisibleEdit = false;
      this.pagenum = 1;
      this.getUserList();
    },
    /**编辑用户-弹出对话框 */
    showEditUserDia(user) {
      this.form = user;
      this.dialogFormVisibleEdit = true;
    },
    /**删除操作 */
    showDeleUserMsgBox(userId) {
      this.$confirm("删除用户？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const res = await this.$http.delete(`users/${userId}`);
          if (res.data.meta.status === 200) {
            this.pagenum = 1;
            this.getUserList();
            this.$message({
              type: "success",
              message: res.data.meta.msg,
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    /**添加用户-发送请求 */
    async addUser() {
      const res = await this.$http.post(`users`, this.form);
      const {
        meta: { msg, status },
        data,
      } = res.data;
      if (status === 201) {
        this.$message.success(msg);
        this.dialogFormVisibleAdd = false;
        this.getUserList();
        this.form = {};
      } else {
        this.$message.warning(msg);
      }
    },
    /**添加用户，弹出对话框 */
    showAddUserDia() {
      this.form = {};
      this.dialogFormVisibleAdd = true;
    },
    /**搜索用户 */
    searchUser() {
      this.getUserList();
    },
    loadUserList() {
      this.getUserList();
    },
    /**请求数据 */
    async getUserList() {
      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
      );
      if (res.data.meta.status !== 200) {
        return this.$message.error("获取用户列表失败");
      }
      this.userList = res.data.data.users;
      this.total = res.data.data.total;
      this.$message.success(res.data.meta.msg);
    },
    /**分页方法 */
    //每页显示条数变化时，触发
    handleSizeChange(val) {
      this.pagesize = val;
      this.pagenum = 1;
      this.getUserList();
    },
    //当前页改变时 触发
    handleCurrentChange(val) {
      this.pagenum = val;
      this.getUserList();
    },
  },
};
</script>

<style>
.box-card {
  height: 100%;
}
.inputSearch {
  width: 300px;
}
.searchRow {
  margin-top: 20px;
}
.addBtn {
  margin-left: 5px;
}
</style>