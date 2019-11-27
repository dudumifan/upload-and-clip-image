<template>
  <div ref="disabledselect">
    <el-dialog
      title="图片编辑"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="dialogVisible"
      :width="img_info._width > 500 ? `${img_info._width + 80 }px` : `550px`"
      :before-close="cancel"
    >
      <div
        class="cut-box"
        :style="box_style_obj"
        @mousedown="mousedown"
        @mousemove="mousemove"
        @mouseup="mouseleave"
        @mouseleave="mouseleave"
      >
        <img
          class="cut-img"
          :style="img_style_obj"
          @click="false"
          ref="img"
          width="100%"
          :src="img_src"
          alt="图片剪切"
        />
      </div>
      <div class="cut-slider">
        <el-slider v-model="img_info.mul" :min="img_info.min_mul" :max="200" @input="changeImgMul"></el-slider>
      </div>
      <div class="cut-btn-tips">
        <div class="cut-btn">
          <el-button @click="sub">-</el-button>
          <span>{{img_info.mul}}%</span>
          <el-button @click="add">+</el-button>
        </div>

        <ul class="cut-tips">
          <li>注1：鼠标拖动图片即可选择区域</li>
          <li>注2：所见即所得</li>
        </ul>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="confirm">裁切并上传</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "cutImg",
  props: {
    fileList: [String, FileList],
    width: Number,
    height: Number
  },
  data() {
    return {
      img_style_obj: { width: "100%", height: "100%" },
      box_style_obj: { width: "300px", height: "300px" },
      img_src: "",
      img_info: {
        min_mul: 0, // 最小倍数
        _mul: 0, // 最小边缩放倍数 _mul 裁剪框与目标分辨率的比值
        _min: 250, // 最小边建议值
        _width: 0, // 缩小后的边框值
        _height: 0,
        b_w: 0, // 原图尺寸
        b_h: 0,
        mul: 100, // 图片缩略倍数 默认原图比例 裁剪图与原图比值
        s_w: 0, // 缩略图尺寸 默认不缩放
        s_h: 0
      },
      move_info: {
        o_x: 0, // 点击坐标
        o_y: 0,
        move_x: 0, // 移动距离
        move_y: 0
      },
      is_move: false,
      dialogVisible: true
    };
  },
  created() {
    const self = this;
    var reader = new FileReader();
    reader.onload = function(e) {
      self.img_src = e.target.result;
    };
    reader.readAsDataURL(this.fileList[0]);
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.disabledselect.onselectstart = new Function(
        "event.returnValue=false;"
      );
      this.$refs.img.onload = () => {
        this.img_info.b_h = this.$refs.img.naturalHeight;
        this.img_info.b_w = this.$refs.img.naturalWidth;

        if (this.width >= this.height) {
          this.img_info._height = this.img_info._min;

          this.img_info._mul = this.height / this.img_info._height;
          this.img_info._width = this.width / this.img_info._mul;
        } else {
          this.img_info._width = this.img_info._min;

          this.img_info._mul = this.width / this.img_info._width;
          this.img_info._height = this.height / this.img_info._mul;
        }

        this.setMul();

        this.box_style_obj = {
          width: `${this.img_info._width}px`,
          height: `${this.img_info._height}px`
        };
      };
    });
  },

  methods: {
    setMul() {
      while (this.sub()) {
        this.sub();
      }
      this.img_info.min_mul = this.img_info.mul;
    },
    changeImgMul(val) {
      this.calcImgSize(val, 1);
    },
    // 缩放 每次缩放 1%
    sub() {
      let { mul } = this.img_info;
      if (mul > 1) {
        mul--;
        return this.calcImgSize(mul, 1);
      } else {
        return false;
      }
    },
    add() {
      let { mul } = this.img_info;
      if (mul < 150) {
        mul++;
        return this.calcImgSize(mul, 2);
      } else {
        return false;
      }
    },
    // 计算图片尺寸
    calcImgSize(mul, type) {
      const { _height, _width } = this.img_info;
      let { move_x, move_y } = this.move_info;
      const s_w = (this.img_info.b_w * mul) / 100;
      const s_h = (this.img_info.b_h * mul) / 100;

      // 计算缩放是否超出范围了
      if (s_h < _height || s_w < _width) {
        return false;
      }
      if (type === 1) {
        // 计算移动距离是否露白
        if (Math.abs(move_y) + _height > s_h) {
          move_y = move_y + (this.img_info.s_h - s_h);
          move_y = move_y >= 0 ? 0 : move_y;
          this.move_info.move_y = move_y;
        }
        if (Math.abs(move_x) + _width > s_w) {
          move_x = move_x + (this.img_info.s_w - s_w);
          move_x = move_x >= 0 ? 0 : move_x;
          this.move_info.move_x = move_x;
        }
        this.$refs.img.style.transform = `translate(${move_x}px, ${move_y}px)`;
      }

      this.img_info.s_w = s_w;
      this.img_info.s_h = s_h;
      this.img_info.mul = mul;

      this.img_style_obj = {
        width: `${this.img_info.s_w}px`,
        height: `${this.img_info.s_h}px`
      };
      return true;
    },
    mousedown(ev) {
      const { pageX, pageY } = ev;
      this.is_move = true;
      // 记录点击点
      this.move_info.o_x = pageX;
      this.move_info.o_y = pageY;
    },
    mousemove(ev) {
      if (!this.is_move) return;

      const { move_x, move_y } = this.getMoveDistance(ev);
      this.$refs.img.style.transform = `translate(${move_x}px, ${move_y}px)`;
    },
    mouseleave(ev) {
      // console.groupEnd()
      if (!this.is_move) return;
      // const { pageX, pageY } = ev
      const { move_x, move_y } = this.getMoveDistance(ev);
      this.move_info.move_x = move_x;
      this.move_info.move_y = move_y;
      this.is_move = false;
    },
    getMoveDistance(ev) {
      const { pageX, pageY } = ev;
      const { s_w, s_h, _width, _height } = this.img_info;
      const { o_x, o_y } = this.move_info;
      let { move_x, move_y } = this.move_info;

      let distance = 0;

      // 默认 min 的边，不能移动
      move_x = s_w <= _width ? 0 : pageX - o_x + move_x;
      move_y = s_h <= _height ? 0 : pageY - o_y + move_y;
      // 超过 min 的边，y不能为正 即不能向下拉 负值不能大于-min的余
      if (move_y >= 0) {
        move_y = 0;
      } else if (Math.abs(move_y) > (distance = s_h - _height)) {
        move_y = -distance;
      }
      if (move_x >= 0) {
        move_x = 0;
      } else if (Math.abs(move_x) > (distance = s_w - _width)) {
        move_x = -distance;
      }
      return { move_x, move_y };
    },
    cancel() {
      this.dialogVisible = false;
      this.$emit("cancelCut");
    },
    confirm() {
      // 计算要裁切的坐标
      const { s_w, s_h, mul, _mul, _width, _height } = this.img_info;
      const { move_x, move_y } = this.move_info;
      // 左上角坐标 位移坐标 在缩放了N倍的图上的坐标
      const x = (move_x / mul) * 100;
      const y = (move_y / mul) * 100;

      // 截取图的宽高
      const x1 = (_width / mul) * 100;
      const y1 = (_height / mul) * 100;

      // 要裁切的坐标不满足宽高时进行提示
      if (s_w < _width || s_h < _height) {
        this.$message.error("图片尺寸不符合预期！");
        return;
      }

      this.dialogVisible = false;

      this.$emit("setCutCoordinate", {
        x,
        y,
        x1,
        y1,
        _mul,
        mul,
        img: this.$refs.img
      });
    }
  }
};
</script>

<style scoped>
.el-dialog__body {
  padding: 10px;
}
.cut-box {
  margin: 0 auto;
  box-sizing: content-box;
  overflow: hidden;
  border: 1px dashed red;
  position: relative;
}
.cut-box::after {
  width: 100%;
  height: 100%;
  content: "";
  position: absolute;
  top: 0;
  left: 0;
}
.cut-img {
  transition: all 0.1s;
  min-width: 50px;
  min-height: 50px;
}
.cut-slider {
  width: 80%;
  margin: 0 auto;
}
.cut-btn-tips {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
}
.cut-btn span {
  margin: 0 10px;
}
.cut-tips {
  font-size: 12px;
  color: #585858;
  line-height: 16px;
  margin-left: 20px;
}
</style>