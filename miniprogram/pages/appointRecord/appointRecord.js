// pages/recordAppoint/recordAppoint.js
const app = getApp()
const log = require('../../log.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    total: 0, // 总记录数
    items: [], // 记录
    hasMore: '', // 是否还有更多
    curr: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    log.info('[recordAppoint] join', options)
    let curr = Number(app.getyyyyMMdd())
    this.setData({
      curr: curr
    })
      this.gatData()
  },
  // 获取分页数据
  gatData: function() {
    wx.showLoading({
      title: '正在加载...',
      mask: true // 是否显示透明蒙层，防止触摸穿透
    })
    let that = this
    wx.cloud.callFunction({
      name: 'pagination',
      data:{
        dbName: 'app_time',
        pageIndex: 1,
        pageSize: 5,
        filter: { _openid: app.globalData.openID},
        field: {
          _id: true,
          _openid: true,
          created: true,
          view: true,
          date_id: true
        }
      }
    }).then( res => {
      that.renderData(res)
    })
  },
  // 渲染页面
  renderData(res){
     // res.result.data  res.result.hasMore   res.result.total
    // console.log(res)
    let _data = res.result.data
    for (let i = 0; i < _data.length; i++){
      _data[i].did = Number(_data[i].date_id)
    }
    // console.log(_data) 
    // console.log(this.data.curr) 
    this.setData({
      items: _data,// res.result.data,
      hasMore: res.result.hasMore,
      total: res.result.total
    })
    wx.hideLoading()
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