<template>
  <el-card>
    <my-bread level='数据统计' level2="数据报表"></my-bread>
    <div id="main" style="width:600px; height:400px;"></div>
  </el-card>
</template>

<script>
var myEchart = require('echarts')
export default {
  data() {
    return {

    }
  },
  mounted() {
    this.userEchart()
  },
  methods:{
    async userEchart() {
      var myChart = myEchart.init(document.getElementById('main'))
        const res = await this.$http.get(`reports/type/1`)
        var option2 = res.data.data
      let option1 = {
        title: {
            text: '折线图堆叠'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#6a7985'
              }
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
      };
      let option = {...option1, ...option2}
      myChart.setOption(option)
    }
  }
}
</script>

<style>

</style>