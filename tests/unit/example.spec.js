import { expect } from "chai";
import { shallowMount } from "@vue/test-utils";
import MyUploadImg from "@/components/MyUploadImg";

describe("MyUploadImg/index.vue", () => {
  it("renders props.msg when passed", () => {
    // eslint-disable-next-line camelcase
    const img_list = [{ url: "" }, { url: "" }, { url: "" }];
    const wrapper = shallowMount(MyUploadImg, {
      propsData: { img_list }
    });
    console.log("HHHHHHHHHHHHHHHHHHHHH \n \n \n");
    console.log(wrapper);
    expect(".upload-img-box")
      .length()
      .equal(3);
  });
});
