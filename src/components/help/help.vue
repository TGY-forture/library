<template>
  <div class="u-help">
    <a-form v-bind="{ labelCol: { span: 5 }, wrapperCol: { span: 19 } }">
      <a-form-item label="学号">
        <a-input placeholder="请输入学号"></a-input>
      </a-form-item>
      <a-form-item label="邮箱">
        <a-input placeholder="请输入邮箱"></a-input>
      </a-form-item>
      <a-form-item label="验证码">
        <a-input placeholder="请输入验证码" disabled></a-input>
      </a-form-item>
      <a-form-item label="新密码">
        <a-input placeholder="请输入新密码" disabled></a-input>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "Help",
});
</script>

<style lang="less">
.u-help {
  .ant-form-item {
    cursor: pointer;
    display: flex;
    align-items: center;
    .ant-form-item-label {
      padding: 0;
    }
    .ant-input {
      border-radius: 16px;
    }
  }
}
</style>