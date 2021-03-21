<template>
  <el-card>
    <!-- 面包屑 -->
    <my-bread level1="商品管理" level2="商品列表"></my-bread>
    <!-- 提示 -->
    <el-alert
      class="alert"
      title="添加商品信息"
      type="success"
      center
      show-icon
    >
    </el-alert>
    <!-- 步骤条 -->
    <el-steps
      :active="1*active"
      finish-status="success"
      simple
      style="margin-top: 20px"
    >
      <el-step title="商品信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <!-- 标签页，最外层是表单 -->
    <el-form label-position="top" label-width="80px" :model="form" style="height:400px;overflow:auto;">
      <el-tabs @tab-click="tabChange()" v-model="active" tab-position="left" class="tab">
        <el-tab-pane name="1" label="基本信息">
          <el-form-item label="商品名称">
            <el-input v-model="form.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="form.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader
              clearable
              v-model="selectedOptions"
              :options="options"
              expandTrigger='hover'
              :props="defaultProp"
              @change="handleChange"></el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="2" label="商品参数">商品参数</el-tab-pane>
        <el-tab-pane name="3" label="商品属性">商品属性</el-tab-pane>
        <el-tab-pane name="4" label="商品图片">商品图片</el-tab-pane>
        <el-tab-pane name="5" label="商品内容">商品内容</el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      active: "1",
      form:{
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: '',
        goods_introduce: '',
        pics: '',
        attrs: ''
      },
      // 级联选择器绑定的数据
      options: [],
      selectedOptions: [1, 3, 6],
      defaultProp: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
      },
      //动态参数的数据数组
      arrDyparams : []
    }
  },
  created() {
    this.getGoodsCate()
  },
  methods:{
    /**级联选择器 @change触发的方法 */
    handleChange() {

    },
    /**获取三级分类的信息 */
    async getGoodsCate() {
      const res = await this.$http.get(`categories?type=3`)
      this.options = res.data.data
    },
    /**点击不同tab时触发方法 */
    async tabChange() {
      //如果点击的时第二个tab，同时，三级分类要有值
      if(this.active === '2') {
        if(this.selectedOptions.length !== 3) {
          this.$message.warning('请先选择商品的三级分类')
          return
        }
        //获取数据， id->分类id
        const res = await this.$http.get(`caregories/${this.selectedOptions[2]}/attributes?sel=many}`)
        this.arrDyparams = res.data.data
      }
    }
  }
};
</script>

<style>
.alert {
  margin-top: 20px;
}
.tab{
  margin-top: 20px
}
</style>