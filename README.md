# upload-and-clip-image

[![Build Status](https://travis-ci.org/dudumifan/upload-and-clip-image.svg?branch=master)](https://travis-ci.org/dudumifan/upload-and-clip-image)
[![codecov](https://codecov.io/gh/dudumifan/upload-and-clip-image/branch/master/graph/badge.svg)](https://codecov.io/gh/dudumifan/upload-and-clip-image)


- 使用 Vue + Element-ui + Vuex, 
- 可提前限制上传图片的分辨率比例，用以适配固定图片比例的场景
- 可灵活控制需要裁减上传的图片的大小，仅从完整图中裁减需要的部分。
- 如果需求是不限制原始图的大小比例，且最终图需要符合预定的比例，则可修改代码为比例不符合时进行填白处理

- 演示地址[请戳这里](https://dudumifan.github.io/upload-and-clip-image/)

- [个人博客](https://my.oschina.net/mdu)

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your unit tests
```
npm run test:unit
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
