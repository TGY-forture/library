import { createApp } from 'vue'
import App from './src/view/index.vue'
import './src/assets/css/index.less'

import { Input, InputNumber, Radio, Switch, Form, Select } from 'ant-design-vue'
import { DatePicker, TimePicker, Tooltip, Row, Col } from 'ant-design-vue';
import { Button, Tabs } from 'ant-design-vue';

const app = createApp(App);
app.use(Input).use(Radio).use(Switch).use(Form).use(InputNumber).use(Select);
app.use(DatePicker).use(TimePicker).use(Tooltip).use(Row).use(Col).use(Button);
app.use(Tabs)
app.mount('#app')