<template>
  <div class="u-sign" ref="usign">
    <a-form
      id="t-sign"
      ref="signform"
      v-bind="col"
      :model="formFields"
      :rules="rules"
    >
      <a-form-item label="用户名" name="studycode" hasFeedback>
        <a-input placeholder="学号" v-model:value="formFields.studycode">
          <template v-slot:prefix>
            <i class="custom-icon custom-icon-user"></i>
          </template>
        </a-input>
      </a-form-item>
      <a-form-item label="密码" name="pass" hasFeedback>
        <a-input-password
          placeholder="至少八位字符"
          v-model:value="formFields.pass"
          autocomplete="off"
        >
          <template v-slot:prefix>
            <i class="custom-icon custom-icon-lock"></i>
          </template>
        </a-input-password>
      </a-form-item>
      <a-form-item label="确认密码" name="repass" hasFeedback>
        <a-input-password v-model:value="formFields.repass" autocomplete="off">
          <template v-slot:prefix>
            <i class="custom-icon custom-icon-lock"></i>
          </template>
        </a-input-password>
      </a-form-item>
      <a-form-item label="验证方式" name="method">
        <a-radio-group v-model:value="formFields.method">
          <a-radio value="email">邮箱验证</a-radio>
          <a-radio value="message">短信验证</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item :wrapperCol="{ span: 18, offset: 6 }" name="mcode">
        <a-input
          :placeholder="placeholder"
          v-model:value="formFields.mcode"
        ></a-input>
      </a-form-item>
    </a-form>
    <a-button class="u-btn" shape="round" type="primary" @click="handle">
      提交
    </a-button>
    <p class="foot-back">
      <i class="custom-icon custom-icon-Larrow"></i>
      <span @click="$emit('showComponent')">返回登录</span>
    </p>
    <Info
      :height="600"
      :drawershow="drawershow"
      :github="0"
      @closedrawer="drawershow = false"
    />
    <a-modal
      v-model:visible="show"
      title="请输入验证码"
      :closable="false"
      :getContainer="() => $refs.usign"
      :destroyOnClose="true"
      :maskClosable="false"
      :confirmLoading="infoload"
      width="280px"
      okText="确定"
      cancelText="取消"
      @ok="initProfile"
    >
      <a-input v-model:value="sendcode"></a-input>
    </a-modal>
  </div>
</template>

<script>
import { defineComponent, reactive, computed, ref } from "vue";
import { message, Modal } from "ant-design-vue";
import md5 from 'blueimp-md5';
import Info from '../util/drawer.vue'

export default defineComponent({
  name: "Sign",
  components: { Info },
  setup() {
    const col = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 18,
      },
    };
    const formFields = reactive({
      studycode: "172210303316",
      pass: "12345678",
      repass: "12345678",
      method: "message",
      mcode: "17383032731",
    });
    const placeholder = computed(() => {
      let p = '请输入';
      return formFields.method === 'message' ? p + '电话号码' : p + '邮箱'
    })
    const validRepass = async (rule, value) => {
      if (value !== formFields.pass) {
        return Promise.reject("密码不相等");
      } else {
        return Promise.resolve();
      }
    };
    let typeEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/g;
    let typePhone = /^1[3-9]\d{9}$/g;

    const rules = computed(() => {
      return {
        studycode: [
          { required: true, message: "请输入学号", trigger: "blur" },
          {
            pattern: /^\d{12}$/,
            message: "学号不符合要求",
            trigger: ["blur", "change"],
          },
        ],
        pass: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { pattern: /^.{8,}$/, message: "密码格式不正确", trigger: "blur" },
        ],
        repass: [
          { required: true, message: "请确认密码", trigger: "blur" },
          { validator: validRepass, trigger: "blur" },
        ],
        mcode: [
          { required: true, message: "请输入信息", trigger: "blur" },
          {
            pattern: formFields.method === 'message' ? typePhone : typeEmail,
            message: formFields.method === 'message' ? '号码格式错误' : '邮箱格式错误',
            trigger: "blur"
          }
        ]
      }
    });
    let drawershow = ref(false);
    return {
      drawershow,
      col,
      formFields,
      rules,
      placeholder
    };
  },
  data() {
    return {
      loadingkey: "load",
      show: false,
      infoload: false,
      sendcode: "",
    };
  },
  methods: {
    handle() { //提交处理函数
      this.$refs.signform.validateFields().then(async (values) => {//验证码已发送
        message.loading({
          content: "正在检查...",
          key: this.loadingkey,
          duration: 0,
        });
        let { data: isSign } = await this.$axios.post('/sign', values);
        if (isSign === 0) { //如果是刚注册,发验证码
          let { data: isValid } = await this.$axios.get(
            `/verify?type=${values.method}&user=${values.mcode}&id=${values.studycode}`
          );
          if (isValid === 1) {
            message.success({
              content: "验证码发送成功",
              key: this.loadingkey,
              duration: 2,
            });
            this.show = true;
          } else if (isValid === -1) {
            message.error({
              content: "验证码发送失败",
              key: this.loadingkey,
              duration: 2,
            });
          } else {
            message.warning({
              content: "验证码已存在",
              key: this.loadingkey,
              duration: 2,
            });
            this.show = true;
          }
        } else if (isSign === 1) {
          message.success({
            content: "OK",
            key: this.loadingkey,
            duration: 1,
          });
          this.drawershow = true;
        } else if (isSign === 2) {
          message.warning({
            content: "该账号已注册",
            key: this.loadingkey,
            duration: 2,
          });
        } else {
          message.destroy();
          Modal.info({
            title: '提示',
            content: '该账号已通过Github注册，请点击Github图标进行登录！',
            okText: '知道了'
          })
        }
      }).catch((e) => {
        console.error(e)
      });
    },
    initProfile() { //第一次初始化用户信息(用户名,密码,注册状态,联系方式)
      this.infoload = true;
      // 如果验证码未过期,则cookie中存在用户字段，会随请求发送
      this.$axios.post('/check', {
        studycode: this.formFields.studycode,
        pass: md5(this.formFields.pass),
        type: this.formFields.method,
        mess: this.formFields.mcode,
        code: this.sendcode
      }).then(({ data }) => {
        if (data === 1) {
          this.drawershow = true;
          this.show = false;
        } else {
          message.error({
            content: '验证失败',
            duration: 1
          })
        }
      }).catch(e => {
        console.error(e)
      }).finally(() => {
        this.infoload = false;
      })
    },
  },
});
</script>

<style lang="less">
.u-sign {
  #t-sign {
    .ant-form-item-with-help {
      margin-bottom: 24px;
    }
    .ant-row {
      align-items: center;
    }
    .ant-form-item {
      &:nth-child(4) {
        margin-bottom: 5px;
      }
      .ant-form-item-children .ant-form-item-children-icon {
        top: 72%;
      }
      .ant-form-explain {
        position: absolute;
        margin-top: 2px;
        margin-left: 3px;
      }
      .ant-form-item-label {
        padding: 0;
      }
      .ant-input-affix-wrapper {
        height: 40px;
        border-radius: 20px;
        .ant-input {
          letter-spacing: 5px;
        }
      }
    }
  }
  /**挂载在 $refs.usign下面 */
  .ant-modal-body {
    text-align: center;
    .ant-input {
      border-radius: 16px;
      width: 150px;
      letter-spacing: 9px;
      text-align: center;
    }
  }
  .foot-back {
    margin-top: 30px;
    display: flex;
    align-items: center;
    color: #3398eb;
  }
  .u-btn {
    position: relative;
    margin-top: 20px;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>