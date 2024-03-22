import { createApp } from 'vue';
import App from '@/App.vue';
import store from '@/stores';
import router from '@/router';
import Antd, { ConfigProvider, message } from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import 'animate.css';
import 'animate.css/animate.compat.css';
import '@/assets/iconfont/iconfont.css';
import '@/styles/index.scss';

const app = createApp(App);
app.config.globalProperties.$isProd = process.env.NODE_ENV == 'production';

app.use(Antd);
app.use(ConfigProvider);
// message.config({ duration: 0 });

app.use(router);
app.use(store);

app.mount('#app');
