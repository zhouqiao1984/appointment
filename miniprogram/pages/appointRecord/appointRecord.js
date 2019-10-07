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
  },
  /**
  * 生命周期函数--监听页面显示
  */
  onShow: function () {
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
        filter: { userid: app.globalData.openID}
        // field: {
        //   _id: true,
        //   userid: true,
        //   created: true,
        //   view: true,
        //   date_id: true,
        //   change: true
        // }
      }
    }).then( res => {
      that.renderData(res)
    })
  },
  // 渲染页面
  renderData(res){
     // res.result.data  res.result.hasMore   res.result.total
    let _data = res.result.data
    for (let i = 0; i < _data.length; i++){
      _data[i].did = Number(_data[i].date_id)
    }
    this.setData({
      items: _data,// res.result.data,
      hasMore: res.result.hasMore,
      total: res.result.total
    })
    wx.hideLoading()
  },
  /**
   * 预约变更同意
   */
  appAgree: function (e) {
    let change = e.currentTarget.dataset.change
    let apply_id = change.otherid
    let apply_view = change.otherview
    let apply_userid = change.userid 
    let apply_baby = change.baby
    let apply_tel = change.tel
    let apply_nickName = change.nickName

    let accept_id = e.currentTarget.dataset.id
    let accept_view = e.currentTarget.dataset.view
    let that = this
    let apply_dbData = {
      userid: app.globalData.openID,
      baby: app.globalData.appUser.baby,
      tel: app.globalData.appUser.tel,
      nickName: app.globalData.appUser.nickName,
      change: {
        state: "0",
        mark: "同意预约变更申请",
        updated: app.getDate()
      }
      
    }
    let accept_dbData = {
      userid: apply_userid,
      baby: apply_baby,
      tel: apply_tel,
      nickName: apply_nickName,
      change: {
        state: "0",
        mark: "同意预约变更申请",
        updated: app.getDate()
      }
    }
    wx.showModal({
      title: '同意',
      content: `确认同意与 ${apply_view} 交换预约时间?`,
      success(res) {
        if (res.confirm) {
          that.changeSubmit(apply_id, apply_dbData, accept_id, accept_dbData, 'apply', '操作成功')
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
  },
  /**
   * 预约变更拒绝
   */
  appReject: function (e) {
    let apply_id = e.currentTarget.dataset.otherid
    let accept_id = e.currentTarget.dataset.id
    let accept_view = e.currentTarget.dataset.view
    let that = this
    let dbData = {
      change: {
        state: "0",
        mark: "拒绝预约变更申请",
        updated: app.getDate()
      }
    }
    wx.showModal({
      title: '拒绝',
      content: `拒绝变更申请?`,
      success(res) {
        if (res.confirm) {
          that.changeSubmit(apply_id, dbData, accept_id, dbData, 'apply', '操作成功')
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
  },
  /**
   * 预约变更撤回
   */
  appCancel: function (e) {
    let accept_id = e.currentTarget.dataset.otherid
    let apply_id = e.currentTarget.dataset.id
    let apply_view = e.currentTarget.dataset.view
    let that = this
    let dbData = {
      change: {
        state: "0",
        mark: "撤回预约变更申请",
        updated: app.getDate()
      }
    }
    wx.showModal({
      title: '撤回',
      content: `确认撤回 ${apply_view} 的变更申请?`,
      success(res) {
        if (res.confirm) {
          console.log('确认撤回')
          that.changeSubmit(apply_id, dbData, accept_id, dbData, 'apply', '撤回成功')
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
  },
  /**
   * 预约取消
   */
  appDel: function (e) {
    let that = this
    let id = e.currentTarget.dataset.id
    let view = e.currentTarget.dataset.view
    wx.showModal({
      title: '预约取消',
      content: `确认取消 ${view} 的预约?`,
      success(res) {
        if (res.confirm) {
          that.deleteAppoint(id)
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
  },

  /**
   * 变更数据提交  
   * _id          要更新的id
   * changeData   要更新的内容
   * accept_id    第二次要更新的id
   * accept_changeData  第二次要更新的内容
   * type         当前类型 1次 apply  2次 accept
   * title        操作成功显示文字
   */
  changeSubmit: function (_id, dbData, accept_id, accept_dbData, type, title) {
    let that = this
    // 调用云函数
    wx.cloud.callFunction({
      name: 'commonUpdateByid',
      data: {
        dbData: dbData,
        dbName: 'app_time',
        logInfo: 'appointRecord.js -> changeSubmit (我的预约记录,撤回、拒绝、同意等)',
        _id: _id
      },
      success: res => {
        if (type === 'apply') {
          // 更新对方
          that.changeSubmit(accept_id, accept_dbData, null, null, 'accept', title)
        } else {
          wx.showToast({
            title: title,
            icon: 'none',
            duration: 2000,
            mask: true,
            complete: function () {
              setTimeout(function () {
                that.onShow()
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
   * 执行预约取消
   */
  deleteAppoint: function (id) {
    let that = this
    wx.cloud.callFunction({
      name: 'commonDelByid',
      data: {
        dbName: 'app_time',
        id: id
      },
      success: function (res) {
        console.log('appointRecord--->', res)
        that.gatData()
      },
      fail: err => {
        log.error('[selectTime] 刷新日历失败 app_time.getByDate_id[', date_id, '] 调用失败', err)
        wx.showToast({
          title: '预约取消失败,请联系管理员',
          icon: 'loading',
          duration: 2000,
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