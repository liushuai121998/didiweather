import fetch from '@system.fetch'
import CryptoJS from 'crypto-js'
import network from '@system.network'
import prompt from '@system.prompt'

// 密钥key
const SECRETKEY = '0Weg0+t7Go'
const TIME_OUT = 5000
// 错误码
const errCode = {
    TimeOut: 52000,
    NetworkErr: 52001
}
//错误提示
const errMsg = {
    TimeOut: '网络连接超时',
    NetworkErr: '网络异常，请检查您的网络'
}
//接口地址 base
//测试
const baseUrl = ''
let ucUrl = "https://open.uczzd.cn/openiflow/"

const http = {
    get: function (url, params, options = {}) {
        return request({ url: baseUrl + url, data: params, method: 'GET', ...options })
    },
    get_des: function (url, params, options = {}) {
        return request_des({ url: baseUrl + url, data: params, method: 'GET', ...options })
    },
    get_uc_track: function (url, params, options = {}) {
        console.log(url, 'get_uc_track')
        return request({ url, data: params, method: 'GET', ...options })
    },
    get_uc: function (url, data, options = {}) {
        return request({
            url: ucUrl + url,
            data: data,
            method: 'GET',
            header: {
                "Content-Type": "text/plain;chartset=UTF-8"
            },
            ...options
        })
    },
    get_Advert: function (url, params, options = {}) {
        return request({ url: url, data: params, method: 'GET', ...options })
    },
    post_des_track: function (url, data, options = {}) {
        // //console.info('post_des url = ',url)
        // //console.info('data = ',data)
        return request_des({
            url: baseUrlTrack + url,
            data,
            method: 'POST',
            header: {
                "Content-Type": "text/plain;chartset=UTF-8"
            },
            ...options
        })
    },
    post: function (url, data, options = {}) {
        return request({ url: baseUrl + url, data, method: 'POST', ...options })
    },
    post_uc: function (url, data, options = {}) {
        return request({
            url: ucUrl + url,
            data,
            method: 'POST',
            ...options
        })
    },
    post_des: function (url, data, options = {}) {
        //console.info('post_des url = ', url)
        //console.info('data = ', data)
        return request_des({
            url: baseUrl + url,
            data,
            method: 'POST',
            header: {
                "Content-Type": "text/plain;chartset=UTF-8"
            },
            ...options
        })
    },
    post_des_push: function (url, data, options = {}) {
        //console.info("post_des_push", JSON.stringify(data))
        return request_des({
            url: basePushUrl + url,
            data,
            method: 'POST',
            header: {
                "Content-Type": "text/plain;chartset=UTF-8"
            },
            ...options
        })
    },
    put_des_push: function (url, data, options = {}) {
        return request_des({
            url: basePushUrl + url,
            data,
            method: 'put',
            header: {
                "Content-Type": "text/plain;chartset=UTF-8"
            },
            ...options
        })
    },
    detele_des_push: function (url, data, options = {}) {
        return request_des({
            url: basePushUrl + url,
            data,
            method: 'DELETE',
            header: {
                "Content-Type": "text/plain;chartset=UTF-8"
            },
            ...options
        })
    },
    // 广告
    post_Advert: function (url, data, options = {}) {
        return request({
            url: adUrl + url,
            data,
            method: 'POST',
            header: {
                'Content-Type': 'application/json'
            },
            ...options
        })
    },
    request: request
}

function request(options) {
    const { url, data, header = {}, method = 'GET', responseType = 'json', timeOut = TIME_OUT } = options
    // if (url.indexOf('http://test.quickapp-service.teddymobile.cn/') != -1) {
    //     prompt.showToast({
    //         message: '测试环境',
    //         duration: 0
    //     })
    // }
    let abort = null
    const abortPromise = new Promise((resolve, reject) => { abort = reject })
    const timeOutPromise = setTimeoutPromise(timeOut)
    const networkPromise = setNetworkPromise()

    const requestPromise = new Promise((resolve, reject) => {
        if (!url) {
            reject(new Error('地址不存在。'))
            return
        }
        //console.info('before fetch.fetch data =', JSON.stringify(options))
        fetch.fetch({
            url,
            data,
            header,
            method,
            responseType,
            success(response) {
                //console.info('after fetch response =', url)
                //console.info('after fetch response =', JSON.stringify(response))
                resolve(response)
            },
            fail(error, code) {
                reject(error, code)
            }
        })
    })
    const promise = Promise.race([requestPromise, abortPromise, timeOutPromise, networkPromise])
    promise.abort = abort
    return promise
}

