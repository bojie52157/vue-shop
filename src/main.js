import Vue from "vue";
import App from "./App";
import router from "./router";
import MyBread from './components/custom/myBread.vue'

/**引入第三方库 */
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "@/assets/css/reset.css";
import MyHttpServer from '@/plugins/https'
import moment from 'moment'

Vue.config.productionTip = false;

/**使用第三方库 */
Vue.use(ElementUI);
Vue.use(MyHttpServer)

/**全局过滤器-处理日期 */
Vue.filter('fmtdate', (v) => {
  return moment(v).format('YYYY-MM-DD')
})

/**全局自定义组件 */
Vue.component(MyBread.name,MyBread)

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  components: { App },
  template: "<App/>"
});
