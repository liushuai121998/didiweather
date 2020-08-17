/**
 * @file pubsub.js 提供发布订阅的能力
 */

/**
 * 提供Publish-Subscribe模型
 */
export default class Pubsub {
  constructor(name) {
    this.name = name
    this.eventMap = {}
  }

  /**
   * 订阅事件
   * @param type {string} 事件名称
   * @param fn {function} 响应函数
   * @param options {object} 暂时保留
   * @return {*}
   */
  subscribe(type, fn, options) {
    if (options && options.once) {
      const fnOnce = args => {
        fn(args)
        this.remove(type, fnOnce)
      }
      return this.subscribe(type, fnOnce)
    }

    this.eventMap[type] = this.eventMap[type] || []

    if (typeof fn === 'function') {
      const list = this.eventMap[type]
      if (list.indexOf(fn) === -1) {
        list.push(fn)
      }
    }
  }

  /**
   * 发布事件
   * @param type {string} 事件名称
   * @param args {array} 事件触发时的参数
   * @return {*}
   */
  publish(type, args) {
    let lastRet = null
    const list = this.eventMap[type] || []
    for (let i = 0, len = list.length; i < len; i++) {
      lastRet = list[i](args, lastRet)
    }
    return lastRet
  }

  /**
   * 删除事件订阅
   * @param type {string} 事件名称
   * @param fn {function} 响应函数
   */
  remove(type, fn) {
    if (!this.eventMap[type]) return
    const list = this.eventMap[type]
    const index = list.indexOf(fn)
    if (index > -1) {
      list.splice(index, 1)
    }
  }
}

// 实例缓存
const modelCache = {}

/**
 * 用于创建或获取一个指定名称的Pubsub模型的实例
 * @param name {string} 通过名称创建不同的实例
 * @return {*}
 */
export function createOrRetrieveInst (name) {
  if (!modelCache[name]) {
    modelCache[name] = new Pubsub(name)
  }

  return modelCache[name]
}