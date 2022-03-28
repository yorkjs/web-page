# web-page

监听网页 `show`、`hide`、`enter`、`leave` 事件。

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
  WebPage.ENTER,
  function (data) {
    console.log('enter', data)
  }
)
WebPage.addEventListener(
  WebPage.LEAVE,
  function (data) {
    console.log('leave', data)
  }
)
```

## API

### init()

初始化。

### addEventListener(type, listener)

监听事件，仅支持对外暴露的常量事件。

## 兼容性

* `show`、`hide` 事件仅适用于支持 `visibilitychange` 事件的浏览器。
* `enter`、`leave` 事件仅适用于支持 `pageshow` 和 `pagehide` 事件的浏览器。