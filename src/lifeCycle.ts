import {
  LOAD,
  SHOW,
  HIDE,
  UNLOAD,
} from './constant'

let visible: boolean | undefined

const listeners: Record<string, Function[]> = { }

function addDOMEventListener(element: HTMLElement | Window | Document, type: string, listener: EventListener) {
  if (element.addEventListener) {
    if (`on${type}` in element) {
      element.addEventListener(type, listener, true)
    }
  }
  // @ts-ignore
  else if (element.attachEvent) {
    // @ts-ignore
    element.attachEvent(`on` + type, listener)
  }
}

function fireEvent(type: string, event?: Event) {
  const list = listeners[type]
  if (list) {
    for (let i = 0, len = list.length; i < len; i++) {
      if (list[i]) {
        list[i]({
          event,
          visible,
        })
      }
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

function onUnload(event: Event) {
  fireEvent(UNLOAD, event)
}

export function init() {

  updateVisible()

  addDOMEventListener(document, 'visibilitychange', onVisibilityChange)
  addDOMEventListener(window, 'beforeunload', onUnload)

}

export function addEventListener(type: string, listener: Function) {

  const list = listeners[type] || (listeners[type] = [])
  list.push(listener)

  if (type === LOAD) {
    fireEvent(LOAD)
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