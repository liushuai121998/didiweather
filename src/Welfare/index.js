import fetch from '@system.fetch'
import device from '@system.device'
import router from '@system.router'
export default Custom_page({
    data: {
        tabbarData: [
            {
                iconPath: '/Common/images/fuli-icon.png',
                selectedIconPath: '/Common/images/fuli-icon-active.png',
                pagePath: '/Home',
                text: '天气',
                active: false,
                imageStyle: {
                    width: '20px',
                    height: '20px'
                }
            },
            {
                iconPath: '/Common/images/fuli-icon.png',
                selectedIconPath: '/Common/images/fuli-icon-active.png',
                pagePath: '/Welfare',
                text: '领福利',
                active: true,
                imageStyle: {
                    width: '20px',
                    height: '20px'
                }
            },
            {
                iconPath: '/Common/images/my-icon.png',
                selectedIconPath: '/Common/images/my-icon-active.png',
                pagePath: '/My',
                text: '我的',
                active: false,
                imageStyle: {
                    width: '14px',
                    height: '20px'
                }
            }
        ],
        isFlsShow: false,
        flsSrc: '',
        imei: ''
    },
    onInit() {
        if (!this.imei) {
            this.getImei().then(data => {
              this.imei = data.device
              this.getFlsSrc()
            })
        }
    },
    onShow() {
        this.getAdSwitch()
    },
    onBackPress() {
      this.$element('web').canBack({
        callback: function (e) {
          if (e) {
            this.$element('web').back()
          } else {
            router.replace({
              url: 'Home'
            })
          }
        }.bind(this)
      })
      // 阻止默认行为，等待异步操作
      return true
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
    getAdSwitch() {
      fetch.fetch({
        // 查询广告开关
        url: 'https://quick-app-api.9g-tech.cn/api/positions/26', 
        responseType: 'json',
        success: ({ data: { data }, code }) => {
          if (data.ad_switch === 1) {
            this.isFlsShow = true
          }
        }
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
})