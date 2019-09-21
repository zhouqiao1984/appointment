//index.js
const app = getApp()
const log = require('../../log.js')

Page({
  data: {
    imgUrl: '../../images/index.jpeg'
   
  },

  onLoad: function() {
    log.info('[index] join')
    // this.testSql()
    // return

    let that = this
    if (!wx.cloud) {
      // 初始化失败，请使用2.2.3或以上的基础库以使用云能力
      log.error('[index] 初始化失败,请使用2.2.3或以上的基础库以使用云能力')
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
    // 初始化openId
    if (!app.globalData.openId) {
      that.onGetOpenid()
    }
    
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              app.globalData.islogin = true
              app.globalData.avatarUrl = res.userInfo.avatarUrl
              app.globalData.userInfo = res.userInfo
              wx.switchTab({
                url: '../homePage/homePage',
              })
            }
          })
        }else{
          wx.redirectTo({
            url: '../login/login',
          })
        }
      },
      fail: err => {
        log.error('[index] 获取用户信息失败 wx.getSetting 调用失败', err)
      }
    })
  },

  // 授权回调函数
  onGetUserInfo: function(e) {
    if (!app.globalData.logged && e.detail.userInfo) {
      app.globalData.islogin = true
      app.globalData.avatarUrl = e.detail.userInfo.avatarUrl
      app.globalData.userInfo = e.detail.userInfo
    }
  },
  // 初始化ipenid
  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        app.globalData.openId = res.result.userInfo.openId
        app.globalData.appId = res.result.userInfo.appId
      },
      fail: err => {
        log.error('[index] 云函数 login 调用失败', err)
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },
  
  testSql (){
    const db = wx.cloud.database()
    const $ = db.command.aggregate
    db.collection('app_time').
      aggregate().match({
        month: $.eq(9)
      }).group({
        _id: '$day',
        num: $.sum(1)
      }).end().then(res => {
        console.log('testSql ---> ', res)
      })
  }

  
  // 上传图片
  // doUpload: function () {
  //   // 选择图片
  //   wx.chooseImage({
  //     count: 1,
  //     sizeType: ['compressed'],
  //     sourceType: ['album', 'camera'],
  //     success: function (res) {

  //       wx.showLoading({
  //         title: '上传中',
  //       })

  //       const filePath = res.tempFilePaths[0]
        
  //       // 上传图片
  //       const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
  //       wx.cloud.uploadFile({
  //         cloudPath,
  //         filePath,
  //         success: res => {
  //           console.log('[上传文件] 成功：', res)

  //           app.globalData.fileID = res.fileID
  //           app.globalData.cloudPath = cloudPath
  //           app.globalData.imagePath = filePath
            
  //           wx.navigateTo({
  //             url: '../storageConsole/storageConsole'
  //           })
  //         },
  //         fail: e => {
  //           console.error('[上传文件] 失败：', e)
  //           wx.showToast({
  //             icon: 'none',
  //             title: '上传失败',
  //           })
  //         },
  //         complete: () => {
  //           wx.hideLoading()
  //         }
  //       })

  //     },
  //     fail: e => {
  //       console.error(e)
  //     }
  //   })
  // },

})
