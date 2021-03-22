<template>
  <el-card>
    <my-bread level1="商品管理" level2="分类管理"></my-bread>
    <el-alert
      type="warning"
      class="alert"
      title="只允许为第三级分类设置参数"
    ></el-alert>
    <el-form class="formcs" label-position="left" label-width="80px">
      <el-form-item label="商品分类">
        <el-cascader
          clearable
          :show-all-levels="false"
          v-model="selectedOptions"
          :options="options"
          expandTrigger="hover"
          :props="defaultProp"
          @change="handleChange"
        ></el-cascader>
      </el-form-item>
    </el-form>
    <el-tabs v-model="active" type="card" @tab-click="handleClick">
      <el-tab-pane label="动态参数" name="1">
        <el-button type="danger">设置动态参数</el-button>
        <el-table
          :data="arrDyparams"
          style="width: 100%">
          <el-table-column type="expand" label="#">
            <template slot-scope="scope">
              
            </template>
          </el-table-column>
          <el-table-column
            label="属性名称"
            prop="arrt_name">
          </el-table-column>
          <el-table-column
            label="操作"
            prop="name">
            <template slot-scope="scope">
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
      </el-tab-pane>
      <el-tab-pane label="静态参数" name="2">静态参数</el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      // 级联选择器绑定的数据
      options: [],
      selectedOptions: [1, 3, 6],
      defaultProp: {
        label: "cat_name",
        value: "cat_id",
        children: "children",
      },
      arrDyparams:[],
      active: 1,
    };
  },
  created() {
    this.getGoodsCate()
  },
  methods: {
    handleClick() {

    },

    async handleChange() {
      if (this.selectedOptions.length !== 3) {
          //获取数据， id->分类id
        const res = await this.$http.get(
          `categories/${this.selectedOptions[2]}/attributes?sel=many`
        );
        }
        
        this.arrDyparams = res.data.data;
        //对象.attr_vals字符串转为数组
        this.arrDyparams.forEach((item) => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.trim().split(",");
        });
    },
    /**获取三级分类的信息 */
    async getGoodsCate() {
      const res = await this.$http.get(`categories?type=3`);
      this.options = res.data.data;
    },
  }
};
</script>

<style>
.alert {
  margin-top: 20px;
}
.formcs {
  margin-top: 20px;
}
</style>