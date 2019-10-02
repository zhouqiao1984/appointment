const app = getApp()
const log = require('../../log.js')
Page({
  data: {
    year: 0, // 日历当前年
    month: 0, // 日历当前月
    date: ['日', '一', '二', '三', '四', '五', '六'],
    dateArr: [],
    isToday: 0,
    isTodayWeek: false,
    todayIndex: 0,
    nowYear: 0,  // 本年
    nowMonth: 0, // 本月
    nowDay: 0,
    nextYear: 0, // 下个月的年份
    nextMonth: 0, // 下个月的月份
    isShow: true, // 切换左右箭头样式
    nowCountDate:null, // 本月数据
    nextCountDate: null, // 下月数据
    end:'', // 预约开放截止日期
    // switchChecked: '', // 开启会员模式 true 3 , false 2
    gradeArray: ['访客', '未授权用户', '普通用户', '会员'], // 预约权限列表
    gradeIndex: 0, // 预约权限选择
  },
  onLoad: function () {
    log.info('[adminManage] join')
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let nextYear = month > 11 ? year + 1 : year;
    let nextMonth = month > 11 ? 0 : month;
    let config_grade = app.globalData.config_grade || 0
    let config_end = app.globalData.config_end || ''
    this.setData({
      year: year,
      month: month,
      isToday: '' + year + month + now.getDate(),
      nowYear: year,
      nowMonth: month,
      nowDay: now.getDate(),
      nextYear: year,
      nextMonth: (nextMonth + 1),
      gradeIndex: config_grade,
      end: config_end
    })
    this.getDataByMmonth(month, year, null, null)
  },
  // 获取某月预约数据
  getDataByMmonth: function (monthSql, yearSql, monthCalendar, yearCalendar){
    let countDate = []
    for (let i = 0; i < 32; i++) {
      countDate.push({ num: 0 })
    }
    let that = this
    wx.cloud.callFunction({
      name: 'app_time',
      data: {
        filter: {
          month: monthSql,
          year: yearSql
        },
        dbName: 'app_time',
        action: 'getDataByMmonth'
      },
      success: res => {
        that.setCountDate(res.result.list, monthCalendar, yearCalendar, countDate)
      },
      fail: err => {
        // wx.hideLoading()
        log.error('[adminManage] 预约信息查询失败 getDataByMmonth ', err)
        wx.showToast({
          title: '预约信息查询失败',
          icon: 'none',
          duration: 1500,
        })

      }
    })
  },
  lookHuoDong: function (e) {
    let year = e.currentTarget.dataset.year;
    let month = e.currentTarget.dataset.month;
    let datanum = e.currentTarget.dataset.datenum;
    wx.navigateTo({
      url: '../adminViewAppoint/adminViewAppoint?year=' + year + '&month=' + month + '&day=' + datanum
    });
  },

  dateInit: function (setYear, setMonth, countDate) {
    //全部时间的月份都是按0~11基准，显示月份才+1
    let dateArr = [];  //需要遍历的日历数组数据
    let arrLen = 0;  //dateArr的数组长度
    let now = setYear ? new Date(setYear, setMonth) : new Date();
    let year = setYear || now.getFullYear();
    let nextYear = 0;
    let month = setMonth || now.getMonth();  //没有+1方便后面计算当月总天数
    let nextMonth = (month + 1) > 11 ? 1 : (month + 1);
    let startWeek = new Date(year + '/' + (month + 1) + '/' + 1).getDay();
    //目标月1号对应的星期
    let dayNums = new Date(year, nextMonth, 0).getDate();  //获取目标月有多少天
    let obj = {};
    let num = 0;
    if (month + 1 > 11) {
      nextYear = year + 1;
      dayNums = new Date(nextYear, nextMonth, 0).getDate();
    }

    arrLen = startWeek + dayNums;
    for (let i = 0; i < arrLen; i++) {
      if (i >= startWeek) {
        num = i - startWeek + 1;
        obj = {
          isToday: '' + year + (month + 1) + num,
          dateNum: num,
          weight: 5,
          appoint: countDate[num].num // i+10//当日预约数量
        }
      } else {
        obj = {};
      }
      dateArr[i] = obj;
    }
    // console.log('日历数组 -----------> ', dateArr)
    this.setData({
      dateArr: dateArr
    })
    let nowDate = new Date();
    let nowYear = nowDate.getFullYear();
    let nowMonth = nowDate.getMonth() + 1;
    let nowWeek = nowDate.getDay();
    let getYear = setYear || nowYear;
    let getMonth = setMonth >= 0 ? (setMonth + 1) : nowMonth;
    if (nowYear == getYear && nowMonth == getMonth) {
      this.setData({
        isTodayWeek: true,
        todayIndex: nowWeek
      })
    } else {
      this.setData({
        isTodayWeek: false,
        todayIndex: -1
      })
    }
  },
  /**
   * 上月切换
   */
  lastMonth: function () {
    // 判断当前显示的是否当月
    if (this.data.nowMonth == this.data.month){
      return
    }
    //全部时间的月份都是按0~11基准，显示月份才+1
    let year = this.data.month - 2 < 0 ? this.data.year - 1 : this.data.year;
    let month = this.data.month - 2 < 0 ? 11 : this.data.month - 2;
    this.setData({
      isShow: true,
      year: year,
      month: (month + 1)
    })
    // 如果当月数据已存在，不在查询数据库
    if(this.data.nowCountDate){
      // console.log('本月数据已存在')
      this.dateInit(year, month, this.data.nowCountDate);
    }else{
      // console.log('初始化本月数据')
      this.getDataByMmonth(month + 1, year, month, year)
    }
  },
  /**
   * 下月切换
   */
  nextMonth: function () {
    // 判断当前显示的是否当月
    if (this.data.nextMonth == this.data.month) {
      return
    }
    //全部时间的月份都是按0~11基准，显示月份才+1
    let year = this.data.month > 11 ? this.data.year + 1 : this.data.year;
    let month = this.data.month > 11 ? 0 : this.data.month;
    this.setData({
      isShow: false,
      year: year,
      month: (month + 1)
    })
    // 如果下月月数据已存在，不在查询数据库
    if (this.data.nextCountDate) {
      // console.log('下月数据已存在')
      this.dateInit(year, month, this.data.nextCountDate);
    } else {
      // console.log('初始化下月数据')
      this.getDataByMmonth(month + 1, year, month + 1, year)
    }
    
  },
  // 设置计数模板
  setCountDate: function (list, monthCalendar, yearCalendar, countDate){
      for(let i=0;i<list.length;i++){
        countDate[list[i]._id].num = list[i].num;
      }
    if (this.data.nowCountDate === null){
      this.setData({
        nowCountDate: countDate
      })
    }else{
      this.setData({
        nextCountDate: countDate
      })
    }
    this.dateInit(yearCalendar, monthCalendar, countDate);
  },
  bindDateChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      end: e.detail.value
    })
  },

  /**
   * 是否会员模式 0 游客 1 用户 2 会员 3管理员 number
   *  
   */
  bindPickerChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      gradeIndex: e.detail.value
    })
  },
 
  // switchChange: function (e) {
  //   this.setData({
  //     switchChecked: e.detail.value
  //   })
  // },
 /**
   * 点击更新按钮
   */
  updateSubmit(){
    let that = this
    wx.showModal({
      title: '更新确认',
      content: `预约时间开放至 ${that.data.end}  ,  【${that.data.gradeArray[that.data.gradeIndex]}】 模式`,
      success(res) {
        if (res.confirm) {
          // 唯一性检查
          that.updateConfig()
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
  },

  /**
   * 更新配置
   */
    updateConfig: function () {
      // console.log('更新配置')
      let that = this
      // 调用云函数
      let grade = this.data.gradeIndex
      wx.cloud.callFunction({
        name: 'commonUpdateByid',
        data: {
          dbData: {
            timestamp: new Date().getTime(),
            end: that.data.end,
            grade: grade,
            updated: app.getDate()
          },
          dbName: 'app_config',
          logInfo: 'adminManage.js -> updateConfig (管理员页面更新预约配置)',
          _id: 'adminconfig'
        },
        success: res => {
          wx.showToast({
            title: '更新成功',
            icon: 'none',
            duration: 1500,
          })
        },
        fail: err => {
          log.error('[login] 用户信息更新失败 commonUpdateByid', err)
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
    }

})