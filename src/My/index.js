import prompt from '@system.prompt'
import device from '@system.device'
import router from '@system.router'
import clipboard from '@system.clipboard'
import fetch from '@system.fetch'

export default {
  data() {
    return {
      userName: '',
      avatarSrc: '',
      isFlsShow: false,
      isLogin: false,
      access_token: '',
      imei: '',
      isLogoutShow: false,
      banners: [],
      bannerShow: false,
      tabbarData: [
        {
            iconPath: '/Common/images/home-icon.png',
            selectedIconPath: '/Common/images/home-icon-active.png',
            pagePath: '/Home',
            text: '天气',
            active: false,
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
            active: true,
            imageStyle: {
              width: '14px',
              height: '20px'
            }
        }
      ],
    }

  },
  onInit() {
    this.initSwiperBanner()
  },
  show() {
    console.log('ffff')
    this.getUserInfo()
    this.getFlsShow()
  },
  handleGameBannerClick(link_url) {
    if (link_url) {
      router.push({ uri: link_url })
    }
  },
  initSwiperBanner() {

    fetch.fetch({
      // 查询广告开关
      url: 'https://quick-app-api.9g-tech.cn/api/positions/32-33',
      responseType: 'json',
      success: ({ data: { data, status_code } }) => {
        if (status_code === 200) {
          this.bannerShow = data.some(i => i.ad_switch === 1)
          this.banners = data
        }
      }
    })
  },
  handleNavClick(type) {
    switch (type) {
      case 1:
        router.push({
          uri: '/Welfare'
        })
        break
      case 2:
        prompt.showToast({ message: '敬请期待...' })
        break
      case 3:
        router.push({
          uri: '/EarlyWarning',
          params: {
            type: 3
          }
        })
        break
      case 4: //客服电话
        this.actionSheet('iOS', '400-9633-321')
        break
      case 5: //隐私协议
        router.push({
          uri: 'http://quick-app-api.9g-tech.cn/api/grantie/protocol'
        })
        break

    }
  },
  logout() {
    this.isLogoutShow = true
  },
  logoutAffrim() {
    this.isLogin = false
    this.isLogoutShow = false
    this.access_token = ''
    this.$app.$def._storage.delete('login-access-token')
  },
  getFlsShow() {
    // 查询懒人科技开关
    fetch.fetch({
      url: 'https://quick-app-api.9g-tech.cn/api/positions/26', //退出广告位开关
      responseType: 'json',
      success: ({ data: { data }, code }) => {
        console.log(data)
        if (data && data.ad_switch === 1) {
          this.isFlsShow = true
        }
      }
    })
  },
  getUserInfo() {
    this.getAccessToken().then(() => {
      if (this.access_token) {
        fetch.fetch({
          // 查询广告开关
          url: 'http://quick-app-api.9g-tech.cn/api/auth/me',
          responseType: 'json',
          method: 'POST',
          data: {
            token: this.access_token
          },
          success: ({ data: { data, status_code } }) => {
            if (status_code == 200) {
              this.isLogin = true
              this.userName = data.phone
              this.avatarSrc = data.avatar_img
            }
          }
        })
      } else {
        this.isLogin = false
      }
    })
  },
  actionSheet(theme, tel) {
    if (this.timerActionSheet) clearTimeout(this.timerActionSheet)
    this.$child('actionSheet').showSheet({
      theme,
      titleText: '5秒后自动关闭',
      buttons: [{
        text: `拨打 ${tel}`,
      }, {
        text: `拷贝 ${tel}`,
      }],
      buttonClicked: (index, item) => {
        if (index == 0) {
          router.push({
            uri: `tel:${tel}`
          })
        } else if (index == 1) {
          clipboard.set({
            text: tel,
            success() {
              prompt.showToast({ message: '号码已复制到剪切板' })
            },
            fail() {
              prompt.showToast({ message: '复制失败, 请检查是否授权' })
            }
          })
        }
        return true
      },
      cancelText: '取消',
      cancel: () => {
        console.log('取消按钮或蒙层点击事件')
      }
    })

    this.timerActionSheet = setTimeout(() => {
      this.$child('actionSheet').hideSheet()
    }, 5000)
  },
  login() {
    if (!this.isLogin) {
      router.push({
        uri: 'Login'
      })
    }
  },
  logoutClose() {
    this.isLogoutShow = false
  },
  getAccessToken() {
    return this.$app.$def._storage.get('login-access-token').then(data => {
      if (data) {
        this.access_token = data
      } else {
        this.isLogin = false
      }
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

}