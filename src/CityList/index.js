import router from '@system.router'
import fetch from '@system.fetch'
export default {
    data: {
        hotList: [{
            name: '北京',
            id: '110100'
        }, {
            name: '上海',
            id: '310100'
        }, {
            name: '广州',
            id: '440100'
        }, {
            name: '深圳',
            id: '440300'
        }, {
            name: '无锡',
            id: '320200'
        }, {
            name: '苏州',
            id: '320500'
        }, {
            name: '杭州',
            id: '330100'
        }],
        cityList: [],
        letterList: [
            "A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L",
            "M", "N", "P", "Q", "R", "S", "T", "W", "X", "Y", "Z",
        ],
        showCity: false,
        searchCityList: []
    },
    onInit() {
        this.getCityList()
    },
    chooseCity(item) {
        router.replace({
            uri: 'Home',
            params: { cityId: item.id }
        })
    },
    handleCity(item) {
        router.replace({
            uri: 'Home',
            params: { cityId: item.id }
        })
    },
    letterCity(idx) {
        this.$element('list').scrollTo({ index: idx })
    },
    getCityList() {
        fetch.fetch({
            url: `https://quick-app-api.9g-tech.cn/api/gd/districts`
        }).then(res => {
            const data = JSON.parse(res.data.data)
            console.log(data)
            if(data.status === 'success') {
                this.cityList = data.data
                this.showCity = true
            }
        })
    },
    searchChange(e) {
        let allArr = []
        Object.keys(this.cityList).forEach(item => {
            allArr = [...allArr, ...(this.cityList[item] || [])]
        })
        this.searchCityList = allArr.filter(item => {
            return item.name.indexOf(e.value) >= 0
        })
        this.showCity = !e.value
    },
    back() {
        router.back()
    }
}