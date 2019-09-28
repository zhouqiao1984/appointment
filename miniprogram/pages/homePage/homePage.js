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
    this.initConfig()
  },
  /**
   * 初始化用户自定义信息
   */
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
        app.globalData.grade = users[0].grade
        if (app.globalData.userInfo.nickName != users[0].nickName){
            // 如果当前微信昵称与用户表微信昵称不同，更新用户表昵称
            that.updateNickName()
        }

      }
    })

  },
   /**
   * 更新用户昵称
   */
  updateNickName: function(){
    // console.log('更新昵称')
    let that = this
    // 调用云函数
    let grade = this.data.gradeIndex
    wx.cloud.callFunction({
      name: 'commonUpdateByid',
      data: {
        dbData: {
          nickName: app.globalData.userInfo.nickName,
          updated: app.getDate()
        },
        dbName: 'app_user',
        logInfo: 'homePage.js -> updateNickName (对比后更新用户昵称)',
        _id: app.globalData.userid
      },
      success: res => {
        log.info('[homePage] 用户昵称更新成功commonUpdateByid', app.globalData.userInfo )
      },
      fail: err => {
        log.error('[homePage] 用户信息更新失败 commonUpdateByid', err)
      }
    })

  },

   /**
   * 初始化预约配置信息
   */
  initConfig: function () {
    let that = this
    wx.cloud.callFunction({
      name: 'commonGet',
      data: {
        dbName: 'app_config',
        filter: { _id: 'adminconfig' }
      }
    }).then(res => {
      let config = res.result.data
      if (config.length > 0) {
        log.info('[首页 homePage] 读取预约配置信息成功', config[0])
        app.globalData.config_end = config[0].end
        app.globalData.config_grade = config[0].grade
      }
    })

  }
  

})
