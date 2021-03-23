<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <my-bread level1="商品管理" level2="商品分类"></my-bread>
    <!-- 搜索框 -->
    <el-row>
      <el-col :span="24" class="searchArea">
        <el-button type="success" @click="addGoodsCate()">添加分类</el-button>
      </el-col>
    </el-row>
    <!-- 添加对话框 -->
    <el-dialog title="添加分类" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="form">
        <el-form-item label="分类名称" label-width="120px">
          <el-input v-model="form.cat_name" auto-complete="off"></el-input>
        </el-form-item>
        <!-- 联级选择器（表单元素） -->
        <el-form-item label="分类" label-width="120px">
          {{ selectedOptions }}
          <el-cascader
            expand-trigger="hover"
            change-on-select
            clearable
            :options="caslist"
            v-model="selectedOptions"
            :props="defaultProp"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVIsibleAdd = false">取消</el-button>
        <el-button type="primary" @click="addCate()">确定</el-button>
      </div>
    </el-dialog>
    <!-- 表格 -->
    <el-table height="450" :data="list" style="width: 100%">
      <el-tree-grid prop="cat_name" label="分类名称"
        treeKey = 'cat_id'
        parentKey = 'cat_pid'
        levelKey = 'cat_level'
        childKey = 'children'
      >

      </el-tree-grid>
      <el-table-column label="级别">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_level === 0">一级</span>
          <span v-else-if="scope.row.cat_level === 1">二级</span>
          <span v-else-if="scope.row.cat_level === 3">三级</span>
        </template>
      </el-table-column>
      <el-table-column label="是否有效">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_deleted === false">有效</span>
          <span v-else-if="scope.row.cat_deleted === true">无效</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            plain
            type="danger"
            icon="el-icon-delete"
            circle
            @click="showDelefirm(scope.row)"
          ></el-button>
          <el-button
            size="mini"
            plain
            type="success"
            icon="el-icon-edit"
            circle
            @click="showEditdia(scope.row)"
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
  </el-card>
</template>

<script>
var ElTreeGrid = require('element-tree-grid')
export default {
  components: {
    ElTreeGrid
  },
  data() {
    return {
      pagenum: 1,
      pagesize: 10,
      total: 1,
      dialogFormVIsibleAdd: false,
      list: [],
      form: {
        cat_id:  -1,
        cat_name: '',
        cat_level: -1
      },
      // 级联选择器绑定的数据
      caslist: [],
      selectedOptions: [1, 3, 6],
      defaultProp: {
        label: "cat_name",
        value: "cat_id",
        children: "children",
      },
    };
  },
  created() {
    this.getGoodsCate()
  },
  methods: {
    /**添加分类-发送请求 */
    async addCate() {
      if(this.selectedOptions.length === 0) {
        this.form.cat_id = 0
        this.form.cat_level = 0
      }else if(this.selectedOptions.length === 1) {
        this.form.cat_pid = this.selectedOptions[0]
        this.form.cat_level = 1
      }else if(this.selectedOptions.length === 2) {
        this.form.cat_pid = this.selectedOptions[1]
        this.form.cat_level = 2
      }
      const res = await this.$http.post(`categories`,this.form)
      this.getGoodsCate()
      this.dialogFormVIsibleAdd = false
      this.form = {}
    },
    /**添加分类-显示对话框 */
    async addGoodsCate() {
      //获取二级分类数据
      const res = await this.$http.get(`categories?type=2`)
      this.caslist = res.data.data
      this.dialogFormVIsibleAdd = true
    },
    async getGoodsCate() {
      const res = await this.$http.get(`categories?type=3&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
      this.list = res.data.data.result
      this.total = res.data.data.total
    },
    /**分页方法 */
    //每页显示条数变化时，触发
    handleSizeChange(val) {
      this.pagesize = val;
      this.pagenum = 1;
      this.getGoodsCate();
    },
    //当前页改变时 触发
    handleCurrentChange(val) {
      this.pagenum = val;
      this.getGoodsCate();
    },
  }
};
</script>

<style>
</style>