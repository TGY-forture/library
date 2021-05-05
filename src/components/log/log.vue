<template>
  <div class="u-form" ref="ufind">
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
        <span @click="getPass">找回密码</span
        ><i class="custom-icon custom-icon-question"></i>
      </p>
      <p>
        <span @click="toSign">前往注册</span
        ><i class="custom-icon custom-icon-Right"></i>
      </p>
    </footer>
    <div class="github-link">
      <i class="custom-icon custom-icon-github" @click="githubAuthorize"></i>
    </div>
    <p class="copyright">
      <i class="custom-icon custom-icon-copyright"></i>
      <span>CopyRight TGY 2021</span>
    </p>
    <Info
      :height="550"
      :drawershow="drawershow"
      :github="1"
      @closedrawer="close"
    ></Info>
    <a-modal
      :visible="visible"
      title="验证"
      :getContainer="() => $refs.ufind"
      @cancel="visible = false"
      :closable="false"
      :footer="null"
      :destroyOnClose="true"
    >
      <Help @shutmodal="visible = false" />
    </a-modal>
  </div>
</template>

<script>
import { defineComponent, reactive, ref } from "vue";
import { draw } from "@/assets/js/vertifycode.js";
import { message } from "ant-design-vue";
import Help from "../help/help.vue";
import md5 from "blueimp-md5";
import Info from '../util/drawer.vue'

export default defineComponent({
  name: "Log",
  components: { Help, Info },
  setup() {
    const formfields = reactive({
      user: "172210303316",
      pass: "12345678",
      vertifycode: "",
    });
    const loading = ref(false);
    let drawershow = ref(false);
    let visible = ref(false);
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
    const getPass = () => {
      visible.value = true;
    };
    return {
      drawershow,
      formfields,
      rules,
      loading,
      visible,
      getPass,
    };
  },
  data() {
    return {
      handvertify: [],
      content: ''
    };
  },
  mounted() {
    draw(this.handvertify, this.$refs.vertify); //验证码绘制函数
    const search = window.location.search.slice(1);
    if (search == '') return;
    const status = search.split('=')[1];
    window.history.pushState('', '', 'https://10.136.21.90:8080/'); //去掉search参数
    if (status === '-1') {
      message.error('认证失败')
    } else if (status === '0') {
      message.loading({
        key: 'check',
        content: '正在检查...',
        duration: 0
      })
      setTimeout(() => {
        message.destroy();
        this.drawershow = true;
      }, 1500);
    } else {
      window.location.href = 'https://10.136.21.90:8080/redirect.html'
    }
  },
  methods: {
    githubAuthorize() {
      let clientId = "8844a87df44b4fd63eb6";
      location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}`;
    },
    toSign() {
      this.$emit("showComponent");
    },
    genNewCode() {
      draw(this.handvertify, this.$refs.vertify);
    },
    close(studycode) {
      this.drawershow = false;
      message.loading({
        content: '自动登录中...',
        key: 'info',
        duration: 0
      })
      this.$axios.post('/token', { user: studycode }).then(() => {
        message.success({
          content: '登录成功',
          key: 'info',
          duration: 1
        })
      }).catch(() => {
        message.error({
          content: '登录失败',
          key: 'info',
          duration: 1
        })
      })
    },
    log() {
      this.$refs.logform.validateFields().then(
        async (values) => {
          if (values.vertifycode !== this.handvertify.join("")) {
            message.error("验证码错误");
          } else {
            this.loading = true;
            const { data } = await this.$axios.post('/log', {
              user: values.user,
              pass: md5(values.pass)
            });
            if (data === -1) {
              message.error('错误');
            } else if (data === 0) {
              message.warning('请注册完善信息');
            } else if (data === 1) {
              await this.$axios.post('/token', { user: values.user });
              message.success('登录成功');
              //跳转首页
              setTimeout(() => {
                message.destroy();
                window.location.href = 'https://10.136.21.90:8080/redirect.html'
              }, 2000);
            } else if (data === 2) {
              message.error('用户名或密码错误');
            } else {
              message.info('该用户已登录')
            }
          }
        }
      ).catch(e => {
        console.error(e)
      }).finally(() => {
        this.loading = false;
      });
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
  .github-link {
    margin-top: 80px;
    text-align: center;
    .custom-icon-github {
      font-size: 40px;
    }
  }
  .copyright {
    margin-top: 20px;
    text-align: center;
    span {
      vertical-align: middle;
      color: grey;
      font-size: 12px;
    }
    i {
      vertical-align: middle;
    }
  }
}
</style>
