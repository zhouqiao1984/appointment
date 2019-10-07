var util = require('../../util.js');
const app = getApp()
const log = require('../../log.js')
Page({
  data: {
    tel: '',
    baby: '',
    // nickName: '' // 微信昵称
  },

  onLoad: function () {
    log.info('[login] join')
  },

   // 授权回调函数
  onGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      wx.showLoading({
        title: '努力加载中...',
        mask: true // 是否显示透明蒙层，防止触摸穿透
      })
      app.globalData.avatarUrl = e.detail.userInfo.avatarUrl
      app.globalData.userInfo = e.detail.userInfo
      app.globalData.logged = true
      this.checkData()
    }else{
      log.info('[login] 用户拒绝授权')
    }
  },
  
  getBaby: function(e){
    this.setData({
      baby: e.detail.value
    })
  },

  getTel: function (e) {
    this.setData({
      tel: e.detail.value
    })
  },
  // 检查是否已注册
  checkData: function () {
    let that = this
    wx.cloud.callFunction({
      name: 'commonGet',
      data: {
        filter: {
          userid: app.globalData.openID
        },
        dbName: 'app_user'
      },
      success: res => {
        if (res.result.data.length === 0) {
          that.addData()
        } else {
          that.updateData(res.result.data[0])
        }
      },
      fail: err => {
        wx.hideLoading()
        log.error('[login] 用户信息查询失败 commonGet', err)
        wx.showToast({
          title: '用户信息查询失败',
          icon: 'none',
          duration: 1500,
        })

      }
    })
  },
  // 新建
  addData: function () {
    let that = this
    // 调用云函数
    wx.cloud.callFunction({
      name: 'commonAdd',
      data: {
        dbData: {
          tel: that.data.tel,
          baby: that.data.baby,
          grade: 0,  // 初始角色访客
          nickName: app.globalData.userInfo.nickName,
          updated: app.getDate(),
          created: app.getDate(),
          userid: app.globalData.openID
        },
        dbName: 'app_user'
      },
      success: res => {
          wx.hideLoading()
          setTimeout(function () {
            wx.redirectTo({
              url: '../index/index',
            })
          }, 100)
       
      },
      fail: err => {
        wx.hideLoading()
        log.error('[login] 用户信息保存失败 commonAdd', err)
        wx.showToast({
          title: '用户信息保存失败',
          icon: 'none',
          duration: 1500,
        })
        wx.navigateTo({
          url: '../error/error',
        })
      }
    })
  },
  // 更新
  updateData: function (appUser) {
    let that = this
    // 调用云函数
    wx.cloud.callFunction({
      name: 'commonUpdateByid',
      data: {
        dbData: {
          tel: that.data.tel,
          baby: that.data.baby,
          nickName: appUser.nickName,
          updated: app.getDate()
        },
        dbName: 'app_user',
        _id: appUser._id,
        logInfo: 'login.js -> updateData (已存在用户更新用户信息)'
      },
      success: res => {
        wx.hideLoading()
        setTimeout(function () {
          wx.navigateTo({
            url: '../index/index',
          })
        }, 100)
      },
      fail: err => {
        wx.hideLoading()
        log.error('[login] 用户信息更新失败 commonUpdateByid', err)
        wx.showToast({
          title: '用户信息更新失败',
          icon: 'none',
          duration: 1500,
        })
        wx.navigateTo({
          url: '../error/error',
        })
      }
    })
  }

})