import fetch from '@system.fetch'
import router from '@system.router'
export default Custom_page({
    data: {
        lists: [],
        currentIndex: 0,
        localList: [],
        allList: [],
        nextLink: '',
        initUrl: 'http://quick-app-api.9g-tech.cn/api/grantie/warn-weather?per_page=10&page=1',
        allInitUrl: 'http://quick-app-api.9g-tech.cn/api/grantie/warn-weather?per_page=10&page=1&type=all',
        localMoreText: '正在加载中...',
        allNextLink: '',
        allMoreText: '正在加载中...',
        isLocalNoData: false,
        isAllNoData: false
    },
    onInit() {
        this.getLocalData(this.initUrl)
        this.getAllData(this.allInitUrl)
    },
    getLocalData(url) {
        fetch.fetch({
            url: `${url}`,
            responseType: 'json'
        }).then(({data}) => {
            if(data.code === 200) {
                this.localList = [...this.localList, ...data.data.data]
                this.nextLink = data.data.links.next || ''
                if(this.nextLink) {
                    this.localMoreText = '正在加载中...'
                } else {
                    this.localMoreText = '暂无更多数据'
                }
                if(this.localList.length === 0) {
                    this.isLocalNoData = true
                    this.localMoreText = ''
                }
            }
        })
    },
    getAllData(url) {
        fetch.fetch({
            url: `${url}`,
            responseType: 'json'
        }).then(({data}) => {
            if(data.code === 200) {
                this.allList = [...this.allList, ...data.data.data]
                this.allNextLink = data.data.links.next || ''
                if(this.allNextLink) {
                    this.allMoreText = '正在加载中...'
                } else {
                    this.allMoreText = '暂无更多数据'
                }
                if(this.allList.length === 0) {
                    this.isAllNoData = true
                    this.allMoreText = ''
                }
            }
        })
    },
    swiperChange({index}) {
        this.currentIndex = index
    },
    swiperBarClick(index) {
        this.currentIndex = index
    },
    scrollbottom() {
        this.nextLink && this.getLocalData(this.nextLink)
    },
    allScrollbottom() {
        this.allNextLink && this.getAllData(this.allNextLink)
    },
    toDetail(item) {
        router.push({
            uri: 'EarlyWarningDetail',
            params: {
                detailId: item.id
            }
        })
    }
})