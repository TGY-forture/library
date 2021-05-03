<template>
  <div class="u-profile" ref="uprofile">
    <div class="top">
      <img :src="user.avatar" alt="logo" />
      <div>
        <p>
          <span>{{ user.nickname }}</span>
          <span>
            <i class="custom-icon custom-icon-starmarkhighligh"></i>
            {{ user.star }}
          </span>
        </p>
        <p>
          <i
            class="custom-icon"
            :class="
              user.gender === 'man' ? 'custom-icon-man' : 'custom-icon-woman'
            "
          ></i>
        </p>
      </div>
    </div>
    <div style="margin: 10px 0">
      <a-upload
        v-model:file-list="filelist"
        :headers="upheaders"
        name="avatar"
        accept=".png,.jpeg,.jpg"
        action="https://10.136.21.90:5000/avatar"
        method="post"
        @change="handleChange"
      >
        <a-button>
          <upload-outlined></upload-outlined>
          上传头像
        </a-button>
      </a-upload>
    </div>
    <div class="user-infor">
      <a-row>
        <a-col :span="10" :offset="2">
          <i class="custom-icon custom-icon-xiugainicheng"></i>
          <span>昵称</span>
        </a-col>
        <a-col>{{ user.nickname }}</a-col>
      </a-row>
      <a-row>
        <a-col :span="10" :offset="2">
          <i class="custom-icon custom-icon-Studentid"></i>
          <span>学号</span>
        </a-col>
        <a-col>{{ user.student }}</a-col>
      </a-row>
      <a-row>
        <a-col :span="10" :offset="2">
          <i class="custom-icon custom-icon-gender"></i>
          <span>性别</span>
        </a-col>
        <a-col>{{ user.gender === "man" ? "男" : "女" }}</a-col>
      </a-row>
      <a-row>
        <a-col :span="10" :offset="2">
          <i class="custom-icon custom-icon-age1"></i>
          <span>年龄</span>
        </a-col>
        <a-col>{{ user.age }}</a-col>
      </a-row>
      <a-row>
        <a-col :span="10" :offset="2">
          <i class="custom-icon custom-icon-faculty"></i>
          <span>学院</span>
        </a-col>
        <a-col>{{ user.faculty }}</a-col>
      </a-row>
      <a-row>
        <a-col :span="10" :offset="2">
          <i class="custom-icon custom-icon-concat"></i>
          <span>电话</span>
        </a-col>
        <a-col>{{ user.phone }}</a-col>
      </a-row>
      <a-row>
        <a-col :span="10" :offset="2">
          <i class="custom-icon custom-icon-Email"></i>
          <span>邮箱</span>
        </a-col>
        <a-col>{{ user.email }}</a-col>
      </a-row>
    </div>
    <div class="edit-tool">
      <a-button type="primary" size="large" @click="edit">
        <template v-slot:icon>
          <i class="custom-icon custom-icon-edit"> </i>
        </template>
        编辑
      </a-button>
    </div>
    <a-drawer
      placement="bottom"
      height="440px"
      :destroyOnClose="true"
      :closable="false"
      :visible="visible"
      :getContainer="() => $refs.uprofile"
      @close="onClose"
    >
      <template v-slot:title>
        <span>修改信息</span>
        <a-button type="primary" @click="handleInfo">
          <template v-slot:icon>
            <i class="custom-icon custom-icon-ok"></i>
          </template>
          保存
        </a-button>
      </template>
      <a-form
        :model="formfields"
        :labelCol="{ span: 5 }"
        :wrapperCol="{ span: 19 }"
      >
        <a-form-item label="学号">
          <a-input v-model:value="formfields.student" disabled></a-input>
        </a-form-item>
        <a-form-item label="昵称">
          <a-input v-model:value="formfields.nickname"></a-input>
        </a-form-item>
        <a-form-item label="性别">
          <a-radio-group v-model:value="formfields.gender">
            <a-radio value="man">男</a-radio>
            <a-radio value="woman">女</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="年龄">
          <a-input-number
            :min="15"
            :max="30"
            v-model:value="formfields.age"
          ></a-input-number>
        </a-form-item>
        <a-form-item label="学院">
          <a-select v-model:value="formfields.faculty">
            <a-select-option v-for="index in 10" :key="index" :value="index">
              {{ index }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="电话">
          <a-input v-model:value="formfields.phone"></a-input>
        </a-form-item>
        <a-form-item label="邮箱">
          <a-input v-model:value="formfields.email" disabled></a-input>
        </a-form-item>
      </a-form>
    </a-drawer>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, computed } from "vue";
