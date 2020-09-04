import prompt from '@system.prompt'
import fetch from '@system.fetch'
import device from '@system.device'
import router from '@system.router'

export default {
    data() {
        return {
            loginLoading: false,
            phone: '',
            code: '',
            imei: '',
            sec: 60,
            getCodeClickble: true,
            getCodeText: '获取验证码'
        }
    },
    onShow() {
        this.getImei().then(data => {
            this.imei = data.device
        })
    },
    getImei() {
        return new Promise((resolve, reject) => {
            device.getId({
                type: ['device', 'mac', 'user'],
                success: (data) => {
                    resolve(data)
                },
                fail: (data) => {
                    reject()
                }
            })
        })
    },
    handleGetCode() {
        if (!this.getCodeClickble) {
            return
        }
        if (/^1[3456789]\d{9}$/.test(this.phone)) {
            this.getCode(this.phone).then(({ data: { data } }) => {
                if (data.status_code === 200) {
                    prompt.showToast({ message: '验证码已发送' })
                    this.getCodeClickble = false
                    this.countDown()
                } else {
                    prompt.showToast({ message: data.message })
                }
            })

        } else {
            prompt.showToast({ message: '请输入正确的手机号码' })
        }
    },
    countDown() {
        if (this.sec - 1 <= 0) {
            this.getCodeClickble = true
            this.sec = 60
            this.getCodeText = '获取验证码'
        } else {
            this.sec--
            this.getCodeText = `${this.sec} 秒后重新获取`
            setTimeout(() => {
                this.countDown()
            }, 1000)
        }
    },
    getCode(phone) {
        return fetch.fetch({
            url: 'http://quick-app-api.9g-tech.cn/api/auth/extra/sms',
            method: 'POST',
            responseType: 'json',
            header: {
                "Content-Typ": 'application/json; charset=utf-8'
            },
            // quick_app_id 1 我要充电   2 滴滴天气   3 我要查快递
            data: { phone: this.phone, quick_app_id: 2 }
        })

    },
    handleLoginClick() {
        if (/\d{6}/.test(this.code)) {
            this.loginLoading = true
            this.login().then(({ data: { data } }) => {
                if (data.status_code === 200) {
                    this.$app.$def._storage.set('login-access-token', data.access_token).then(() => {
                        router.back()
                    }).finly(() => {
                        router.back()
                    })
                    // router.replace({
                    //     uri: '/pages/address',
                    //     params: {
                    //         access_token: data.access_token
                    //     }
                    // })
                } else {
                    this.loginLoading = false
                    // prompt.showToast({ message: data.message })
                }
                this.loginLoading = false
            }).catch((err) => {
                // prompt.showToast({ message: err })
            })
        } else {
            prompt.showToast({ message: '请输入正确的验证码' })
            this.loginLoading = false
        }
    },
    login() {
        return fetch.fetch({
            url: 'http://quick-app-api.9g-tech.cn/api/auth/login',
            method: 'POST',
            responseType: 'json',
            header: {
                "Content-Typ": 'application/json; charset=utf-8'
            },
            data: {
                phone: this.phone,
                code: this.code,
                imei: this.imei,
                quick_app_id: 2
            }
        })
    },
    handlePhoneChange({ value }) {
        this.phone = value
        this.code = ''
    },
    handleCodeChange({ value }) {
        this.code = value
    }
}