// pages/userList/userList.js
const app = getApp()
const log = require('../../log.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userid: '',
    items: [
    ], 
    radioItems: [ // 角色选项
      { name: 1, value: '新用户' },
      { name: 2, value: '普通用户' },
      { name: 3, value: '会员' },
      { name: 4, value: '管理员' }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      let filter = {
        grade: 0
      }
      this.getUserList(filter)
  },
  /**
   * 提交当前页面角色配置
   */
  primary: function(){
    wx.showModal({
      title: '更新确认',
      content: `保存当前页面所有用户的角色配置`,
      success(res) {
        if (res.confirm) {
          let roles = []
          let dataList = this.data.items
          dataList.forEach(({ _id, newGrade, grade }) => {
            if (newGrade) {
              let r = {
                _id: _id,
                grade: newGrade,
                updated: app.getDate()
              }
              roles.push(r)
            }
          });
          if (roles.length > 0) {
            this.batchUpdate(roles)
          } else {
            wx.showToast({
              title: '没有需要更新的设置',
              icon: 'none',
              duration: 3000,
            })
          }
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
  },
   /**
   * 单选事件
   */
  radioChange: function (e) {
    let itemIndex = e.currentTarget.dataset.index
    let radioIndes = Number(e.detail.value)
    let data = "items[" + itemIndex + "].newGrade" 
    this.setData({
      [data]: radioIndes
    })
  },
  /**
   *  查询
   */
  searching: function(){
    if (this.data.userid === '' || this.data.userid.length !== 28){
        wx.showToast({
          title: '请输入正确的ID',
          icon: 'none',
          duration: 2000,
        })
    }else{
      // 刷新页面
      this.refresh({ userid: this.data.userid })
    }
  },
  reseting: function (){
    this.setData({
      userid: ''
    })
  },
  /**
   * 用户ID查询
   */
  searchUserid: function (e) {
    this.setData({
      userid: e.detail.value
    })
  },
  /**
   * 批量插入用户角色配置信息
   */
  batchUpdate: function (roles) {
    let that = this
    // 调用云函数
    wx.cloud.callFunction({
      name: 'batchUpdate',
      data: {
        dbData: roles,
        dbName: 'app_user',
        logInfo: 'userList.js -> batchUpdate (管理员批量更新用户角色)'
      },
      success: res => {
        wx.showToast({
          title: '更新成功',
          icon: 'none',
          duration: 1500,
        })
        // 刷新页面
        that.refresh({grade: 0})
      },
      fail: err => {
        log.error('[userList] 用户角色更新失败 batchUpdate', err)
        wx.showToast({
          title: '更新失败',
          icon: 'none',
          duration: 1500,
        })
        // wx.navigateTo({
        //   url: '../deployFunctions/deployFunctions',
        // })
      }
    })
  },

  refresh: function (filter) {
    let that = this
    this.setData({
      radioItems: [{ name: 1, value: '新用户' },
        { name: 2, value: '普通用户' },
        { name: 3, value: '会员' },
        { name: 4, value: '管理员' }]
    })
    that.getUserList(filter)
  },

  /**
   * 加载用户列表
   */
  getUserList: function (filter){
      let that = this
        wx.cloud.callFunction({
        name: 'commonGet',
        data: {
          dbName: 'app_user',
          filter: filter,
          maxCount: 10
        }
      }).then(res => {
        if (res.result){
          that.setData({
            items: res.result.data
          })
        }
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
    // console.log('onShow')
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