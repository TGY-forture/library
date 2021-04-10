import { createApp } from 'vue'
import App from './src/view/main.vue'
import './src/assets/css/index.less'

import { Form, Input, InputNumber, Button, Radio, Modal, Drawer, Select } from 'ant-design-vue';

const app = createApp(App);
app.use(Form).use(Input).use(Button).use(Radio).use(Modal).use(Drawer);
app.use(InputNumber).use(Select)
app.mount('#app');