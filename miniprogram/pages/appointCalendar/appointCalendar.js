const app = getApp()
const log = require('../../log.js')
Page({
  data: {
    year: 0,
    month: 0,
    date: ['日', '一', '二', '三', '四', '五', '六'],
    dateArr: [],
    isToday: 0,
    isTodayWeek: false,
    todayIndex: 0,
    nowYear: 0,
    nowMonth: 0,
    nowDay: 0,

    nextYear: 0, // 下个月的年份
    nextMonth: 0, // 下个月的月份
    isShow: true, // 切换左右箭头样式
    nowCountDate: null, // 本月数据
    nextCountDate: null, // 下月数据
    end: '', // 预约开放截止日期
  },
  onLoad: function () {
    log.info('[makeAppoint] join')
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let nextYear = month > 11 ? year + 1 : year;
    let nextMonth = month > 11 ? 0 : month;
    let config_grade = app.globalData.config_grade || 0
    let config_end = app.globalData.config_end || ''
    // this.dateInit();
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
  getDataByMmonth: function (monthSql, yearSql, monthCalendar, yearCalendar) {
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
        log.error('[appointCalendar] 预约信息查询失败 getDataByMmonth ', err)
        wx.showToast({
          title: '预约信息查询失败',
          icon: 'none',
          duration: 1500,
        })

      }
    })
  },
  lookHuoDong: function(e) {
    let year = e.currentTarget.dataset.year;
    let month = e.currentTarget.dataset.month;
    let datanum = e.currentTarget.dataset.datenum;
    let timeError = false
    if (year < this.data.nowYear){
      timeError = true
    } else if (year == this.data.nowYear){
      if (month < this.data.nowMonth) {
        timeError = true
      } else if (month == this.data.nowMonth){
        if (datanum < this.data.nowDay) {
          timeError = true
        }
      }
    }
    if(timeError){
      wx.showToast({
        title: '已停止预约',
        icon: 'none',
        duration: 2000
      })
    }else{
      wx.navigateTo({
        url: '../appointChoice/appointChoice?year=' + year + '&month=' + month + '&day=' + datanum
      });
    }
   
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
    if (this.data.nowMonth == this.data.month) {
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
    if (this.data.nowCountDate) {
      // console.log('本月数据已存在')
      this.dateInit(year, month, this.data.nowCountDate);
    } else {
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
  setCountDate: function (list, monthCalendar, yearCalendar, countDate) {
    for (let i = 0; i < list.length; i++) {
      countDate[list[i]._id].num = list[i].num;
    }
    if (this.data.nowCountDate === null) {
      this.setData({
        nowCountDate: countDate
      })
    } else {
      this.setData({
        nextCountDate: countDate
      })
    }
    this.dateInit(yearCalendar, monthCalendar, countDate);
  },
})