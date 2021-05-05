<template>
  <div id="u-help">
    <a-form
      :model="info"
      :rules="rules"
      v-bind="{ labelCol: { span: 5 }, wrapperCol: { span: 19 } }"
      ref="certform"
    >
      <a-form-item label="学号" name="studycode" hasFeedback>
        <a-input
          placeholder="请输入学号"
          v-model:value="info.studycode"
        ></a-input>
      </a-form-item>
      <a-form-item label="邮箱" name="email" hasFeedback>
        <a-input placeholder="请输入邮箱" v-model:value="info.email"></a-input>
      </a-form-item>
      <a-form-item label="验证码" name="certcode" hasFeedback>
        <a-input
          placeholder="请输入验证码"
          v-model:value="info.certcode"
          :disabled="disabled"
        ></a-input>
      </a-form-item>
      <a-form-item label="新密码" name="newpass" hasFeedback>
        <a-input
          placeholder="请输入新密码"
          v-model:value="info.newpass"
          :disabled="disabled"
        ></a-input>
      </a-form-item>
    </a-form>
    <div class="help-footer">
      <a-button type="dashed" @click="getCertcode">发送验证码</a-button>
      <a-button type="primary" :loading="confirmLoading" @click="confirm">
        提交
      </a-button>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, ref } from "vue";
import { message, notification } from 'ant-design-vue';
import md5 from 'blueimp-md5';

export default defineComponent({
  name: "Help",
  emits: ['shutmodal'],
  setup() {
    const info = reactive({
      studycode: '172210303316',
      email: '1453836790@qq.com',
      certcode: '',
      newpass: ''
    });
    const rules = {
      studycode: [{
        required: true, message: '请输入学号', trigger: 'blur'
      }, {
        pattern: /^\d{12}$/g,
        message: '学号不符合要求',
        trigger: 'blur'
      }],
      email: [{ required: true, message: '请输入邮箱', trigger: 'blur' },
      {
        pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/g,
        message: '邮箱不符合要求',
        trigger: 'blur'
      }],
      certcode: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
      newpass: [{ required: true, message: '请输入新密码', trigger: 'blur' },
      {
        pattern: /^.{8,}$/, message: "密码格式不正确", trigger: "blur"
      }]
    };
    let confirmLoading = ref(false);
    let disabled = ref(true);
    return {
      info,
      rules,
      confirmLoading,
      disabled
    };
  },
  methods: {
    async getCertcode() {
      let { data: isValid } = await this.$axios.get(
        `/verify?type=email&user=${this.info.email}&id=${this.info.studycode}`
      );
      if (isValid === 1) {
        message.success({ content: "验证码发送成功", duration: 1, });
        this.disabled = false;
      } else if (isValid === -1) {
        message.error({ content: "验证码发送失败", duration: 1, });
      } else {
        message.warning({ content: "验证码已存在", duration: 1, });
        let cookie = {};
        document.cookie.replace(/\s/g, '').split(';').forEach((val) => {
          const [key, value] = val.split('=');
          cookie[key] = value;
        });
        if (cookie.cert) {
          this.disabled = false;
        }
      }
    },
    confirm() {
      this.$refs.certform.validateFields().then((values) => {
        this.confirmLoading = true;
        return this.$axios.post('/cert', Object.assign({ ...values }, { newpass: md5(values.newpass) }))
      }).then(({ data: code }) => {
        this.confirmLoading = false;
        if (code === 1) {
          notification.success({
            message: '通知',
            description: '更新密码成功',
            duration: 3
          });
          this.$emit('shutmodal')
        } else {
          notification.error({
            message: '通知',
            description: '更新密码失败',
            duration: 3
          })
        }
      }).catch(() => {
        this.confirmLoading = false;
      })
    },
  }
});
</script>

<style lang="less">
#u-help {
  .ant-form-item {
    cursor: pointer;
    display: flex;
    align-items: center;
    .ant-form-explain {
      left: 8px;
    }
    .ant-form-item-label {
      padding: 0;
    }
    .ant-input {
      border-radius: 16px;
    }
  }
  .help-footer {
    text-align: center;
    .ant-btn:first-child {
      margin-right: 30px;
    }
  }
}
</style>