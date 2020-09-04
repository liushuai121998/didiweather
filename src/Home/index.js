import router from '@system.router'
import network from '@system.network'
import device from '@system.device'
import geolocation from '@system.geolocation'
import fetch from '@system.fetch'
import ad from '@service.ad'
import prompt from '@system.prompt'
import push from '@service.push'
import moment from 'moment'
import 'moment/locale/zh-cn'
import ucConfig from '../uc-config.json'

const WEATHER_IMAGES = {
  "晴": "/Common/images/qing.png",
  "云": "/Common/images/duoyun.png",
  "多云": "/Common/images/duoyun.png",
  "阴": "/Common/images/yin.png",
  "雨": "/Common/images/yu.png",
  "大雨": "/Common/images/yu.png",
  "中雨": "/Common/images/yu.png",
  "小雨": "/Common/images/yu.png",
  "雷": "/Common/images/lei.png",
  "雷阵雨": "/Common/images/lei.png",
  "雷电": "/Common/images/lei.png",
  "雪": "/Common/images/xue.png",
  "大雪": "/Common/images/xue.png",
  "中雪": "/Common/images/xue.png",
  "小雪": "/Common/images/xue.png",
  "雾": "/Common/images/wu.png",
  "大雾": "/Common/images/wu.png",
  "中雾": "/Common/images/wu.png",
  "小雾": "/Common/images/wu.png",
  "冰雹": "/Common/images/bingbao.png",
  "大冰雹": "/Common/images/bingbao.png",
  "中冰雹": "/Common/images/bingbao.png",
  "小冰雹": "/Common/images/bingbao.png",
  "沙尘": "/Common/images/shachen.png"
}

const BG_IMAGE = {
  "晴": "https://zhuanduobao.oss-cn-beijing.aliyuncs.com/gaokao/banner-fair-weather.png",
  "沙尘": "https://zhuanduobao.oss-cn-beijing.aliyuncs.com/gaokao/banner-sand-dust.png",
  "阴": "https://zhuanduobao.oss-cn-beijing.aliyuncs.com/gaokao/banner-cloudy.png",
  "阴天": "https://zhuanduobao.oss-cn-beijing.aliyuncs.com/gaokao/banner-cloudy.png",
  "云": "https://zhuanduobao.oss-cn-beijing.aliyuncs.com/gaokao/banner-cloud.png",
  "多云": "https://zhuanduobao.oss-cn-beijing.aliyuncs.com/gaokao/banner-cloud.png",
  "雷": "https://zhuanduobao.oss-cn-beijing.aliyuncs.com/gaokao/banner-thunder.png",
  "雷电": "https://zhuanduobao.oss-cn-beijing.aliyuncs.com/gaokao/banner-thunder.png",
  "雷阵雨": "https://zhuanduobao.oss-cn-beijing.aliyuncs.com/gaokao/banner-thunder.png",
  "雨": "https://zhuanduobao.oss-cn-beijing.aliyuncs.com/gaokao/banner-rain.png",
  "大雨": "https://zhuanduobao.oss-cn-beijing.aliyuncs.com/gaokao/banner-rain.png",
  "中雨": "https://zhuanduobao.oss-cn-beijing.aliyuncs.com/gaokao/banner-rain.png",
  "小雨": "https://zhuanduobao.oss-cn-beijing.aliyuncs.com/gaokao/banner-rain.png",
  "冰雹": "https://zhuanduobao.oss-cn-beijing.aliyuncs.com/gaokao/banner-hail.png",
  "大冰雹": "https://zhuanduobao.oss-cn-beijing.aliyuncs.com/gaokao/banner-hail.png",
  "中冰雹": "https://zhuanduobao.oss-cn-beijing.aliyuncs.com/gaokao/banner-hail.png",
  "小冰雹": "https://zhuanduobao.oss-cn-beijing.aliyuncs.com/gaokao/banner-hail.png",
  "雾": "https://zhuanduobao.oss-cn-beijing.aliyuncs.com/gaokao/banner-fog.png",
  "中雾": "https://zhuanduobao.oss-cn-beijing.aliyuncs.com/gaokao/banner-fog.png",
  "大雾": "https://zhuanduobao.oss-cn-beijing.aliyuncs.com/gaokao/banner-fog.png",
  "小雾": "https://zhuanduobao.oss-cn-beijing.aliyuncs.com/gaokao/banner-fog.png",
  "雪": "https://zhuanduobao.oss-cn-beijing.aliyuncs.com/gaokao/banner-snow.png",
  "大雪": "https://zhuanduobao.oss-cn-beijing.aliyuncs.com/gaokao/banner-snow.png",
  "中雪": "https://zhuanduobao.oss-cn-beijing.aliyuncs.com/gaokao/banner-snow.png",
  "小雪": "https://zhuanduobao.oss-cn-beijing.aliyuncs.com/gaokao/banner-snow.png",
}

