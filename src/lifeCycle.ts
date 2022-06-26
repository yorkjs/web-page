import {
  SHOW,
  HIDE,
  ENTER,
  LEAVE,
} from './constant'

let isInitCalled = false
let isPageAlive = false

let visible: boolean | undefined
let persisted: boolean | undefined

type EventData = {
  visible: boolean | undefined
  persisted: boolean | undefined
  event: Event | undefined
}

const events: Record<string, EventData> = { }
const listeners: Record<string, Function[]> = { }

function supportEvent(element: HTMLElement | Window | Document, type: string) {
  return `on${type}` in element
}

function addDOMEventListener(element: HTMLElement | Window | Document, type: string, listener: EventListener) {
  if (element.addEventListener) {
    element.addEventListener(type, listener, true)
  }
  // @ts-ignore
  else if (element.attachEvent) {
    // @ts-ignore
    element.attachEvent(`on` + type, listener)
  }
}

function debounceListener(listener: Function, delay: number) {

  let timer: any

  return function () {

    if (!timer) {

      listener(arguments[0])

      timer = setTimeout(
        function () {
          timer = undefined
        },
        delay
      )

    }

  }

}

function fireEvent(type: string, event?: Event) {

  const data: EventData = {
    event,
    visible,
    persisted,
  }

  events[type] = data

  if (isInitCalled && isPageAlive) {
    fireEventData(type, data)
  }

}

function fireEventData(type: string, data: EventData) {

  const list = listeners[type]
  if (!list) {
    return
  }

  for (let i = 0, len = list.length; i < len; i++) {
    if (list[i]) {
      list[i](data)
    }
  }

}

function updateVisible() {
  const visibilityState = document.visibilityState
  if (visibilityState === 'visible') {
    visible = true
  }
  else if (visibilityState === 'hidden') {
    visible = false
  }
  else {
    visible = undefined
  }
}

function onVisibilityChange(event: Event) {
  updateVisible()
  if (visible === true) {
    fireEvent(SHOW, event)
  }
  else if (visible === false) {
    fireEvent(HIDE, event)
  }
}

const onPageEnter = debounceListener(
  function(event: Event) {
    if (isPageAlive) {
      return
    }
    isPageAlive = true
    // @ts-ignore
    persisted = event.persisted === true
    fireEvent(ENTER, event)
  },
  200
)

const onPageLeave = debounceListener(
  function (event: Event) {
    if (!isPageAlive) {
      return
    }
    fireEvent(LEAVE, event)
    isPageAlive = false
  },
  200
)

export function init() {
  isInitCalled = true
  updateVisible()
}

export function addEventListener(type: string, listener: Function) {

  const list = listeners[type] || (listeners[type] = [])
  list.push(listener)

  if (type === ENTER && events[type]) {
    fireEventData(type, events[type])
  }

  return {
    remove() {
      for (let i = 0, len = list.length; i < len; i++) {
        if (list[i] === listener) {
          list.splice(i, 1)
        }
      }
    }
  }
}

if (supportEvent(document, 'visibilitychange')) {
  addDOMEventListener(document, 'visibilitychange', onVisibilityChange)
}

if (supportEvent(window, 'pageshow')) {
  addDOMEventListener(window, 'pageshow', onPageEnter)
}

addDOMEventListener(window, 'load', onPageEnter)

if (supportEvent(window, 'pagehide')) {
  addDOMEventListener(window, 'pagehide', onPageLeave)
}

addDOMEventListener(window, 'beforeunload', onPageLeave)