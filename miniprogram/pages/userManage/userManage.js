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
    userInfo: {},
    isInit: false,
    isAdmin: false,  // 是否管理员 grade=4
    openId:'',
    gradeList: ['访客', '普通用户', '会员', '管理员'],
    gradeShow: '',
    grade: 0
  },
  // 初始化
  onLoad: function (e) {
    log.info('[userManage] join')
    let isAdmin = false
    if (app.globalData.grade >= 3) {
      isAdmin = true
    }
    let that = this
    let _id = app.globalData.userid ? app.globalData.userid:''
    let baby = app.globalData.baby ? app.globalData.baby : ''
    let tel = app.globalData.tel ? app.globalData.tel : ''
    let avatarUrl = app.globalData.avatarUrl ? app.globalData.avatarUrl :'../index/user-unlogin.png'
    let userInfo = app.globalData.userInfo ? app.globalData.userInfo : ''
    let openId = app.globalData.openId
    let grade = app.globalData.grade
    // if (!isInit){
      this.setData({
        _id: _id,
        baby: baby,
        tel: tel,
        avatarUrl: avatarUrl,
        userInfo: userInfo,
        isInit: true,
        isAdmin: isAdmin,
        openId: openId,
        grade: grade,
        gradeShow: that.data.gradeList[grade]
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