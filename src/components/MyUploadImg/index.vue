<template>
  <div class="my-upload">
    <div class="my-upload-box" @click="selectFile">
      <i class="el-icon-plus my-upload-icon"></i>
      <input
        type="file"
        class="my-upload-input"
        ref="input"
        accept="image/png, image/jpeg, image/jpg"
        @change="inputOnChange"
      />
    </div>

    <p class="my-upload-tips">建议分辨率 {{img_width}} * {{img_height}} 或倍数，{{max_size}}M以内的png、jpg图片</p>

    <div class="my-upload-img-list">
      <img-list
        :img_list="img_list"
        :url="url"
        :has_cover="has_cover"
        @removeImg="removeImg"
        @setCover="setCover"
      ></img-list>
    </div>

    <div v-if="show_cut_img">
      <cut-img
        :fileList="fileList"
        :width="img_width"
        :height="img_height"
        @cancelCut="cancelCut"
        @setCutCoordinate="setCutCoordinate"
      ></cut-img>
    </div>

    <div v-if="show_canvas">
      <my-canvas
        :coordinate="coordinate"
        :fileList="fileList"
        :width="img_width"
        :height="img_height"
        @setBlob="setBlob"
        @setImg="setImg"
      ></my-canvas>
    </div>
  </div>
</template>

<script>
// import { device_list } from '@/utils/constant'
import cutImg from "./cut";
import myCanvas from "./canvas";
import imgList from "./imgList";
export default {
  name: "myUploadImg",
  props: {
    // 文件裁切限制宽度
    img_width: {
      type: Number,
      default: 200
    },
    // 文件裁切限制高度
    img_height: {
      type: Number,
      default: 200
    },
    // 文件限制大小，默认最大10M
    max_size: {
      type: Number,
      default: 5
    },
    /**
     * [{url: '***'}]
     */
    img_list: {
      type: Array,
      required: true
    },
    has_cover: {
      type: Boolean,
      default: false
    },
    // 拖拽组名
    draggable_group_name: {
      type: String,
      default: "img"
    },
    // 图片对象的默认URL名称
    url: {
      type: String,
      default: "url"
    }
  },

  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
      fileList: "",
      show_cut_img: false,
      show_canvas: false,
      coordinate: {},
      max_size_bit: 0
    };
  },
  created() {
    this.max_size_bit = 1024 * 1024 * this.max_size;
  },
  watch: {
    max_size: function(nvl) {
      this.max_size_bit = 1024 * 1024 * nvl;
    }
  },
  methods: {
    // 选择文件
    selectFile() {
      this.$refs.input.click();
      // 清除input内容
      this.$refs.input.value = "";
    },
    // 触发裁剪
    inputOnChange(ev) {
      const files = ev.target.files;
      if (!files) return;
      // console.log(files)
      if (files[0].size > this.max_size_bit) {
        this.$message.error(`图片过大, 最大支持${this.max_size}M`);
        return;
      }
      this.fileList = files;
      this.show_cut_img = true;
      this.show_canvas = false;
    },
    // 接收裁剪坐标
    setCutCoordinate(coordinate) {
      this.coordinate = coordinate;
      this.show_canvas = true;
      this.cancelCut();
    },
    // 取消编辑图片
    cancelCut() {
      this.show_cut_img = false;
    },
    // 获取裁剪后的blob数据用于上传
    setBlob({ _img_date }) {
      const file_name = this.fileList[0].name;
      const type = this.fileList[0].type;
      // 转为 blob 数据
      _img_date = new Blob([_img_date], { type });

      const form_data = new FormData();
      form_data.append("file", _img_date, file_name);
      this.$emit("uploadImg", form_data);
    },
    setImg(options){
      this.$emit("uploadImg", options);
    },
    // 移除图片
    removeImg(options) {
      this.$emit("removeImg", options);
    },
    // 设置主图
    setCover(options) {
      this.$emit("setCover", options);
    }
  },
  components: { cutImg, myCanvas, imgList }
};
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
.my-upload-box {
  background-color: #fbfdff;
  border: 1px dashed #c0ccda;
  border-radius: 6px;
  box-sizing: border-box;
  width: 128px;
  height: 128px;
  cursor: pointer;
  line-height: 126px;
  vertical-align: top;
}
.my-upload-icon {
  font-size: 28px;
  margin-left: 49px;
  color: #c0ccda;
}
.my-upload-box:hover {
  border-color: rgb(111, 148, 243);
}
.my-upload-box:hover + .my-upload-icon {
  color: rgb(111, 148, 243);
}
.my-upload-tips {
  font-size: 14px;
  color: rgb(146, 146, 146);
  margin: 10px 0;
}
.my-upload-input {
  display: none;
}
</style>
