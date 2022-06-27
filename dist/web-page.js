/**
 * web-page.js v0.0.7
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

  var isPageAlive = false;
  var isPageFrozen = false;
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
      if (isPageAlive && !isPageFrozen) {
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
      fireEvent(ENTER, event);
  }, 200);
  var onPageLeave = debounceListener(function (event) {
      if (!isPageAlive) {
          return;
      }
      fireEvent(LEAVE, event);
      isPageAlive = false;
  }, 200);
  function onPageShow(event) {
      // @ts-ignore
      persisted = event.persisted;
      // @ts-ignore
      onPageEnter(event);
  }
  function onPageHide(event) {
      // @ts-ignore
      persisted = event.persisted;
      // @ts-ignore
      onPageLeave(event);
  }
  function onPageFreeze() {
      isPageFrozen = true;
  }
  function onPageResume() {
      isPageFrozen = false;
  }
  function init() {
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
  updateVisible();
  if (supportEvent(document, 'visibilitychange')) {
      addDOMEventListener(document, 'visibilitychange', onVisibilityChange);
  }
  if (supportEvent(window, 'pageshow')) {
      addDOMEventListener(window, 'pageshow', onPageShow);
  }
  else {
      addDOMEventListener(window, 'load', onPageEnter);
  }
  if (supportEvent(window, 'pagehide')) {
      addDOMEventListener(window, 'pagehide', onPageHide);
  }
  addDOMEventListener(window, 'beforeunload', onPageLeave);
  if (supportEvent(window, 'freeze')) {
      addDOMEventListener(window, 'freeze', onPageFreeze);
  }
  if (supportEvent(window, 'resume')) {
      addDOMEventListener(window, 'resume', onPageResume);
  }

  /**
   * 版本
   */
  var version = "0.0.7";

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
