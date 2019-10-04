const app = getApp()
const log = require('../../log.js')

Page({

  data: {
    _id: '',
    baby: '',
    tel:'',
    avatarUrl:'../index/user-unlogin.png',
    userInfo: {},
    isAdmin: false,  // 是否管理员 grade=4
    openid:'',
    gradeList: ['访客', '新用户', '普通用户', '会员', '管理员'],
    gradeShow: '',
    grade: 0
  },
  // 初始化
  onLoad: function (e) {
    log.info('[userManage] join')
    let isAdmin = false
    if (app.globalData.appUser.grade >= 4) {
      isAdmin = true
    }
    let that = this
    let _id = app.globalData.appUser._id ? app.globalData.appUser._id:''
    let baby = app.globalData.appUser.baby ? app.globalData.appUser.baby : ''
    let tel = app.globalData.appUser.tel ? app.globalData.appUser.tel : ''
    let avatarUrl = app.globalData.avatarUrl ? app.globalData.avatarUrl :'../index/user-unlogin.png'
    let userInfo = app.globalData.userInfo ? app.globalData.userInfo : ''
    let grade = app.globalData.appUser.grade
    let openid = app.globalData.openID
    
      this.setData({
        _id: _id,
        baby: baby,
        tel: tel,
        avatarUrl: avatarUrl,
        userInfo: userInfo,
        isAdmin: isAdmin,
        openid: openid,
        grade: grade,
        gradeShow: that.data.gradeList[grade]
      })

  },
})