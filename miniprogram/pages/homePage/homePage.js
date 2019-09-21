// pages/homePage/homePage.js
//index.js
const app = getApp()
const log = require('../../log.js')

Page({
  data: {
    takeSession: false,
    requestResult: '',
    imgUrls: [
      // '../../images/back_home0.jpg',
      '../../images/back_home1.jpg',
      '../../images/back_home2.jpg',
      '../../images/back_home3.jpg'
    ],
    swiperConfig: {
      indicatorDots: true, // 是否显示面板指示点
      autoplay: true, // 是否自动切换
      interval: 5000, // 自动切换时间间隔
      duration: 500, // 滑动动画时长
      circular: true // 是否采用衔接滑动
    },
    latitude: 41.804820, // 中心纬度
    longitude: 123.370100, // 中心经度
    markers: [{ // 标记点
      id: 1,
      latitude: 41.804820,
      longitude: 123.370100,
      name: '小花小儿推拿'
    }]
  },

  onLoad: function () {
    log.info('[homePage] join')
    this.getUsers()
  },

  getUsers: function () {
    let that = this
    wx.cloud.callFunction({
      name: 'commonGet',
      data: {
        dbName: 'app_user',
        filter: { _openid: app.globalData.openId }
      }
    }).then(res => {
      let users = res.result.data
      if (users.length > 0) {
        log.info('[首页] 读取用户_openid[', app.globalData.openId, ']信息', users[0])
        app.globalData.baby = users[0].baby
        app.globalData.tel = users[0].tel
        app.globalData.userid = users[0]._id
      }
    })

  }
  

})
