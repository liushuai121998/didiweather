export default {
    testFormat(val) {
        var regPos = /^[A-Za-z0-9]+$/;
        var regNeg = /[0-9]/; //负浮点数
        if (regPos.test(val) && regNeg && val.length >= 8 && val.length <= 20) {
            return true;
        }
        else {
            return false;
        }
    },
    unique(arr){
        var hash=[]
        for (var i = 0; i < arr.length; i++) {
          if(hash.indexOf(arr[i])==-1){
          hash.push(arr[i])
         }
        }
        return hash
    },
    OpenDesk() {
        var that = this;
        const prompt = require('@system.prompt')
        const shortcut = require('@system.shortcut')
        return new Promise((resolve, reject) =>{
            shortcut.install().then(res =>{
                resolve(true)
                //that.$app.data.hasShortCut = '12345'
                prompt.showToast({
                    message: '成功创建桌面图标'
                })
            }).catch((error, code)=>{
                reject(false)
                prompt.showToast({
                    message: '创建失败'
                })
            })
        })
    },
}