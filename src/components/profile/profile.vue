<template>
  <div class="u-profile" ref="uprofile">
    <div class="top">
      <img :src="avatar" alt="logo" />
      <div>
        <p>
          <span>哭泣De火彩盒13120</span>
          <span>
            <i class="custom-icon custom-icon-starmarkhighligh"></i>23
          </span>
        </p>
        <p>
          <i class="custom-icon custom-icon-woman"></i>
          <span class="hide">选择隐藏信息</span>
        </p>
      </div>
    </div>
    <div style="margin: 10px 0">
      <a-upload
        v-model:file-list="filelist"
        name="avatar"
        accept=".png,.jpeg,.jpg"
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
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
        <a-col>哭泣De火彩盒De火彩盒哭泣De火彩盒</a-col>
      </a-row>
      <a-row>
        <a-col :span="10" :offset="2">
          <i class="custom-icon custom-icon-Studentid"></i>
          <span>学号</span>
        </a-col>
        <a-col>172210303316</a-col>
      </a-row>
      <a-row>
        <a-col :span="10" :offset="2">
          <i class="custom-icon custom-icon-gender"></i>
          <span>性别</span>
        </a-col>
        <a-col>nan</a-col>
      </a-row>
      <a-row>
        <a-col :span="10" :offset="2">
          <i class="custom-icon custom-icon-age1"></i>
          <span>年龄</span>
        </a-col>
        <a-col>8</a-col>
      </a-row>
      <a-row>
        <a-col :span="10" :offset="2">
          <i class="custom-icon custom-icon-faculty"></i>
          <span>学院</span>
        </a-col>
        <a-col>电子信息学院</a-col>
      </a-row>
      <a-row>
        <a-col :span="10" :offset="2">
          <i class="custom-icon custom-icon-concat"></i>
          <span>联系方式</span>
        </a-col>
        <a-col>18361812729</a-col>
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
        <a-button type="primary" @click="visible = false">
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
          <a-input v-model:value="formfields.scode"></a-input>
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
        <a-form-item label="联系方式">
          <a-input v-model:value="formfields.concat"></a-input>
        </a-form-item>
      </a-form>
    </a-drawer>
  </div>
</template>

<script>
import { defineComponent, ref, reactive } from "vue";
import { UploadOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

export default defineComponent({
  name: "Profile",
  components: { UploadOutlined },
  setup() {
    let avatar = ref(require("@/assets/img/avatar.jpeg"));
    const handleChange = (info) => {
      if (info.file.status === "done") {
        getBase64(info.file.originFileObj, (base64Url) => {
          avatar.value = base64Url;
        });
        message.success(`${info.file.name}上传成功`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} 上传失败`);
      }
    };
    const formfields = reactive({
      scode: "172210303316",
      nickname: "汇划费会废话",
      gender: "man",
      age: 22,
      faculty: "2",
      concat: "http://tgy-forture.com",
    });
    const filelist = ref([]);
    const visible = ref(false);
    const edit = () => {
      visible.value = true;
    };
    const onClose = () => {
      visible.value = false;
    };
    return {
      filelist,
      handleChange,
      avatar,
      visible,
      onClose,
      edit,
      formfields,
    };
  },
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