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
      <a-form-item label="验证方式">
        <a-radio-group v-model:value="formFields.method">
          <a-radio value="email">邮箱验证</a-radio>
          <a-radio value="message">短信验证</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item :wrapperCol="{ span: 18, offset: 6 }" name="mcode">
        <a-input
          placeholder="请输入邮箱"
          v-model:value="formFields.mcode"
        ></a-input>
      </a-form-item>
    </a-form>
    <a-button class="u-btn" shape="round" type="primary" @click="handle"
      >提交</a-button
    >
    <p class="foot-back">
      <i class="custom-icon custom-icon-Larrow"></i>
      <span @click="backLog">返回登录</span>
      <span class="addprofile">已注册,完善信息</span>
    </p>
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
      @ok="editProfile"
    >
      <a-input v-model:value="sendcode"></a-input>
    </a-modal>
    <!-- 用于挂载drawer组件....其实是不想调整样式了,(笑脸.jpg) -->
    <div ref="mountdrawer" class="mount-drawer"></div>
    <a-drawer
      v-model:visible="drawershow"
      title="个人信息"
      :closable="false"
      :getContainer="() => $refs.mountdrawer"
      placement="top"
      :height="500"
      :destroyOnClose="true"
    >
      <a-form ref="inform" :model="profile" v-bind="col">
        <a-form-item label="学号">
          <a-input v-model:value="profile.scode"></a-input>
        </a-form-item>
        <a-form-item label="昵称">
          <a-input v-model:value="profile.nickname"></a-input>
        </a-form-item>
        <a-form-item label="性别">
          <a-radio-group name="radioGroup" v-model:value="profile.gender">
            <a-radio value="man">男</a-radio>
            <a-radio value="woman">女</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="年龄">
          <a-input-number v-model:value="profile.age" :min="15" :max="30" />
        </a-form-item>
        <a-form-item label="学院">
          <a-select v-model:value="profile.faculty">
            <a-select-option value="lucy">tgy</a-select-option>
            <a-select-option value="luc">45</a-select-option>
            <a-select-option value="lu">wes</a-select-option>
            <a-select-option value="1">tgy</a-select-option>
            <a-select-option value="2">45</a-select-option>
            <a-select-option value="3">wes</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="联系方式">
          <a-input v-model:value="profile.concat"></a-input>
        </a-form-item>
      </a-form>
      <div style="text-align: center">
        <a-button type="primary" shape="round">保存</a-button>
      </div>
    </a-drawer>
  </div>
</template>

<script>
import { defineComponent, reactive } from "vue";
import { message } from "ant-design-vue";

export default defineComponent({
  name: "Sign",
  setup() {
    const col = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 18,
      },
    };
    const profile = reactive({
      scode: "172210303316",
      nickname: "hahhhhh",
      gender: "woman",
      age: 12,
      faculty: "lu",
      concat: "18361812729",
    });
    const formFields = reactive({
      studycode: "172210303316",
      pass: "12345678",
      repass: "12345678",
      method: "message",
      mcode: "2",
    });
    const validRepass = async (rule, value) => {
      if (value !== formFields.pass) {
        return Promise.reject("密码不相等");
      } else {
        return Promise.resolve();
      }
    };
    const rules = {
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
      mcode: [{ required: true, message: "请输入信息", trigger: "blur" }],
    };
    return {
      col,
      formFields,
      rules,
      profile,
    };
  },
  data() {
    return {
      way: "email",
      loadingkey: "load",
      show: false,
      infoload: false,
      sendcode: "",
      drawershow: false,
    };
  },
  methods: {
    backLog() {
      this.$emit("showComponent");
    },
    handle() {
      this.$refs.signform
        .validateFields()
        .then((values) => {
          message.loading({
            content: "正在发送验证码...",
            key: this.loadingkey,
            duration: 0,
          });
          setTimeout(() => {
            message.success({
              content: "验证码发送成功",
              key: this.loadingkey,
              duration: 1,
            });
            this.show = true;
          }, 2000);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    editProfile() {
      this.infoload = true;
      setTimeout(() => {
        this.drawershow = true;
        this.show = false;
        this.infoload = false;
      }, 1000);
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
  .mount-drawer {
    .ant-drawer-top.ant-drawer-open .ant-drawer-content-wrapper {
      box-shadow: none;
    }
    .ant-drawer-content {
      border-radius: 0 0 20px 20px;
      .ant-row {
        align-items: center;
        .ant-form-item-label {
          padding: 0;
        }
      }
    }
  }
  .foot-back {
    margin-top: 30px;
    display: flex;
    align-items: center;
    color: #3398eb;
    .addprofile {
      margin-left: auto;
      color: rgb(83, 79, 79);
    }
  }
  .u-btn {
    position: relative;
    margin-top: 20px;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>