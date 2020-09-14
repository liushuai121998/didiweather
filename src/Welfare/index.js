import router from '@system.router'
import prompt from '@system.prompt'
import fetch from '@system.fetch'
import device from '@system.device'
export default {
  data: {
    flsSrc: '',
    title: '懒人福利',
    loading: true,
    imei: ''
  },
  onShow() {
    if (!this.imei) {
      this.getImei().then(data => {
        this.imei = data.device
        this.getFlsSrc()
      })
    } else {
      this.getFlsSrc()
    }
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
  getFlsSrc() {
    fetch.fetch({
      url: `http://quick-app-api.9g-tech.cn/api/lr/welfare/${this.imei}`,
      responseType: 'json',
      success: ({ data }) => {
        this.flsSrc = data.data
      }
    })
  },
  pagedone() {
    this.loading = false
  },
  handleErr(err) {
    console.log(err)
  },
  handleBack() {
    router.clear()
    router.replace({
      uri: 'Home',
      params: {
        ___PARAM_LAUNCH_FLAG___: 'clearTask'
      }
    })
  },
  onBackPress() {
    this.$element('web').canBack({
      callback: function (e) {
        if (e) {
          // 加载历史列表中的上一个 URL
          this.$element('web').back()
        } else {
          router.clear()
          router.replace({
            uri: 'Home',
            params: {
              ___PARAM_LAUNCH_FLAG___: 'clearTask'
            }
          })
        }
      }.bind(this)
    })
    // 阻止默认行为，等待异步操作
    return true
  }
}