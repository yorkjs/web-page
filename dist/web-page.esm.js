/**
 * web-page.js v0.0.2
 * (c) 2021-2022 musicode
 * Released under the MIT License.
 */

const LOAD = 'load';
const SHOW = 'show';
const HIDE = 'hide';
const ENTER = 'enter';
const LEAVE = 'leave';
const UNLOAD = 'unload';

let visible;
let persisted;
const listeners = {};
function addDOMEventListener(element, type, listener) {
    if (element.addEventListener) {
        if (`on${type}` in element) {
            element.addEventListener(type, listener, true);
        }
    }
    // @ts-ignore
    else if (element.attachEvent) {
        // @ts-ignore
        element.attachEvent(`on` + type, listener);
    }
}
function fireEvent(type, event) {
    const list = listeners[type];
    if (list) {
        for (let i = 0, len = list.length; i < len; i++) {
            if (list[i]) {
                list[i]({
                    event,
                    visible,
                    persisted,
                });
            }
        }
    }
}
function updateVisible() {
    const visibilityState = document.visibilityState;
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
function onPageShow(event) {
    // @ts-ignore
    // 页面是否从浏览器缓存读取
    persisted = event.persisted;
    fireEvent(ENTER, event);
}
function onPageHide(event) {
    fireEvent(LEAVE, event);
}
function onUnload(event) {
    fireEvent(UNLOAD, event);
}
function init() {
    updateVisible();
    addDOMEventListener(document, 'visibilitychange', onVisibilityChange);
    addDOMEventListener(window, 'pageshow', onPageShow);
    addDOMEventListener(window, 'pagehide', onPageHide);
    addDOMEventListener(window, 'beforeunload', onUnload);
}
function addEventListener(type, listener) {
    const list = listeners[type] || (listeners[type] = []);
    list.push(listener);
    if (type === LOAD) {
        fireEvent(LOAD);
    }
    return {
        remove() {
            for (let i = 0, len = list.length; i < len; i++) {
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
const version = "0.0.2";

export { ENTER, HIDE, LEAVE, LOAD, SHOW, UNLOAD, addEventListener, init, version };
//# sourceMappingURL=web-page.esm.js.map
