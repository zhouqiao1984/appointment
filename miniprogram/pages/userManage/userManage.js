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
    openId:'',
    gradeList: ['访客', '未授权用户', '普通用户', '会员', '管理员'],
    gradeShow: '',
    grade: 0
  },
  // 初始化
  onLoad: function (e) {
    log.info('[userManage] join')
    let isAdmin = false
    if (app.globalData.grade >= 4) {
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
      this.setData({
        _id: _id,
        baby: baby,
        tel: tel,
        avatarUrl: avatarUrl,
        userInfo: userInfo,
        isAdmin: isAdmin,
        openId: openId,
        grade: grade,
        gradeShow: that.data.gradeList[grade]
      })

  },
})