<template>
  <div class="home" ref="uhome">
    <header class="nav">
      <a-input-search
        placeholder="搜索用户昵称或学号"
        :loading="loading"
        @search="search"
      ></a-input-search>
      <a-popover
        trigger="click"
        placement="leftTop"
        :getPopupContainer="() => $refs.uhome"
      >
        <template #content>
          <ul class="u-pop-cntent">
            <li>
              <i class="custom-icon custom-icon-scan"></i>
              <span>扫描二维码</span>
            </li>
            <li>
              <i class="custom-icon custom-icon-share"></i>
              <span>分享本网站</span>
            </li>
          </ul>
        </template>
        <i class="custom-icon custom-icon-plus"></i>
      </a-popover>
      <a-popover
        trigger="click"
        placement="bottomRight"
        :getPopupContainer="() => $refs.uhome"
      >
        <template #content>
          <ul class="head-content">
            <li>
              <i class="custom-icon custom-icon-developer"></i>
              <span>关于作者</span>
            </li>
            <li>
              <i class="custom-icon custom-icon-log-out"></i>
              <span>注销登录</span>
            </li>
            <li>
              <i class="custom-icon custom-icon-question"></i>
              <span>问题帮助</span>
            </li>
          </ul>
        </template>
        <img src="@/assets/img/1232381748.jpeg" alt="avatar" />
      </a-popover>
    </header>
    <div class="menu">
      <nav class="func-select" @click="to">
        <span data-index="0">座位选择</span>
        <span data-index="1">预约中心</span>
        <span data-index="2">留言消息</span>
        <span data-index="3">个人信息</span>
      </nav>
      <div class="block">
        <span ref="slider"></span>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { useStore } from 'vuex';

export default defineComponent({
  name: "Index",
  setup() {
    const store = useStore();
    store.dispatch('getUserInfo'); //获取用户信息
    store.dispatch('getSeatInfo');//获取座位信息
    store.dispatch('getBookRecord');//获取预约全部预约记录
    store.dispatch('getUserRecord');//获取用户预约记录
  },
  data() {
    return {
      loading: false,
    };
  },
  created() { },
  mounted() {
    let path = window.location.pathname;
    let num;
    switch (path) {
      case '/seat': num = 0; break;
      case '/appoint': num = 1; break;
      case '/message': num = 2; break;
      case '/profile': num = 3; break;
      default: num = 0; break;
    }
    this.$refs.slider.style.setProperty("--offset", num);
  },
  methods: {
    to(e) {
      let num = e.target.dataset.index;
      if (num == undefined) return;
      this.$refs.slider.style.setProperty("--offset", num);
      switch (num) {
        case "0":
          this.$router.push("/seat");
          break;
        case "1":
          this.$router.push("/appoint");
          break;
        case "2":
          this.$router.push("/message");
          break;
        case "3":
          this.$router.push("/profile");
          break;
        default:
          break;
      }
    },
    search() {
      this.loading = true;
      setTimeout(() => {
        this.$router.push("/search");
        this.loading = false;
      }, 1000);
    },
  },
});
</script>

<style lang="less">
.home {
  .nav {
    display: flex;
    align-items: center;
    .custom-icon-plus {
      font-size: 24px;
      margin-right: 10px;
    }
    img {
      width: 30px;
      height: 30px;
      border-radius: 15px;
      object-fit: cover;
      border: 2px solid #40a9ff;
    }
    .ant-input-search {
      width: 200px;
      border-radius: 16px;
      margin-right: auto;
    }
  }
  .menu {
    margin: 20px 0;
    .func-select {
      font-size: 12px;
      font-weight: bold;
      display: flex;
      justify-content: space-between;
    }
    .block {
      position: relative;
      span {
        --offset: 0;
        display: block;
        position: absolute;
        width: 48px;
        height: 4px;
        transition: left 0.3s;
        background-color: black;
        border-radius: 2px;
        left: calc(((100% - 48 * 4px) / 3 + 48px) * var(--offset));
      }
    }
  }
  .ant-popover-inner-content {
    .u-pop-cntent {
      margin-bottom: 0;
      span {
        font-size: 12px;
        margin-left: 4px;
      }
      .custom-icon {
        vertical-align: middle;
      }
    }
    .head-content {
      margin-bottom: 0;
      li {
        margin: 5px 0;
        .custom-icon {
          font-size: 18px;
          margin-right: 5px;
          vertical-align: middle;
        }
        span {
          font-size: 12px;
          vertical-align: middle;
        }
      }
    }
  }
}
</style>