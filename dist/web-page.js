/**
 * web-page.js v0.0.5
 * (c) 2021-2022 musicode
 * Released under the MIT License.
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.WebPage = {}));
}(this, (function (exports) { 'use strict';

  var SHOW = 'show';
  var HIDE = 'hide';
  var ENTER = 'enter';
  var LEAVE = 'leave';

  var isInitCalled = false;
  var isPageAlive = false;
  var visible;
  var persisted;
  var events = {};
  var listeners = {};
  function supportEvent(element, type) {
      return ("on" + type) in element;
  }
  function addDOMEventListener(element, type, listener) {
      if (element.addEventListener) {
          element.addEventListener(type, listener, true);
      }
      // @ts-ignore
      else if (element.attachEvent) {
          // @ts-ignore
          element.attachEvent("on" + type, listener);
      }
  }
  function debounceListener(listener, delay) {
      var timer;
      return function () {
          if (!timer) {
              listener(arguments[0]);
              timer = setTimeout(function () {
                  timer = undefined;
              }, delay);
          }
      };
  }
  function fireEvent(type, event) {
      var data = {
          event: event,
          visible: visible,
          persisted: persisted,
      };
      events[type] = data;
      if (isInitCalled && isPageAlive) {
          fireEventData(type, data);
      }
  }
  function fireEventData(type, data) {
      var list = listeners[type];
      if (!list) {
          return;
      }
      for (var i = 0, len = list.length; i < len; i++) {
          if (list[i]) {
              list[i](data);
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
  var onPageEnter = debounceListener(function (event) {
      if (isPageAlive) {
          return;
      }
      isPageAlive = true;
      // @ts-ignore
      persisted = event.persisted === true;
      fireEvent(ENTER, event);
  }, 200);
  var onPageLeave = debounceListener(function (event) {
      if (!isPageAlive) {
          return;
      }
      // @ts-ignore
      persisted = event.persisted === true;
      fireEvent(LEAVE, event);
      isPageAlive = false;
  }, 200);
  function init() {
      isInitCalled = true;
      updateVisible();
  }
  function addEventListener(type, listener) {
      var list = listeners[type] || (listeners[type] = []);
      list.push(listener);
      if (type === ENTER && events[type]) {
          fireEventData(type, events[type]);
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
  if (supportEvent(document, 'visibilitychange')) {
      addDOMEventListener(document, 'visibilitychange', onVisibilityChange);
  }
  if (supportEvent(window, 'pageshow')) {
      addDOMEventListener(window, 'pageshow', onPageEnter);
  }
  addDOMEventListener(window, 'load', onPageEnter);
  if (supportEvent(window, 'pagehide')) {
      addDOMEventListener(window, 'pagehide', onPageLeave);
  }
  addDOMEventListener(window, 'beforeunload', onPageLeave);

  /**
   * 版本
   */
  var version = "0.0.5";

  exports.ENTER = ENTER;
  exports.HIDE = HIDE;
  exports.LEAVE = LEAVE;
  exports.SHOW = SHOW;
  exports.addEventListener = addEventListener;
  exports.init = init;
  exports.version = version;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=web-page.js.map
