<template>
  <el-card>
    <my-bread level1="商品管理" level2="分类管理"></my-bread>
    <el-alert
      type="warning"
      class="alert"
      title="只允许为第三级分类设置参数"
    ></el-alert>
    <el-form
      class="formcs"
      label-position="left"
      label-width="80px"
    >
      <el-form-item>
        <el-cascader
          clearable
          v-model="selectedOptions"
          :options="options"
          expandTrigger="hover"
          :props="defaultProp"
          @change="handleChange"
        ></el-cascader>
      </el-form-item>
    </el-form>
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
    };
  },
  created() {
    this.getGoodsCate()
  },
  methods: {
    handleChange() {

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
.formcs{
  margin-top: 20px;
}
</style>