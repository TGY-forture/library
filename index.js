import { createApp } from 'vue'
import App from './src/view/index.vue'
import Router from './src/router/index.js'
import Store from './src/store/index.js'
import axios from './src/assets/js/axios.js'
import './src/assets/css/index.less'

import { Input, InputNumber, Radio, Switch, Form, Select } from 'ant-design-vue'
import { DatePicker, TimePicker, Tooltip, Row, Col } from 'ant-design-vue';
import { Button, Tabs, Upload, Drawer, Pagination, Popconfirm } from 'ant-design-vue';
import { Modal, Empty, Popover, Tag } from 'ant-design-vue';

const app = createApp(App).use(Router).use(Store);
app.config.globalProperties.$axios = axios;
app.use(Input).use(Radio).use(Switch).use(Form).use(InputNumber).use(Select);
app.use(DatePicker).use(TimePicker).use(Tooltip).use(Row).use(Col).use(Button);
app.use(Tabs).use(Upload).use(Drawer).use(Pagination).use(Popconfirm).use(Modal);
app.use(Empty).use(Popover).use(Tag);
app.mount('#app');