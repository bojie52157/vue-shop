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
      :active="1 * active"
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
    <el-form
      label-position="top"
      label-width="80px"
      :model="form"
      style="height: 400px; overflow: auto"
    >
      <el-tabs
        @tab-click="tabChange()"
        v-model="active"
        tab-position="left"
        class="tab"
      >
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
              expandTrigger="hover"
              :props="defaultProp"
              @change="handleChange"
            ></el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="2" label="商品参数">
          <el-form-item
            :label="item1.attr_name"
            v-for="(item1, index) in arrDyparams"
            :key="index"
          >
            <el-checkbox-group v-model="item1.attr_vals">
              <el-checkbox
                border
                :label="item2"
                v-for="(item2, index) in item1.attr_vals"
                :key="index"
              ></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="3" label="商品属性">
          <!-- 静态数据 -->
          <el-form-item
            :label="item.attr_name"
            v-for="(item, i) in arrStaticparams"
            :key="i"
          >
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="4" label="商品图片">
          <el-form-item label="名称">
            <el-upload
              action="http://localhost:8888/api/private/v1/upload"
              :headers="headers"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="5" label="商品内容">
          <el-form-item>
            <el-button type="primary" @click="addGoods()">添加商品</el-button>
            <quill-editor>
            </quill-editor>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
 
import { quillEditor } from 'vue-quill-editor'
export default {
  components: {
    quillEditor
  },
  data() {
    return {
      active: "1",
      form: {
        goods_name: "",
        goods_price: "",
        goods_weight: "",
        goods_number: "",
        goods_cat: "",
        goods_introduce: "",
        pics: [],
        attrs: "",
      },
      // 级联选择器绑定的数据
      options: [],
      selectedOptions: [1, 3, 6],
      defaultProp: {
        label: "cat_name",
        value: "cat_id",
        children: "children",
      },
      //动态参数的数据数组
      arrDyparams: [],
      //静态参数的数据数组
      arrStaticparams: [],
      headers:{
        Authorization: localStorage.getItem('token')
      },
    };
  },
  created() {
    this.getGoodsCate();
  },
  methods: {
    /**添加商品-发送请求 */
    async addGoods() {
      this.form.goods_cat = this.selectedOptions.join(',')

      //再发请求之前，处理this.form中的未处理数据
      const res = await this.$http.post(`goods`,this.form)
    },
    /**图片上传时的相关方法 
    file是当前操作的相关信息*/
    handlePreview(file) {

    },
    handleRemove(file) {
      /**从this.form.pics移除当前x掉的图片
       * 先获取该图片的索引
       * findIndex((item)=>{})遍历，把符合条件的元素的索引进行返回
       * {{pic:图片路径},{pic:图片路径2}}
       */
      let Index = this.form.pics.findIndex((item) => {
        return item.pic === file.response.data.tmp_path
      })
      this.form.pics.splice(Index,1)
    },
    handleSuccess(file) {
      this.form.pics.push({
        pic:file.data.tmp_path
      })
    },
    /**点击不同tab时触发方法 */
    async tabChange() {
      //如果点击的时第二个tab，同时，三级分类要有值
      if (this.active === "2") {
        if (this.selectedOptions.length !== 3) {
          this.$message.warning("请先选择商品的三级分类");
          return;
        }
        //获取数据， id->分类id
        const res = await this.$http.get(
          `categories/${this.selectedOptions[2]}/attributes?sel=many`
        );
        this.arrDyparams = res.data.data;
        //对象.attr_vals字符串转为数组
        this.arrDyparams.forEach((item) => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.trim().split(",");
        });
      } else if (this.active === "3") {
        if (this.selectedOptions.length !== 3) {
          this.$message.warning("请先选择商品的三级分类");
          return;
        }
        //获取静态参数数据
        const res = await this.$http.get(
          `categories/${this.selectedOptions[2]}/attributes?sel=only`
        );
        this.arrStaticparams = res.data.data;
      }
    },
    /**级联选择器 @change触发的方法 */
    handleChange() {},
    /**获取三级分类的信息 */
    async getGoodsCate() {
      const res = await this.$http.get(`categories?type=3`);
      this.options = res.data.data;
    },
  },
};
</script>

<style>
.alert {
  margin-top: 20px;
}
.el-card{
  height: 850px;
}
.tab {
  margin-top: 20px;
  height: 500px;
}
.ql-editor{
  min-height: 300px;
}
</style>