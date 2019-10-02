// pages/userList/userList.js
const app = getApp()
const log = require('../../log.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [], // 记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.getUserList()
  },

  dosth: function(e){
    let id = e.currentTarget.dataset.id;
    let openid = e.currentTarget.dataset.openid;
    let name = e.currentTarget.dataset.name;
    let that = this
    // 调用云函数
    wx.cloud.callFunction({
      name: 'commonUpdateByid',
      data: {
        dbData: {
          grade: 9,
          updated: app.getDate()
        },
        dbName: 'app_user',
        logInfo: 'userList.js -> 测试',
        _id: id
      },
      success: res => {
        log.info('测试成功')
      },
      fail: err => {
        log.error('测试失败')
      }
    })
  },
  /**
   * 加载用户列表
   */
  getUserList: function(){
      let that = this
        wx.cloud.callFunction({
        name: 'commonGet',
        data: {
          dbName: 'app_user'
        }
      }).then(res => {
        console.log(res)
        that.setData({
          items: res.result.data
        })
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})