const DATE_WEEK = {
  0: '周天',
  1: '周一',
  2: '周二',
  3: '周三',
  4: '周四',
  5: '周五',
  6: '周六'
}
export default Custom_page({
  data: {
    ak: 'ld9bGd2Gh10pwhCwHIly9QCpRh7nNj9V',
    city: '',
    cityId: '110100',
    weather: {},
    now: {},
    forecasts: [],
    nowDate: '',
    weatherImages: WEATHER_IMAGES,
    hours: [],
    bgImage: 'https://zhuanduobao.oss-cn-beijing.aliyuncs.com/gaokao/qing.png',
    air_tips: '',
    tabbarData: [
      {
          iconPath: '/Common/images/home-icon.png',
          selectedIconPath: '/Common/images/home-icon-active.png',
          pagePath: '/Home',
          text: '天气',
          active: true,
          imageStyle: {
            width: '20px',
            height: '20px'
          }
      },
      // {
      //     iconPath: '/Common/images/fuli-icon.png',
      //     selectedIconPath: '/Common/images/fuli-icon-active.png',
      //     pagePath: '/Welfare',
      //     text: '领福利',
      //     active: false,
      //     imageStyle: {
      //       width: '20px',
      //       height: '20px'
      //     }
      // },
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
    forecastList: new Array(15).fill({}),
    alert: {},
    tempObj: {},
    xAxisData: [],
    showChart: false,
    bgImages: BG_IMAGE,
    footerAd: {},
    footerAdShow: false,
    xxweihao: [],
    cityCode: '',
    values: [],
    network: '',
    topNews: []
  },
  onInit() {
      this.getGeolocation()
      this.getData()
      this.nowDate = moment().format('M月DD日 dddd')
      // 插屏
      this.queryAdSwitch(23, (key) => {
        this.insertAd(key)
      })
      // 原生
      this.queryAdSwitch(24, (key) => {
        this.queryFooterAd(key)
      })
      // 限行尾号
      this.xianxingWeiHao()

      this.getAccessToken()
      Promise.all([this.getNetwork(), this.getImei(), this.getDeviceInfo(), this.getRegId()]).then((values) => {
        this.values = values
        this.getTopNews()
        this.authDevices({
          quick_app_id: 2, //滴滴天气
          imei: this.values[1].device,
          device_type: `${this.values[2].manufacturer}|${this.values[2].model}`,
          regid: this.values[3].regId
        })
      }, (err) => {
        console.log('出错！', err)
      })
  },
  // 过滤日期  今天 明天 后天 
  filterDate(value) {
    if(!value) {
      return ''
    } else {
      const dateText = moment(value).format('MM/DD')
      const today = moment(new Date()).format('MM/DD')
      const tomorrow = moment(new Date()).add(1,'days').format('MM/DD')
      const nextTwoDay = moment(new Date()).add(2,'days').format('MM/DD')
      let text = ''
      if(today === dateText) {
        text = '今天'
      } else if(tomorrow === dateText) {
        text = '明天'
      } else if(nextTwoDay === dateText) {
        text = '后天'
      } else {
        text = dateText
      }
      return text
    }
  },
  filterWeek(date) {
    if(!date) {
      return ''
    } else {
      const d = moment(date).format('d')
      return DATE_WEEK[d]
    }
  },
  toSelectCity() {
    // router.push({
    //   uri: 'CityManage',
    // })
    router.push({
      uri: 'CityList'
    })
  },
  // 获取当前城市
  getGeolocation(){
    fetch.fetch({
      url: 'http://api.map.baidu.com/location/ip?'+'ak='+this.ak
    }).then(res => {
      var data = JSON.parse(res.data.data)
      if(data.status ==0){
        this.city = data.content.address_detail.city.split('市')[0]
      }
    })
  },
  // 获取数据
  getData() {
    fetch.fetch({
      url: `http://api.map.baidu.com/weather/v1/?district_id=${this.cityId}&data_type=all&ak=${this.ak}`,
      responseType: 'json'
    }).then(res => {
      var data = res.data.data
      console.log(data)
      if(data.status === 0) {
        console.log(data.result)
        this.weather = data.result
        const location = this.weather.location || {}
        this.city = location.city.split('市')[0]
        this.now = this.weather.now || {}
        // 预警
        this.alert = this.weather.alert || {}
        this.bgImage = BG_IMAGE[this.now.text] || 'https://zhuanduobao.oss-cn-beijing.aliyuncs.com/gaokao/qing.png'
        this.forecasts = this.weather.forecasts || []
        // 最低 最高温度
        this.tempObj = {
          high: this.forecasts[0] ? this.forecasts[0].high : '',
          low: this.forecasts[0] ? this.forecasts[0].low : ''
        }
        // this.getTimeWeather()
        this.ykyWeather()
        // 获取城市列表
        this.getCityList()
      }
    })
  },
  // 默认实时天气状况
  getTimeWeather(){
    fetch.fetch({
      url: 'https://www.tianqiapi.com/api/?'+'city='+this.city + '&version='+'v1'+'&appid='+'28296657'+'&appsecret='+'VpcEL7ch',
      responseType: 'json'
    }).then(res => {
      var data = res.data.data
      console.log(data, 'this.hours')
      var arr = data.data ? data.data[0].hours : []
      // arr.forEach(item => {
      //   item.hours = item.hours ? item.hours.split('时')[0] : ''
      // })
      this.hours = arr
    })
  },
  toInformation() {
    router.push({
      uri: 'Information'
    })
  },
  // 获取广告开关
  queryAdSwitch(id, callback) {
    fetch.fetch({
      // 插屏
      url: `https://quick-app-api.9g-tech.cn/api/positions/${id}`,
      responseType: 'json'
    }).then(res => {
      try{
        const {data} = res.data.data
        if(data.ad_switch === 1) {
          callback && callback(data.corporation_key)
        }
      }catch(err) {
        console.log(err)
      }
    })
  },
  //   插屏广告
  insertAd(id) {
    console.log(id)
    if(ad.createInterstitialAd) {
      this.interstitialAd = ad.createInterstitialAd({
          adUnitId: id
      })
      this.interstitialAd.onLoad(()=> {
          this.interstitialAd.show();
      })
    }
  },
  // 原生广告
  queryFooterAd(key) {
    if(!ad.createNativeAd) {
      return 
    }
    //   原生广告
    this.nativeAd = ad.createNativeAd({
        adUnitId: key
    })
    this.nativeAd.load()
    this.nativeAd.onLoad((res) => {
      this.footerAd = res.adList[0]
      this.footerAdShow = true
    })
  },
  reportAdClick() {
    this.nativeAd && this.nativeAd.reportAdClick({
        adId: this.footerAd.adId
    })
  },
  reportAdShow() {
    this.nativeAd && this.nativeAd.reportAdShow({
        adId: this.footerAd.adId
    })
  },
  onHide() {
    this.interstitialAd && this.interstitialAd.destroy() 
    this.nativeAd && this.nativeAd.destroy()
  },
  // 易客云天气
  ykyWeather() {
    fetch.fetch({
      url: `http://quick-app-api.9g-tech.cn/api/yky/weather?city=${this.city}`,
      responseType: 'json'
    }).then(res => {
      var data = res.data.data
      var arr = data.data ? data.data[0].hours : []
      this.air_tips = data.data ? data.data[0].air_tips : ''
      this.hours = arr
      this.xAxisData = arr.map(item => {
        return item.day ? item.day.split('日')[1] : ''
      })
      this.showChart = true
    })
  },
  // 限行尾号
  xianxingWeiHao(city) {
    fetch.fetch({
      url: `https://rubbish.quickapp.qunzhu.me/web/index.php?store_id=2&r=yibiqian/weihao/xianxing`,
      responseType: 'json',
      method: 'POST',
      header: {
        "Content-Type": 'application/x-www-form-urlencoded; charset=utf-8'
      },
      data: {
        city: city
      }
    }).then(({data: {data, code}}) => {
      if(code === 200) {
        this.xxweihao = data.result ? data.result.xxweihao : []
      }
    })
  },
  // 获取城市列表信息
  getCityList() {
    fetch.fetch({
      url: 'https://rubbish.quickapp.qunzhu.me/web/index.php?store_id=2&r=yibiqian/weihao/citys',
      responseType: 'json'
    }).then(({data: {data}}) => {
      if(data.code === 0) {
        const cityList = data.data.result || []
        cityList.forEach(item => {
          if(item.cityname === this.city) {
            this.cityCode = item.city
          }
        })
        if(this.cityCode) {
          this.xianxingWeiHao(this.cityCode)
        }
      }
    })
  },
  // 获取资讯access_token
  getAccessToken() {
    fetch.fetch({
      url: `https://quick-app-api.9g-tech.cn/api/uc-iflow/${ucConfig.app.app_id}`,
      responseType: 'json'
    }).then(({data: {data}}) => {
      const accessToken = data.data.access_token
    })
  },
  // 获取今日热点
  getTopNews() {
    let postData = {
      app_id: ucConfig.app.app_id,
      app_secret: ucConfig.app.app_secret,
      app_name: ucConfig.name,
      dn: this.values[1].device,
      fr: 'android',
      ve: '1.0.0.0',
      nt: this.network,
      imei: this.values[1].device,
      oaid: this.values[1].device
    }
    
    fetch.fetch({
      url: `https://quick-app-api.9g-tech.cn/api/top-news/uc-iflow`,
      method: 'POST',
      responseType: 'json',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: postData
    }).then(({data: {data}}) => {
      let topNews = []
      data.data.forEach((item, index) => {
        const i = Math.floor(index / 2)
        if(topNews[i]) {
          topNews[i].push(item)
        } else {
          topNews[i] = [item]
        }
      })
      this.topNews = [...topNews]
    })
  },
  getNetwork() {
    return new Promise((resolve, reject) => {
      network.getType({
        success: (data) => {
          //console.log(data.type)
          if (data.type == '2g' || data.type == '3g' || data.type == '4g' || data.type == '5g') {
            this.network = 1
          } else if (data.type == 'wifi') {
            this.network = 2
          } else {
            this.network = 99
          }
          resolve(data)
        },
        fail: (data) => {
          reject()
        }
      })
    })
  },
  getImei() {
    //console.log('Imei')
    return new Promise((resolve, reject) => {
      device.getId({
        type: ['device', 'mac', 'user'],
        success: (data) => {
          //console.log(data, 'getImei')
          resolve(data)
        },
        fail: (data) => {
          reject()
        }
      })
    })
  },
  getDeviceInfo() {
    //console.log('设备信息')
    return new Promise((resolve, reject) => {
      device.getInfo({
        success: (data) => {
          resolve(data)
        },
        fail: () => {
          reject()
        }
      })
    })
  },
  getRegId() {
    return this.$app.$def._storage.get('regid')
  },
  // 进入快应用获取设备信息
  authDevices(data) {
    fetch.fetch({
      url: 'http://quick-app-api.9g-tech.cn/api/auth/devices',
      responseType: 'json',
      method: 'POST',
      header: {
        "Content-Type": 'application/x-www-form-urlencoded; charset=utf-8'
      },
      data
    }).then(res => {
      console.log(res, 'res....')
    })
  }
})