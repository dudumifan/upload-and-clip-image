<template>
  <div class="upload-canvas">
    <canvas
      id="canvas"
      ref="canvas"
      :width="`${this.canvas_width}px`"
      :height="`${this.canvas_height}px`"
    ></canvas>
  </div>
</template>

<script>
export default {
  name: "my-canvas",
  props: {
    /**
     * 获取的坐标值
     * {x,y,x1,y1,mul} x,y 为 左上角 x1,y2 右下角(不满整图，则取值宽高) mul扩大倍数 img 原图el
     */
    coordinate: {
      type: Object,
      required: true
    },
    fileList: [String, FileList],
    width: Number,
    height: Number
  },
  data() {
    return {
      canvas_width: 0,
      canvas_height: 0
    };
  },
  created() {
    // _mul 裁剪框与目标分辨率的比值 1080/250 mul 裁剪图与原图比值 680/250
    // mul / _mul
    const { x1, y1 } = this.coordinate;
    this.canvas_width = x1 > this.width ? x1 : this.width;
    this.canvas_height = y1 > this.height ? y1 : this.height;
  },
  mounted() {
    this.$nextTick(() => {
      this.createCanvas();
    });
  },

  methods: {
    createCanvas() {
      const { x, y, img, x1, y1 } = this.coordinate;

      const canvas = this.$refs.canvas;
      const ctx = canvas.getContext("2d");
      // 先铺满背景
      ctx.rect(0, 0, this.canvas_width, this.canvas_height);
      ctx.fillStyle = "#fff";
      ctx.fill();

      ctx.drawImage(
        img,
        Math.abs(x),
        Math.abs(y),
        x1,
        y1,
        0,
        0,
        this.canvas_width,
        this.canvas_height
      );

      // 转换图片用于上传
      let img_data = canvas.toDataURL(this.fileList[0].type);
      
      this.$emit("setImg", { img_data });
      /**
       * 以下用于上传，示例中不包含上传处理，故注释
       */
      // 去除base64多余字符
      // img_data = img_data.split(",")[1];
      // img_data = window.atob(img_data);

      // const _img_data = new Uint8Array(img_data.length);
      // for (var i = 0; i < img_data.length; i++) {
      //   _img_data[i] = img_data.charCodeAt(i);
      // }
      // this.$emit("setBlob", { _img_data });
    }
  }
};
</script>

<style scoped>
.upload-canvas {
  width: 0px;
  height: 0px;
  overflow: hidden;
}
#canvas {
  border: 1px solid red;
  box-sizing: content-box;
}
</style>