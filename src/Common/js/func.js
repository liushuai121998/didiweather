/**
 * 1.格式化日期函数
 */
// 引入格式化插件
// import dateFormate from 'format-datetime';
import router from '@system.router';
import webview from '@system.webview'
import prompt from '@system.prompt'
import network from '@system.network'
import storage from '@system.storage';
import device from '@system.device'
function _router(a) {
  // 目前只封装路由跳转的push
  router.push({
    uri: a.uri,
    params: a.params || {}
  })
}
// 封装webview
function _webview(a) {
  webview.loadUrl({
    url: a.url
  })
}
// 弹框的封装
function _prompt(a) {
  prompt.showToast({
    message: a.message,
    duration: a.duration
  })
}
// function getFormateDate(res) {
//   var Date_res = dateFormate(res.date, res.formate);
//   return Date_res;
// }
function getWeek(date) {
  var weekArray = new Array("周日", "周一", "周二", "周三", "周四", "周五", "周六");
  var week = weekArray[new Date(date).getDay()];
  return week;
}
// 查询网络状态
function netWordStatus() {
  network.subscribe({
    callback: function (data) {
      return data;
    }
  })
}

// 存储
let storageHandle = {
  get(key) {
    return new Promise((resolve, reject) => {
      storage.get({
        key: key,
        success(data) {
          resolve(data)
          //console.info("storage.get key =", key, " data =", data)
        },
        fail(err) {
          reject(err)
        }
      })
    })
  },
  set(key, value) {
    if (typeof value === 'object') {
      value = JSON.stringify(value)
    }
    return new Promise((resolve, reject) => {
      storage.set({
        key,
        value,
        success(data) {
          resolve(data)
        },
        fail(err) {
          reject(err)
        }
      })
    })
  },
  clear() {
    // 清空
    storage.clear()
  },
  delete(key) {
    // 删除
    return new Promise((resolve, reject) => {
      storage.delete({
        key,
        success() {
          resolve()
        },
        fail() {
          reject()
        }
      })
    })
  }
}
function _DeviceId() {
  var p = new Promise(function (resolve, reject) {
    device.getDeviceId({
      success: function (data) {
        //console.log(`_DeviceId success deviceId: ${data.deviceId}`)
        resolve(data.deviceId)
      },
      fail: function (data, code) {
        device.getUserId({
          success: function (data) {
            //console.log(`_DeviceId success userId: ${data.userId}`)
            resolve(data.userId)
          },
          fail: function (data, code) {
            //console.log(`_DeviceId fail, code = ${code}`)
            reject(code)
          }
        })
      }
    })
  });
  return p;
}

function _checkEmpty(...args) {
  let ret
  if (args.length > 0) {
    ret = args.shift()
    let tmp
    while (ret && args.length > 0) {
      tmp = args.shift()
      ret = ret[tmp]
    }
  }
  return (ret == undefined || ret == null) ? false : ret
}

function _tabChange(arg) {
  var uri = ''
  var params = undefined;
  switch (arg.index) {
    case 0:
      uri = 'Home'
      break;
    case 1:
      uri = 'Information'
      break;
    default:
      uri = 'Home'
      break;
  }
  router.replace({
    uri: uri,
    params: params
  })
}

function getDeviceInfo() {
  var promise = new Promise(function (resolve, reject) {
    device.getInfo({
      success: function (ret) {
        //console.log(`handling success， brand = ${ret.brand}`)
        // //console.log(ret)
        resolve(ret)
      }
    })
  })
  return promise
}
export default {
  _router,
  _prompt,
  _webview,
  // getFormateDate,
  getWeek,
  netWordStatus,
  _storage: storageHandle,
  _DeviceId,
  _checkEmpty,
  _tabChange,
  getDeviceInfo
}