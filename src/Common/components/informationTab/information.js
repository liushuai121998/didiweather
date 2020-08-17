import router from '@system.router'
import _ajax from '../../js/ajax'
import ucConfig from '../../../uc-config.json'
import func from '../../js/func'
const { _storage, _checkEmpty } = func
import { resolve } from 'url';
import prompt from '@system.prompt'
import network from '@system.network'
import device from '@system.device'
import webview from '@system.webview'
import shortcut from '@system.shortcut'
import fetch from '@system.fetch'
import storage from "@system.storage"
export default {
  props: ['myChannelList'],
  data: {
    channelList: [],
    myChannelList: [],
    network: 0,
    values: [],
    ucToken: '',
    listData: {},
    hasShortCut: true,
    hasChanged: false,
    noDataFlag: false,
    isRefreshing: false,
    currentPageId: '',
    loadMore: true,
    showListAd: [],
    listView: {
      top: 0,
      bottom: 0
    },
    isShowAd: []
  },
  onInit() {
    this.checkEmpty = _checkEmpty
    this.$on('itemclick-url', this.jumpURL)
    this.$on('itemclick-trackUC', this.trackClickUC)
    this.$on("adShowUc", this.adSinShow)
    this.oninitData()
  },
  adSinShow(values) {
    let id = values.detail;
    let item = this.showListAd.filter((item) => {
      return item.id == id
    })[0]
    this.trackShowUC(item)
  },
  trackShowUC(values) {
    console.log(values.title, '展示打点')
    fetch.fetch({
      url: values.show_impression_url,
      success: function (response) {

      },
      fail: function (data, code) {

      }
    })
    if (values.ad_content.show_ad_url_array && values.ad_content.show_ad_url_array.length) {
      values.ad_content.show_ad_url_array.forEach((url) => {
        fetch.fetch({
          url,
          success: function (response) {

          },
          fail: function (data, code) {

          }
        })
      })
    }
  },
  trackClickUC(values) {
    if (values.detail.item_type === 8) {
      if (values.detail.ad_content.click_ad_url_array && values.detail.ad_content.click_ad_url_array.length) {
        values.detail.ad_content.click_ad_url_array.forEach((url) => {
          fetch.fetch({
            url,
            success: function (response) {

            },
            fail: function (data, code) {

            }
          })
        })
      }
    }
  },
  getChannelList() {
    var that = this
    let postData = {
      access_token: this.values[3],
      app: ucConfig.name,
      dn: this.values[1].device,
      fr: 'android',
      ve: '1.0.0.0',
      nt: this.network
    }
    if (this.values[1].device.length === 15) {
      postData.imei = this.values[1].device;
      postData.oaid = '';
    } else {
      postData.oaid = this.values[1].device;
      postData.imei = '';

    }
    console.log(postData)
    _ajax.get_uc(
      'openapi/v3/channels', postData
      ,
      { timeOut: 2000 })
      .then(res => {
        if (res.code == 200 && res.data.data.channel) {
          that.channelList = []
          console.log('频道获取成功！')
          that.noDataFlag = false
          that.stopRefresh()
          res.data.data.channel.map(element => {
            that.channelList.push(
              {
                name: element.name,
                id: element.id
              }
            )
          });
          //console.log('channelList:', that.channelList)
          for (let i = 0; i < that.channelList.length; i++) {
            if (that.channelList[i].name == "本地") {
              that.channelList.splice(i, 1)
            }
          }
          //console.log('channelList-new:', that.channelList)
        }
        if (res.data.status == -1) {
          that.flashUcToken()
        }
      }, err => {
        that.noDataFlag = true
        this.stopRefresh()
        prompt.showToast({
          message: err.msg == '' ? err.msg : '未知错误'
        })
        return;
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
  toChannelPage() {
    router.push({
      uri: '/Channel',
      params: {
        channelList: this.channelList,
        myChannelList: this.myChannelList
      }
    })
  },
  //从服务器取得到UcToken
  getUcToken() {
    var that = this
    return new Promise((resolve, reject) => {
      _storage.get('ucToken').then(data => {
        if (data) {
          resolve(data)
        } else {
          _ajax.get(
            `https://quick-app-api.9g-tech.cn/api/uc-iflow/${ucConfig.app.app_id}`,
            {},
            { timeOut: 2000 })
            .then(({ data, code }) => {
              if (data.status_code == 200) {
                _storage.set('ucToken', data.data.access_token).then(() => {
                  this.noDataFlag = false
                  this.stopRefresh()
                  resolve(data.data.access_token)
                }, (err) => {
                  this.noDataFlag = true
                  //console.log('存储ucToken失败', err)
                  prompt.showToast({
                    message: '存储ucToken失败！'
                  })
                  return;
                })
              } else if (data.status_code == 204) {
                this.flashUcToken()
                return;
              } else {
                prompt.showToast({ message: '发生了未知错误呢 -_-!' })
              }
            }, err => {
              //console.log('请求ucToken报错！', err)
            })
        }
      }, err => {
        //console.log('取UcToken报错: ', err)
      })
    })
  },
  checkUcToken() {
    return _storage.get('ucToken')
  },
  //重新获得UCToken到服务器
  flashUcToken() {
    console.log(ucConfig)
    var that = this
    _ajax.post_uc(
      'auth/token',
      ucConfig.app,
      { timeOut: 2000 })
      .then((res) => {
        if (res.data.code == 0) {
          this.noDataFlag = false
          console.log('通知UC服务器更新我方服务器的Token成功！')
          _storage.delete('ucToken').then(() => {
            that.getUcToken()
          }, (err) => {
            //console.log('从storage删除ucToken报错!')
          })
        } else {
          console.log('从UC服务器获取Token失败，原因为:', JSON.stringify(res))
        }
      }, (err) => {
        //console.log('从UC服务器获取Token报错: ', JSON.stringify(err))
        this.noDataFlag = true
        this.stopRefresh()
      })
  },
  getListData(cid) {
    //console.log('获取列表数据')
    var that = this
    let postData = {
      access_token: this.values[3],
      app: ucConfig.name,
      dn: this.values[1].device,
      fr: 'android',
      ve: '1.0.0.0',
      nt: this.network
    }
    if (this.values[1].device.length === 15) {
      postData.imei = this.values[1].device;
      postData.oaid = '';
    } else {
      postData.oaid = this.values[1].device;
      postData.imei = '';

    }
    _ajax.get_uc(
      'openapi/v3/channel/' + cid,
      postData,
      { timeOut: 2000 })
      .then(res => {
        if (res.code == 200 && res.data.data.articles) {
          //console.log('成功！')
          if (that.checkEmpty(that.listData, cid, 'items').length && !that.isRefreshing) {
            that.listData[cid].articles = Object.assign(that.listData[cid].articles, res.data.data.articles)
            //console.log('listData.articles', that.listData[cid].articles)
            that.listData[cid].items = (that.listData[cid].items).concat(res.data.data.items)
            //console.log('listData.items', that.listData[cid].items)
          } else {
            that.listData[cid] = res.data.data
            //console.log('that.listData[cid]', that.listData[cid])
          }
          that.listData = JSON.parse(JSON.stringify(that.listData))
          console.log('list', that.listData)
          that.listData[cid].innerNoDataFlag = false
          that.showListAd = []
          that.channelList.forEach((item) => {
            if (that.listData[item.id]) {
              that.listData[item.id].items.forEach((fitem) => {
                that.showListAd.push(that.listData[item.id].articles[fitem.id])
              })
            }
          })
          that.showListAd = that.showListAd.filter((item) => {
            return item.item_type == 8
          })
          that.stopRefresh()
        }
        if (res.data.status == -1) {
          that.flashUcToken()
          that.stopRefresh()
        }
        if (that.checkEmpty(that.listData, cid)) {
          that.listData[cid].innerNoDataFlag = that.checkEmpty(that.listData, cid, 'items').length ? false : true
          that.listData = JSON.parse(JSON.stringify(that.listData))

        } else {
          that.listData[cid] = { 'innerNoDataFlag': true }
          that.listData = JSON.parse(JSON.stringify(that.listData))
        }
      }, err => {
        //console.log('报错-', JSON.stringify(err))
        //console.log('that.listData', that.checkEmpty(that.listData, cid), JSON.stringify(that.listData))
        if (that.checkEmpty(that.listData, cid)) {
          that.listData[cid].innerNoDataFlag = that.checkEmpty(that.listData, cid, 'items').length ? false : true
          that.listData = JSON.parse(JSON.stringify(that.listData))
        } else {
          that.listData[cid] = { 'innerNoDataFlag': true }
          that.listData = JSON.parse(JSON.stringify(that.listData))
        }
        //console.log(JSON.stringify(that.listData[cid]))
        that.stopRefresh()
        prompt.showToast({
          message: err.msg
        })
        return;
      })
  },
  changeTabActive(item) {
    if(!this.channelList[item.index]) {
      return
    }
    console.log(this.channelList)
    this.currentPageId =  this.channelList[item.index] ? this.channelList[item.index].id : ''
    //console.info('氢离子打点记录：', this.channelList[item.index].name, 'tab点击')
    //APP_STATISTICS.track_event('newstabpv', this.channelList[item.index].name);
    //console.log(this.channelList[item.index].id)
    if (!this.listData[this.channelList[item.index].id]) {
      this.getListData(this.channelList[item.index].id)
    }
    if (item.index < this.channelList.length - 1 && !this.listData[this.channelList[item.index + 1].id]) {
      this.getListData(this.channelList[item.index + 1].id)
    }
    if (item.index > 0 && !this.listData[this.channelList[item.index - 1].id]) {
      this.getListData(this.channelList[item.index - 1].id)
    }
  },
  jumpURL(e) {
    webview.loadUrl({
      url: e.detail,
      allowthirdpartycookies: true
    })
  },
  openDesk() {
    var that = this;
    storage.get({
      key: 'userAgreement',
      success(data) {
        if (data === '1') {
          const shortcut = require("@system.shortcut");
          shortcut.install({
            success: function () {
              //console.log("shortcut install success");
              that.hasShortCut = true;
              that.hasChanged = true;
            },
            fail: function () {
              that.hasShortCut = false;
              that.hasChanged = true;
            }
          });
        } else {
          that.$dispatch('show_focus_modal', true)
        }
      },
      fail(err) {
        that.$dispatch('show_focus_modal', true)
      }
    })
  },
  oninitData() {
    Promise.all([this.getNetwork(), this.getImei(), this.getDeviceInfo(), this.getUcToken()]).then((values) => {
      // console.info('这是信息：', values)
      this.values = values
      if (this.channelList.length == 0) {
        this.getChannelList()
      }
    }, (err) => {
      console.log('出错！', err)
    })

  },

  refresh(item) {
    let _this = this
    //console.log('刷新页面！！')
    //console.log('item', item)
    // 更新刷新状态（属性refreshing的值从false改为true会触发refresh组件的状态更新，反之亦然）
    _this.isRefreshing = item.refreshing
    if (_this.channelList.length > 0) {
      if (_this.currentPageId) {
        _this.getListData(this.currentPageId)
      } else {
        _this.getListData(this.channelList[0].id)
      }
    } else {
      _this.oninitData()
    }
  },
  stopRefresh() {
    this.isRefreshing = false
  },
  checkEmpty: '',

  // list滚动到底部事件
  scrollbottom() {
    this.getListData(this.currentPageId)
  }
}