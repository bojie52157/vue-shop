<template>
  <el-card>
    <!-- 面包屑 -->
    <my-bread level1="商品管理" level2="商品列表"></my-bread>
    <!-- 搜索 -->
    <el-row class="searchRow">
      <el-col :span="6">
        <el-input
          placeholder="请输入内容"
          v-model="query"
          clearable
          @clear="loadGoodsList()"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="searchGoods()"
          ></el-button>
        </el-input>
      </el-col>
      <el-col :span="18">
        <el-button type="success" class="addBtn" @click="$router.push({name: 'goodsAdd'})"
          >添加商品</el-button
        >
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table :data="goodsList" style="width: 100%" height="720px">
      <el-table-column type="index" label="#" width="50"> </el-table-column>
      <el-table-column prop="goods_name" label="商品名称" width="500">
      </el-table-column>
      <el-table-column prop="goods_price" label="商品价格（元）">
      </el-table-column>
      <el-table-column prop="goods_weight" label="商品重量"> </el-table-column>
      <el-table-column label="创建日期">
        <template slot-scope="goodsList">
          {{ goodsList.row.upd_time | fmtdate }}
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
            @click="showEditGoodsDia(scope.row)"
          ></el-button>
          <el-button
            size="mini"
            plain
            type="danger"
            icon="el-icon-delete"
            circle
            @click="showDeleGoodsMsgBox(scope.row.id)"
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
export default {
  data() {
    return {
      query: "",
      pagenum: 1,
      pagesize: 12,
      total: 0,
      goodsList: [
        {
          goods_id: "",
          goods_name: "",
          goods_price: "",
          goods_weight: "",
          upd_time: "",
        },
      ],
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    /**获取商品列表 */
    async getGoodsList() {
      const res = await this.$http.get(
        `goods?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
      );
      const {
        data,
        meta: { msg, status },
      } = res.data;
      if (status === 200) {
        this.goodsList = data.goods;
        this.total = data.total;
        this.pagenum = parseInt(data.pagenum);
        this.$message.success(msg);
      } else {
        this.$message.warning(msg);
      }
    },
    /**分页方法 */
    //每页显示条数变化时，触发
    handleSizeChange(val) {
      this.pagesize = val;
      this.pagenum = 1;
      this.getGoodsList();
    },
    //当前页改变时 触发
    handleCurrentChange(val) {
      this.pagenum = val;
      this.getGoodsList();
    },
    /**清除搜索 */
    loadGoodsList() {
      this.getGoodsList()
    },
    /**搜索商品 */
    searchGoods() {
      this.getGoodsList()
    },
    /**添加商品 */
    async showAddGoodsDia() {
      const res = await this.$http.post(`goods/`)
    }
  },
};
</script>

<style>
.searchRow {
  margin-top: 20px;
}
</style>