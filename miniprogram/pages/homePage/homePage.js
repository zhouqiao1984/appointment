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
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    log.info('[homePage] join')
    this.getUsers()
    
  },
  /**
   * 初始化用户自定义信息
   */
  getUsers: function () {
    let that = this
    wx.cloud.callFunction({
      name: 'getUser',
      data: {}
    }).then(res => {
      if (res.result.data){
        let users = res.result.data
        if (users.length > 0) {
          log.info('[首页] 读取用户_openid[', users[0].userid, ']信息', users[0])
          app.globalData.appUser = users[0]
          if (app.globalData.userInfo.nickName != users[0].nickName) {
            // 如果当前微信昵称与用户表微信昵称不同，更新用户表昵称
            that.updateNickName()
          }
          that.initConfig()
        } else {
          wx.redirectTo({
            url: '../login/login',
          })
        }
      } else {
        wx.redirectTo({
          url: '../login/login',
        })
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
        _id: app.globalData.appUser._id
      },
      success: res => {
        log.info('[homePage-> commonUpdateByid] 用户昵称更新成功 ', app.globalData.userInfo )
      },
      fail: err => {
        log.error('[homePage -> commonUpdateByid] 用户信息更新失败 ', err)
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
      if (res.result.data){
        let config = res.result.data
        if (config.length > 0) {
          log.info('[首页 homePage] 读取预约配置信息成功', config[0])
          app.globalData.config_end = config[0].end
          app.globalData.config_grade = config[0].grade
        }
        wx.hideLoading()
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // wx.hideLoading()
  },

})
