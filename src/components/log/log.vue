<template>
  <div class="u-form">
    <a-form ref="logform" :model="formfields" :rules="rules">
      <a-form-item ref="user" :autoLink="false" name="user" hasFeedback>
        <p>
          <i class="custom-icon custom-icon-user"></i>
          <span>&nbsp;用户名</span>
        </p>
        <a-input
          allowClear
          placeholder="用户名为学号"
          v-model:value="formfields.user"
          @blur="
            () => {
              $refs.user.onFieldBlur();
            }
          "
          @change="
            () => {
              $refs.user.onFieldChange();
            }
          "
        ></a-input>
      </a-form-item>
      <a-form-item name="pass" ref="pass" :autoLink="false" hasFeedback>
        <p>
          <i class="custom-icon custom-icon-lock"></i><span>&nbsp;密码</span>
        </p>
        <a-input-password
          autocomplete="off"
          placeholder="密码"
          v-model:value="formfields.pass"
          @blur="
            () => {
              $refs.pass.onFieldBlur();
            }
          "
          @change="
            () => {
              $refs.pass.onFieldChange();
            }
          "
        ></a-input-password>
      </a-form-item>
      <a-form-item name="vertifycode" ref="vertifycode" :autoLink="false">
        <p>
          <i class="custom-icon custom-icon-dentifyingcode"></i>
          <span>&nbsp;验证码</span>
        </p>
        <!-- 不加allowClear,类名位置不一样，注意 -->
        <a-input
          allowClear
          v-model:value="formfields.vertifycode"
          @blur="
            () => {
              $refs.vertifycode.onFieldBlur();
            }
          "
          @change="
            () => {
              $refs.vertifycode.onFieldChange();
            }
          "
        ></a-input>
        <canvas
          width="90"
          height="30"
          ref="vertify"
          @click="genNewCode"
        ></canvas>
      </a-form-item>
      <a-form-item class="u-btn">
        <a-button type="primary" :loading="loading" @click="log">登录</a-button>
      </a-form-item>
    </a-form>
    <footer class="footer">
      <p>
        <span>问题帮助</span><i class="custom-icon custom-icon-question"></i>
      </p>
      <p>
        <span @click="toSign">前往注册</span
        ><i class="custom-icon custom-icon-Right"></i>
      </p>
    </footer>
  </div>
</template>

<script>
import { defineComponent, reactive, ref } from "vue";
import { draw } from "@/assets/js/vertifycode.js";
import { Notify } from "vant";
import { message } from "ant-design-vue";

export default defineComponent({
  name: "Log",
  setup() {
    const formfields = reactive({
      user: "172210303316",
      pass: "tgy12345.",
      vertifycode: "",
    });
    const loading = ref(false);
    const rules = {
      user: [
        {
          required: true,
          message: "请输入用户名",
          trigger: "blur",
        },
        {
          pattern: /^\d{12}$/,
          message: "用户名不符合要求",
          trigger: "blur",
        },
      ],
      pass: [
        {
          required: true,
          message: "请输入密码",
          trigger: "blur",
        },
        {
          pattern: /^.{8,}$/,
          message: "密码不符合要求",
          trigger: "blur",
        },
      ],
      vertifycode: [
        {
          required: true,
          trigger: "blur",
          message: "请输入验证码",
        },
      ],
    };
    return {
      formfields,
      rules,
      loading,
    };
  },
  data() {
    return {
      handvertify: [],
    };
  },
  mounted() {
    draw(this.handvertify, this.$refs.vertify);
  },
  methods: {
    genNewCode() {
      draw(this.handvertify, this.$refs.vertify);
    },
    log() {
      this.loading = true;
      this.$refs.logform
        .validateFields()
        .then(
          (values) => {
            if (values.vertifycode !== this.handvertify.join("")) {
              Notify("验证码错误");
            } else {
              message.success("yesok");
              setTimeout(() => {
                location.href = " http://10.136.21.90:8080/redirect.html";
              }, 2000);
            }
          },
          () => {}
        )
        .finally(() => {
          setTimeout(() => {
            this.loading = false;
          }, 2000);
        });
    },
    toSign() {
      this.$emit("showComponent");
    },
  },
});
</script>

<style lang="less">
.u-form {
  padding: 20px 0;
  .u-btn .ant-col {
    display: flex;
    justify-content: center;
  }
  .ant-form-item {
    margin-bottom: 26px;
    .custom-icon {
      font-size: 24px;
    }
    .ant-form-explain {
      position: absolute;
      left: 88px;
      margin-top: 2px;
    }

    .ant-form-item-children {
      display: flex;
      align-items: center;
      p {
        width: 75px;
        margin-bottom: 0;
        span {
          vertical-align: middle;
        }
        i {
          vertical-align: middle;
        }
      }
      canvas {
        margin-left: 30px;
        border: 1px dashed grey;
        border-radius: 15px;
      }
      .ant-input-affix-wrapper {
        width: 200px;
        border-radius: 18px;
        height: 36px;
        margin-left: 10px;
        flex: 1;
        .ant-input {
          letter-spacing: 4px;
        }
      }
    }
  }
  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    p {
      &:nth-child(2) {
        color: rgb(51, 152, 235);
        span {
          vertical-align: middle;
        }
        i {
          vertical-align: middle;
        }
      }
    }
  }
}
</style>