// 加密 解密请求
function request_des(options = {}) {
    const {
        url,
        data,
        header = {},
        method = 'GET',
        responseType = 'json',
        timeOut = TIME_OUT
    } = options
    // if (url.indexOf('http://test.quickapp-service.teddymobile.cn/') != -1) {
    //     prompt.showToast({
    //         message: '测试环境',
    //         duration: 0
    //     })
    // }
    let abort = null
    const abortPromise = new Promise((resolve, reject) => {
        abort = reject
    })

    const timeOutPromise = setTimeoutPromise(timeOut)
    const networkPromise = setNetworkPromise()

    const requestPromise = new Promise((resolve, reject) => {
        if (!url) {
            reject(new Error('地址不存在。'))
            return
        }
        //console.info('before fetch.fetch data =', JSON.stringify(options))
        try {
            fetch.fetch({
                url,
                data: encrypt(JSON.stringify(data)),
                header,
                method,
                responseType,
                success(response) {
                    //console.info('after fetch response =', response.code)
                    //console.info('after fetch response =', JSON.stringify(response))
                    if (response.code == 200) {
                        if (response.data && typeof response.data.content == 'string') {
                            if (response.data.content && response.data.content.indexOf('{') > -1) {
                                response.data.content = JSON.parse(response.data.content || '{}')
                            } else {
                                try {
                                    response.data.content = JSON.parse(decrypt(response.data.content.replace(/^\"|\"$/g, "")))
                                } catch{
                                    response.data.content = decrypt(response.data.content.replace(/^\"|\"$/g, ""))
                                }
                                try {
                                    //console.info('after fetch response =', JSON.stringify(response.data.content))
                                } catch{
                                    //console.info('after fetch response =', response.data.content)
                                }
                            }
                        }
                        resolve(response)
                    } else {
                        reject(response)
                        //console.info('-----complete--  catch--')
                    }
                },
                fail(error, code) {
                    reject(error, code)
                    //console.info('-----fail----')
                    //console.info('error', error)
                    //console.info('code', code)
                },
                complete: function () {
                    //console.info('-----complete----')
                }
            })
        } catch (e) {
            console.error(e)
        }
    })
    const promise = Promise.race([requestPromise, abortPromise, timeOutPromise, networkPromise])
    promise.abort = abort
    return promise
}

// 加密 解密
function decrypt(encryptedStr) {
    //console.info('decrypt encryptedStr = ', encryptedStr)
    function getStrFromBytes(arr) {
        var r = ""
        for (var i = 0; i < arr.length; i++) {
            r += String.fromCharCode(arr[i]);
        }
        //console.log(r);
        return r
    }

    var keyHex = CryptoJS.enc.Utf8.parse(SECRETKEY); // 将秘钥转换为utf8格式
    var ivHex = CryptoJS.enc.Utf8.parse(getStrFromBytes([0x12, 0x34, 0x56, 0x78, 0x90, 0xAB, 0xCD, 0xEF])); // 将向量装换位字符串再转为utf8
    var decrypted = CryptoJS.DES.decrypt({
        ciphertext: CryptoJS.enc.Base64.parse(encryptedStr) // 因为Java加密时进行了Base64编码,所以此处解码
    }, keyHex, {
        iv: ivHex,
        mode: CryptoJS.mode.ECB, // 模式有很多种,由Java代码知道使用的是ecb
        padding: CryptoJS.pad.Pkcs7 // 填充模式有很多种,但是Java用的Pkcs5,此处Pkcs7也是可以解密的
    })
    return decrypted.toString(CryptoJS.enc.Utf8)
}

function encrypt(message) {
    // //console.info('encrypt message = ',message )
    var keyHex = CryptoJS.enc.Utf8.parse(SECRETKEY);
    var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
}

function setTimeoutPromise(tm) {
    //console.log('setTimeoutPromise', tm)
    const timeOutPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
            reject({ code: errCode.TimeOut, msg: errMsg.TimeOut })
        }, tm)
    })
    return timeOutPromise
}

function setNetworkPromise() {
    //console.log('setNetworkPromise')
    const networkPromise = new Promise((resolve, reject) => {
        network.subscribe({
            callback: function (data) {
                if (data.type === 'none') {
                    reject({ code: errCode.NetworkErr, msg: errMsg.NetworkErr })
                }
            }
        })
    })

    return networkPromise
}
export default http