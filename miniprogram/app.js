//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'dev-e1-gfq8a',
        traceUser: true,
      })
    }
    
    this.globalData = {
      islogin: false
    }
  },

  getDate: function(){
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let d = now.getDate();
    let hour = now.getHours();
    let min = now.getMinutes();
    let sec = now.getSeconds();
    let day = now.getDay();
    let day_cn = '';
    switch (day){
      case 0: day_cn = '日'; break;
      case 1: day_cn = '一'; break;
      case 2: day_cn = '二'; break;
      case 3: day_cn = '三'; break;
      case 4: day_cn = '四'; break;
      case 5: day_cn = '五'; break;
      case 6: day_cn = '六'; break;       
    }
    return `${year}-${month}-${d} ${hour}:${min}:${sec} 星期${day_cn}`
  }
})
