// pages/userList/userList.js
const app = getApp()
const log = require('../../log.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    apply_id: '', // 申请变更的预约id
    apply_view: '',
    apply_tel: '',
    apply_baby: '',
    apply_nickName: '',
    apply_userid:'',
    accept_id: '',
    items: [
    ],
    disabled: false // 按钮是否禁用
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    log.info('[appointChagne] join')
    this.setData({
      apply_id: options._id,
      apply_view: options.view,
      apply_userid: options.userid,
      apply_tel: options.tel,
      apply_baby: options.baby,
      apply_nickName: options.nickName
    })
  },
  /**
  * 预约查询
  */
  changeAppoint: function (e) {
    this.setData({
      accept_id: e.detail.value
    })
  },
  /**
  *  查询
  */
  searching: function () {
    if (this.data.accept_id === '' || this.data.accept_id.length !== 10) {
      wx.showToast({
        title: '请输入正确的号码',
        icon: 'none',
        duration: 2000,
      })
    } else {
      // 刷新页面
      this.getAppointData({ _id: this.data.accept_id })
    }
  },
  reseting: function () {
    this.setData({
      accept_id: ''
    })
  },
  /**
   * 加载预约数据
   */
  getAppointData: function (filter) {
    let that = this
    wx.cloud.callFunction({
      name: 'commonGet',
      data: {
        dbName: 'app_time',
        filter: filter,
        maxCount: 1
      }
    }).then(res => {
      if (res.result && res.result.data.length>0) {
        let disabled = false
        let appoint = res.result.data[0]
        let msg = '正常'
        // 以下几种不能申请变更的情况
        if (appoint.change && appoint.change.state === '1' ){
          // 在变更中
          disabled = true
          msg = '预约变更流程未结束,无法申请变更'
        } else if (appoint.userid === that.data.apply_userid){
          // 申请自己
          disabled = true
          msg = '同一用户无法申请变更'
        } else if (Number(appoint.date_id) <= Number(app.getyyyyMMdd()) ) {
          // 距离当天时间不足一天
          disabled = true
          msg = '距预约时间已不足一天,无法申请变更'
        }
        appoint.msg = msg
        that.setData({
          items: res.result.data,
          disabled: disabled
        })
      }else{
        that.setData({
          items: []
        })
      }
    })
  },

  /**
   * 变更确认
   */
  appointChangeBtn: function () {
    let that = this
    wx.showModal({
      title: '变更申请',
      content: `申请变更预约时间 ${that.data.items[0].view}`,
      success(res) {
        if (res.confirm) {
          that.setData({
            disabled: true
          })
          // 更新自己
          that.changeSubmit(that.data.apply_id, that.data.accept_id, 'apply', '1', that.data.items[0].view)
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
  },
  /**
   * 变更提交
   *    _id       要更新的id
   *    otherid   相关联的id
   *    type      变更类型 发起方 apply  接受方 appect
   *    state     变更状态 "1" 进行中  "0" 已结束
   */
  changeSubmit: function (_id, otherid, type, state, otherview) {
    let that = this
    let changeData = {
      type: type, // 
      state: state,
      otherid: otherid,
      otherview: otherview,
      updated: app.getDate(),
      mark: '发起预约变更申请'
    }
    if (type === 'accept'){
      changeData['tel'] = that.data.apply_tel
      changeData['baby'] = that.data.apply_baby
      changeData['nickName'] = that.data.apply_nickName
      changeData['userid'] = that.data.apply_userid
    }
    // 调用云函数
    wx.cloud.callFunction({
      name: 'commonUpdateByid',
      data: {
        dbData: {
          change: changeData
        },
        dbName: 'app_time',
        logInfo: 'appointChange.js -> changeSubmit (预约变更页面，申请变更)',
        _id: _id
      },
      success: res => {
        if (type === 'apply'){
          // 更新对方
          that.changeSubmit(that.data.accept_id, that.data.apply_id, 'accept', '1', that.data.apply_view)
        }else{
          wx.showToast({
            title: '申请成功',
            icon: 'none',
            duration: 2000,
            mask: true,
            complete: function () {
            setTimeout(function () {
                wx.navigateBack({
                  delta: 1
                })
              }, 2000)
            }

          })
        }
      },
      fail: err => {
        log.error('[appointChange] 预约变更申请失败 commonUpdateByid', err)
        wx.showToast({
          title: '申请失败,请联系管理员',
          icon: 'none',
          duration: 2000,
          mask: true
        })
        // wx.navigateTo({
        //   url: '../deployFunctions/deployFunctions',
        // })
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