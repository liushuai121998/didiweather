import router from '@system.router'
import geolocation from '@system.geolocation'
import fetch from '@system.fetch'
import moment from 'moment'
import 'moment/locale/zh-cn'
const WEATHER_IMAGES = {
  "晴": "/Common/images/weather1.png",
  "多云": "/Common/images/duoyun.png",
  "阴": "/Common/images/yintian.png",
  "大雨": "/Common/images/dayu.png",
  "中雨": "/Common/images/zhongyu.png",
  "小雨": "/Common/images/xiaoyu.png",
  "雷阵雨": "/Common/images/leizhenyu.png",
  "雷电": "/Common/images/leidian.png",
  "大雪": "/Common/images/daxue.png",
  "中雪": "/Common/images/zhongxue.png",
  "小雪": "/Common/images/xiaoxue.png",
  "大雾": "/Common/images/dawu.png",
  "中雾": "/Common/images/zhongwu.png",
  "小雾": "/Common/images/xiaowu.png",
  "大冰雹": "/Common/images/dabingbao.png",
  "中冰雹": "/Common/images/zhongbingbao.png",
  "小冰雹": "/Common/images/xiaobingbao.png",
  "沙尘": "/Common/images/shachen.png"
}

const BG_IMAGE = {
  "晴": "https://zhuanduobao.oss-cn-beijing.aliyuncs.com/gaokao/qing.png",
  "沙尘": "https://zhuanduobao.oss-cn-beijing.aliyuncs.com/gaokao/shachen.png",
  "阴": "https://zhuanduobao.oss-cn-beijing.aliyuncs.com/gaokao/yin.png",
  "多云": "https://zhuanduobao.oss-cn-beijing.aliyuncs.com/gaokao/duoyun.png",
  "雷电": "https://zhuanduobao.oss-cn-beijing.aliyuncs.com/gaokao/leidian.png",
  "雷阵雨": "https://zhuanduobao.oss-cn-beijing.aliyuncs.com/gaokao/leidian.png",
  "雨": "https://zhuanduobao.oss-cn-beijing.aliyuncs.com/gaokao/yu.png",
  "大雨": "https://zhuanduobao.oss-cn-beijing.aliyuncs.com/gaokao/yu.png",
  "中雨": "https://zhuanduobao.oss-cn-beijing.aliyuncs.com/gaokao/yu.png",
  "小雨": "https://zhuanduobao.oss-cn-beijing.aliyuncs.com/gaokao/yu.png",
  "冰雹": "https://zhuanduobao.oss-cn-beijing.aliyuncs.com/gaokao/bingbao.png",
  "雾": "https://zhuanduobao.oss-cn-beijing.aliyuncs.com/gaokao/wu.png",
  "中雾": "https://zhuanduobao.oss-cn-beijing.aliyuncs.com/gaokao/wu.png",
  "大雾": "https://zhuanduobao.oss-cn-beijing.aliyuncs.com/gaokao/wu.png",
  "小雾": "https://zhuanduobao.oss-cn-beijing.aliyuncs.com/gaokao/wu.png",
  "雪": "https://zhuanduobao.oss-cn-beijing.aliyuncs.com/gaokao/xue.png",
  "大雪": "https://zhuanduobao.oss-cn-beijing.aliyuncs.com/gaokao/xue.png",
  "中雪": "https://zhuanduobao.oss-cn-beijing.aliyuncs.com/gaokao/xue.png",
  "小雪": "https://zhuanduobao.oss-cn-beijing.aliyuncs.com/gaokao/xue.png",
}
export default {
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
    bgImage: 'https://zhuanduobao.oss-cn-beijing.aliyuncs.com/gaokao/qing.png'
  },
  onInit() {
      this.getGeolocation()
      this.getData()
      this.nowDate = moment().format('M月DD日 dddd')
  },
  // 过滤日期
  filterDate(value) {
    if(!value) {
      return ''
    } else {
      return moment(value).format('M月DD月')
    }
  },
  toSelectCity() {
    router.push({
      uri: 'CityList',
    })
    // router.push({
    //   uri: 'Information'
    // })
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
      url: `http://api.map.baidu.com/weather/v1/?district_id=${this.cityId}&data_type=all&ak=${this.ak}`
    }).then(res => {
      var data = JSON.parse(res.data.data)
      console.log(data)
      if(data.status === 0) {
        this.weather = data.result
        const location = this.weather.location || {}
        this.city = location.city.split('市')[0]
        this.now = this.weather.now || {}
        this.bgImage = BG_IMAGE[this.now.text] || 'https://zhuanduobao.oss-cn-beijing.aliyuncs.com/gaokao/qing.png'
        this.forecasts = this.weather.forecasts || []
        this.getTimeWeather()
      }
    })
  },
  // 默认实时天气状况
  getTimeWeather(){
    fetch.fetch({
      url: 'https://www.tianqiapi.com/api/?'+'city='+this.city + '&version='+'v1'+'&appid='+'28296657'+'&appsecret='+'VpcEL7ch'
    }).then(res => {
      var data = JSON.parse(res.data.data)
      var arr = data.data[0].hours
      // arr.forEach(item => {
      //   item.hours = item.hours ? item.hours.split('时')[0] : ''
      // })
      this.hours = arr
      // console.log(this.hours)
    })
  }
}