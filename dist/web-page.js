/**
 * web-page.js v0.0.1
 * (c) 2021-2022 musicode
 * Released under the MIT License.
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.WebPage = {}));
}(this, (function (exports) { 'use strict';

  var LOAD = 'load';
  var SHOW = 'show';
  var HIDE = 'hide';
  var UNLOAD = 'unload';

  var visible;
  var listeners = {};
  function addDOMEventListener(element, type, listener) {
      if (element.addEventListener) {
          if (("on" + type) in element) {
              element.addEventListener(type, listener, true);
          }
      }
      // @ts-ignore
      else if (element.attachEvent) {
          // @ts-ignore
          element.attachEvent("on" + type, listener);
      }
  }
  function fireEvent(type, event) {
      var list = listeners[type];
      if (list) {
          for (var i = 0, len = list.length; i < len; i++) {
              if (list[i]) {
                  list[i]({
                      event: event,
                      visible: visible,
                  });
              }
          }
      }
  }
  function updateVisible() {
      var visibilityState = document.visibilityState;
      if (visibilityState === 'visible') {
          visible = true;
      }
      else if (visibilityState === 'hidden') {
          visible = false;
      }
      else {
          visible = undefined;
      }
  }
  function onVisibilityChange(event) {
      updateVisible();
      if (visible === true) {
          fireEvent(SHOW, event);
      }
      else if (visible === false) {
          fireEvent(HIDE, event);
      }
  }
  function onUnload(event) {
      fireEvent(UNLOAD, event);
  }
  function init() {
      updateVisible();
      addDOMEventListener(document, 'visibilitychange', onVisibilityChange);
      addDOMEventListener(window, 'beforeunload', onUnload);
  }
  function addEventListener(type, listener) {
      var list = listeners[type] || (listeners[type] = []);
      list.push(listener);
      if (type === LOAD) {
          fireEvent(LOAD);
      }
      return {
          remove: function() {
              for (var i = 0, len = list.length; i < len; i++) {
                  if (list[i] === listener) {
                      list.splice(i, 1);
                  }
              }
          }
      };
  }

  /**
   * 版本
   */
  var version = "0.0.1";

  exports.HIDE = HIDE;
  exports.LOAD = LOAD;
  exports.SHOW = SHOW;
  exports.UNLOAD = UNLOAD;
  exports.addEventListener = addEventListener;
  exports.init = init;
  exports.version = version;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=web-page.js.map
