import { expect } from "chai";
// import Vue from 'vue'
// import { shallowMount } from "@vue/test-utils";
// import MyUploadImg from "@/components/MyUploadImg/index.vue";
// import App from "@/App.vue";

describe("App/index.vue", () => {
  it("expect(Number(2).to.equal(2)", () => {
    // //获取组件实例
    // const Constructor = Vue.extend(App);
    // //挂载组件
    // const vm = new Constructor().$mount();
    // console.log('count >>> ', vm.count)
    // //获取button
    // const button = vm.$el.querySelector('button');
    // //新建点击事件
    // const clickEvent = new window.Event('click');
    // //触发点击事件
    // button.dispatchEvent(clickEvent);
    // //监听点击事件
    // vm._watcher.run();
    // 断言
    expect(Number(2)).to.equal(2)
  });
});
