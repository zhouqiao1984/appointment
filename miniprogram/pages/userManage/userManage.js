const app = getApp()
const log = require('../../log.js')
const db = wx.cloud.database()
const table = db.collection('app_user')
Page({

  data: {
    _id: '',
    baby: '',
    tel:'',
    avatarUrl:'../index/user-unlogin.png',
    userInfo: '',
    isInit: false
  },
  // 初始化
  onLoad: function (e) {
    log.info('[userManage] join')
    let that = this
    let _id = app.globalData.userid ? app.globalData.userid:''
    let baby = app.globalData.baby ? app.globalData.baby : ''
    console.log('baby ---> ', baby)
    let tel = app.globalData.tel ? app.globalData.tel : ''
    let avatarUrl = app.globalData.avatarUrl ? app.globalData.avatarUrl :'../index/user-unlogin.png'
    let userInfo = app.globalData.userInfo ? app.globalData.userInfo : ''

    // if (!isInit){
      this.setData({
        _id: _id,
        baby: baby,
        tel: tel,
        avatarUrl: avatarUrl,
        userInfo: userInfo,
        isInit: true
      })
    // }
  },

  // getUsers: function(){
  //   let that = this
  //   table.where({
  //     _openid: app.globalData.openId
  //   }).get({
  //     success: function (res) {
  //       if(res.data.length>0){
  //          that.setData({
  //            baby: res.data[0].baby, //
  //            tel: res.data[0].tel,
  //            _id: res.data[0]._id
  //         });
  //       }
  //     },
  //     fail: err => {
  //       log.error('[userManage] 读取用户_openid[', app.globalData.openId,']信息失败', err)
  //       wx.showToast({
  //         title: '数据加载错误',
  //         icon: 'loading',
  //         duration: 2000,
  //       })
       
  //     }
  //   })
  // }
})