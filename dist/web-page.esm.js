/**
 * web-page.js v0.0.7
 * (c) 2021-2022 musicode
 * Released under the MIT License.
 */

const SHOW = 'show';
const HIDE = 'hide';
const ENTER = 'enter';
const LEAVE = 'leave';

let isPageAlive = false;
let isPageFrozen = false;
let visible;
let persisted;
const events = {};
const listeners = {};
function supportEvent(element, type) {
    return `on${type}` in element;
}
function addDOMEventListener(element, type, listener) {
    if (element.addEventListener) {
        element.addEventListener(type, listener, true);
    }
    // @ts-ignore
    else if (element.attachEvent) {
        // @ts-ignore
        element.attachEvent(`on` + type, listener);
    }
}
function debounceListener(listener, delay) {
    let timer;
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
    const data = {
        event,
        visible,
        persisted,
    };
    events[type] = data;
    if (isPageAlive && !isPageFrozen) {
        fireEventData(type, data);
    }
}
function fireEventData(type, data) {
    const list = listeners[type];
    if (!list) {
        return;
    }
    for (let i = 0, len = list.length; i < len; i++) {
        if (list[i]) {
            list[i](data);
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
const onPageEnter = debounceListener(function (event) {
    if (isPageAlive) {
        return;
    }
    isPageAlive = true;
    fireEvent(ENTER, event);
}, 200);
const onPageLeave = debounceListener(function (event) {
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
    const list = listeners[type] || (listeners[type] = []);
    list.push(listener);
    if (type === ENTER && events[type]) {
        fireEventData(type, events[type]);
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
const version = "0.0.7";

export { ENTER, HIDE, LEAVE, SHOW, addEventListener, init, version };
//# sourceMappingURL=web-page.esm.js.map
