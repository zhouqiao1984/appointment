// pages/common/temps.js
const app = getApp()
const log = require('../../log.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _id: '',
    key: '',
    value: '',
    type: 'text',
    table: '',
    title: '',
    disabled: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    log.info('[template] join')
    this.setData({
      _id: options._id,
      type: options.type,
      key: options.key,
      value: options.value,
      table: options.table,
      title: options.title
    })

    wx.setNavigationBarTitle({
      title: options.title
    })
  },

  getValue: function (e) {
    if (this.data.disabled){
        this.setData({
          disabled: false
        })
    }
    this.setData({
      value: e.detail.value
    })
  },
  saveValue: function () {
    let that = this
    const db = wx.cloud.database()
    const table = db.collection(this.data.table)
    const field = this.data.key

    table.doc(that.data._id).update({
      data: {
        [field]: that.data.value,
        updated: app.getDate()
      },
      success: function (res) {
        that.turnToBack() // 返回上级页面
      },
      fail: err =>  {
        log.error('[template] 更新用户信息_id[', that.data._id, ']失败', err)
        console.log('[template] 更新表', that.data.table, '失败')
        wx.showToast({
          title: '操作失败',
          icon: 'none',
          duration: 1500,
        })
       
      }
    })
  },
  // 返回上级页面
  turnToBack: function() {
    let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
    let prevPage = pages[pages.length - 2];
    //prevPage 是获取上一个页面的js里面的pages的所有信息。 -2 是上一个页面，-3是上上个页面以此类推。
    prevPage.setData({  // 将我们想要传递的参数在这里直接setData。上个页面就会执行这里的操作。
      [this.data.key]: this.data.value
    })
    // app.globalData[this.data.key] = this.data.value
    wx.navigateBack({
      delta: 1
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