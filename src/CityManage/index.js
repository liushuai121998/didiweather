import router from '@system.router'
export default Custom_page({
    data: {
        isSwitch: false
    },
    toggleSwitch() {
        this.isSwitch = !this.isSwitch
    },
    toSelectCity() {
        router.push({
            uri: 'CityList'
        })
    }
})