import { mapState, useStore } from 'vuex'
import { UploadOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";

export default defineComponent({
  name: "Profile",
  components: { UploadOutlined },
  setup() {
    let filelist = ref([]);
    let visible = ref(false);
    const formfields = reactive({
      student: '',
      nickname: '',
      gender: 'man',
      age: 18,
      faculty: '1',
      phone: '',
      email: '',
    });
    const store = useStore();
    const edit = () => {
      for (let k in formfields) {
        formfields[k] = store.state.user[k]
      }
      visible.value = true;
    };
    const onClose = () => {
      visible.value = false;
    };
    const handleChange = (info) => {
      let res = info.file.response;
      filelist.value = [...info.fileList.slice(-1)];
      if (info.file.status === 'done' && res !== -1) {
        store.dispatch('getUserInfo');
        message.success(`上传成功`);
      }
      if (info.file.status === 'error') {
        message.error(`上传失败`);
      }
    };
    const handleInfo = async () => {
      const data = await store.dispatch('updateUserInfo', formfields);
      if (data === 1) {
        message.success('更新成功');
        visible.value = false;
      } else {
        message.error('更新失败');
      }
    };
    return {
      edit,
      onClose,
      visible,
      filelist,
      formfields,
      handleInfo,
      handleChange,
    };
  },
  data() {
    return {
      upheaders: {},
    }
  },
  computed: {
    ...mapState(['user'])
  },
  created() {
    let accessToken = localStorage.getItem('accessToken');
    let refreshToken = localStorage.getItem('refreshToken');
    this.upheaders = {
      Authorization: 'Bearer ' + accessToken,
      RefreshToken: refreshToken
    }
  },
  methods: {}
});
</script>

<style lang="less">
.u-profile {
  .top {
    color: white;
    background-color: rgb(60, 158, 238);
    padding: 20px;
    border-radius: 30px;
    display: flex;
    align-items: center;
    img {
      width: 48px;
      height: 48px;
      border-radius: 24px;
      margin-right: 10px;
      object-fit: cover;
    }
    div {
      flex-grow: 1;
      p {
        margin-bottom: 0;
        display: flex;
        align-items: flex-end;
        span:last-child {
          margin-left: auto;
        }
      }
    }
  }
  .user-infor {
    .ant-row {
      flex-flow: row nowrap;
      align-items: center;
      margin-bottom: 16px;
      .ant-col {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        &:first-child {
          span {
            vertical-align: middle;
            margin-left: 10px;
          }
          .custom-icon {
            font-size: 24px;
            vertical-align: middle;
            color: rgb(43, 100, 153);
          }
        }
      }
    }
  }
  .edit-tool {
    text-align: center;
    margin-top: 20px;
  }
  .ant-drawer-bottom.ant-drawer-open .ant-drawer-content-wrapper {
    box-shadow: none;
    .ant-drawer-content {
      border-radius: 10px 10px 0 0;
      .ant-drawer-title {
        display: flex;
        align-items: center;
        .ant-btn {
          margin-left: auto;
          // color: #1296db;
        }
      }
      .ant-drawer-body .ant-form {
        .ant-row {
          align-items: center;
          .ant-col {
            padding: 0;
          }
        }
      }
    }
  }
}
</style>