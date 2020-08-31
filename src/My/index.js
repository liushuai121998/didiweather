import fetch from '@system.fetch'
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
        avatarSrc: '',
        access_token: '',
        isLogin: false,
        userName: ''
    },
    onShow() {
        this.getUserInfo()
    },
    login() {
        if (!this.isLogin) {
          router.push({
            uri: 'Login'
          })
        }
    },
    logout() {
        this.isLogoutShow = true
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
})