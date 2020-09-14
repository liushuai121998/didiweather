import router from '@system.router'
import fetch from '@system.fetch'
export default Custom_page({
    data: {
        detailId: '',
        detail: {},
        proposal: [],
        bg: '#fff',
        textColor: '#000'
    },
    onInit() {
        this.getDetail()
    },
    getDetail() {
        fetch.fetch({
            url: `http://quick-app-api.9g-tech.cn/api/grantie/warn-weather/detail/${this.detailId}`,
            responseType: 'json'
        }).then(({data: {data}}) => {
            console.log(data)
            if(data.status_code) {
                this.detail = data.data
                
                const {level, proposal} = this.detail
                if(proposal) {
                    if(proposal.indexOf('<BR>') >=0 ) {
                        this.proposal = proposal ? proposal.split('<BR>') : []
                    } else if(proposal.indexOf('<BR />') >= 0) {
                        this.proposal = proposal ? proposal.split('<BR />') : []
                    } else if(proposal.indexOf('<BR/>') >= 0) {
                        this.proposal = proposal ? proposal.split('<BR/>') : []
                    } else if(proposal.indexOf('<br />') >= 0) {
                        this.proposal = proposal ? proposal.split('<br />') : []
                    } else if(proposal.indexOf('<br/>') >= 0) {
                        this.proposal = proposal ? proposal.split('<br/>') : []
                    } else if(proposal.indexOf('<br>') >= 0) {
                        this.proposal = proposal ? proposal.split('<br>') : []
                    }
                }
                
                if(level.indexOf('蓝色') >= 0) {
                    this.bg = '#EDF4FF'
                    this.textColor = '#659BFE'
                } else if(level.indexOf('红色') >= 0) {
                    this.bg = '#FFE6E6'
                    this.textColor = '#BD0505'
                } else if(level.indexOf('橙色') >= 0) {
                    this.bg = '#FFF5EE'
                    this.textColor = '#FF7C24'
                } else if(level.indexOf('黄色') >= 0) {
                    this.bg = '#FFFFE6'
                    this.textColor = '#FFC400'
                }
            }
        })
    },
    back() {
        router.back()
    }
})