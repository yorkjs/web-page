# web-page

监听网页 `load`、`show`、`hide`、`unload` 事件。

## 安装

CDN

```html
<script src="https://unpkg.com/@yorkjs/web-page"></script>
```

NPM

```shell
npm install @yorkjs/web-page
```

YARN

```shell
yarn add @yorkjs/web-page
```

## 示例

```js
import * as WebPage from '@yorkjs/web-page'
WebPage.init()
WebPage.addEventListener(
  WebPage.LOAD,
  function (data) {
    console.log('load', data)
  }
)
WebPage.addEventListener(
  WebPage.SHOW,
  function (data) {
    console.log('show', data)
  }
)
WebPage.addEventListener(
  WebPage.HIDE,
  function (data) {
    console.log('hide', data)
  }
)
WebPage.addEventListener(
  WebPage.UNLOAD,
  function (data) {
    console.log('unload', data)
  }
)
```

## API

### init()

初始化。

### addEventListener(type, listener)

监听事件，仅支持对外暴露的常量事件。

## 兼容性

`show`、`hide` 事件仅适用于支持 `visibilitychange` 事件的浏览器。