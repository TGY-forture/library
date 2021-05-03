<template>
  <div ref="mountdrawer" class="mount-drawer">
    <a-drawer
      v-model:visible="visible"
      title="个人信息"
      :closable="false"
      :getContainer="() => $refs.mountdrawer"
      placement="top"
      :height="height"
      :destroyOnClose="true"
      @close="$emit('closedrawer')"
    >
      <a-form
        ref="inform"
        :model="profile"
        v-bind="{ labelCol: { span: 6 }, wrapperCol: { span: 18 } }"
      >
        <a-form-item label="学号">
          <a-input v-model:value="profile.studycode"></a-input>
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
            <a-select-option value="tgy">tgy</a-select-option>
            <a-select-option value="45">45</a-select-option>
            <a-select-option value="wes">wes</a-select-option>
            <a-select-option value="tgy">tgy</a-select-option>
            <a-select-option value="45">45</a-select-option>
            <a-select-option value="wes">wes</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="邮箱">
          <a-input v-model:value="profile.email"></a-input>
        </a-form-item>
        <a-form-item label="电话">
          <a-input v-model:value="profile.phone"></a-input>
        </a-form-item>
      </a-form>
      <div style="text-align: center">
        <a-button type="primary" shape="round" @click="saveProfile">
          保存
        </a-button>
      </div>
    </a-drawer>
  </div>
</template>

<script>
import { watch, defineComponent, reactive, ref } from "vue";
import { message } from "ant-design-vue";

export default defineComponent({
  name: 'Personal',
  emits: ['closedrawer'],
  props: ['drawershow', 'height', 'github'],
  setup(props) {
    const profile = reactive({
      studycode: '172210303316',
      nickname: "hahhhhh",
      gender: "woman",
      age: 18,
      faculty: "lu",
      phone: "18361812729",
      email: '1453836790@qq.com'
    });
    let visible = ref(false);
    watch(() => props.drawershow, (nval) => {
      visible.value = nval;
    })
    return {
      profile,
      visible
    }
  },
  methods: {
    saveProfile() {//保存完善信息
      this.$axios.put('/sign', {
        ...this.profile,
        github: this.github
      }).then(({ data }) => {
        if (data === 1) {
          this.$emit('closedrawer', this.profile.studycode);
          if (this.github === 0) {
            message.success('保存成功')
          } else {
            message.loading({
              content: '保存中...',
              duration: 0,
              key: 'info'
            });
          }
        } else {
          message.error({
            content: '保存失败',
            duration: 1
          })
        }
      }).catch(e => {
        console.error(e)
      })
    },
  }
})
</script>

<style lang="less">
.mount-drawer {
  .ant-drawer-top.ant-drawer-open .ant-drawer-content-wrapper {
    box-shadow: none;
    .ant-drawer-wrapper-body::-webkit-scrollbar {
      display: none;
    }
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
</style>