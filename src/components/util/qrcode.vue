<template>
  <div class="u-scancode" ref="scan">
    <a-modal
      v-model:visible="modalShow"
      title="扫码"
      :centered="true"
      :getContainer="() => $refs.scan"
      :closable="false"
      :footer="null"
      :forceRender="true"
      @cancel="hide"
    >
      <canvas ref="canvas"></canvas>
    </a-modal>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import { notification, message } from 'ant-design-vue';
import jsQR from "jsqr";

export default defineComponent({
  name: "Qrcode",
  props: {
    visible: { type: Boolean, require: true },
    info: { type: Object, require: true }
  },
  emit: ["hideModal"],
  setup(props) {
    let modalShow = ref(props.visible);
    return {
      modalShow,
    };
  },
  data() {
    return {
      tracks: undefined,
      video: null,
      frame: undefined,
    };
  },
  watch: {
    visible: function (nval) {
      this.modalShow = nval;
      if (nval === true) {
        this.gerCamera();
      }
    },
  },
  methods: {
    hide() {
      this.$emit("hideModal");
      this.tracks[0].stop();
      cancelAnimationFrame(this.frame);
    },
    gerCamera() {
      this.video = this.video ? this.video : document.createElement("video");
      navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then((stream) => {
        this.tracks = stream.getTracks();
        this.video.srcObject = stream;
        this.video.play();
        this.drawPicture();
      }).catch((e) => alert(e));
    },
    async drawPicture() {
      if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
        let height = this.video.videoHeight;
        let width = this.video.videoWidth;
        let render = this.$refs.canvas.getContext("2d");
        this.$refs.canvas.height = height;
        this.$refs.canvas.width = width;
        render.drawImage(this.video, 0, 0, width, height);
        let imageData = render.getImageData(0, 0, width, height);
        let code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });
        if (code) {
          let id = JSON.parse(code.data).id;
          if (id !== this.info.id) {
            this.hide();
            message.warning('请选择正确的座位');
            return;
          }
          let { data } = await this.$axios.post('/signin', this.info);
          if (data === 1) {
            notification.success({
              message: '通知',
              description: '操作成功',
              duration: 3
            });
          } else {
            notification.error({
              message: '通知',
              description: '操作失败',
              duration: 3
            });
          }
          this.hide();
          return; //结束本次调用,避免关闭后仍运行 requestAnimationFrame
        }
      }
      this.frame = requestAnimationFrame(this.drawPicture);
    },
  },
});
</script>

<style lang="less">
.u-scancode {
  canvas {
    width: 100%;
  }
}
</style>