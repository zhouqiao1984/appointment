
const app = getApp()
const log = require('../../log.js')

Page({

  data: {
    today: '',
    _id: null, // 预约id 2019091401 判断是否空闲
    date_id: null, // 查询当天预约数据的ID
    view: '', // 显示名称
    index: -1, // 当前选中
    year: 0,
    month: 0,
    day: 0,
    month_str: '',
    date_str: '',
    items: [
      { index: 0, key: '401', value: '04:00', free: true, show: false, baby: '', tel: '', nickName: '', created: '' },
      { index: 1, key: '402', value: '04:15', free: true, show: false, baby: '', tel: '', nickName: '', created: ''  },
      { index: 2, key: '403', value: '04:30', free: true, show: false, baby: '', tel: '', nickName: '', created: ''   },
      { index: 3, key: '404', value: '04:45', free: true, show: false, baby: '', tel: '', nickName: '', created: ''  },
      { index: 4, key: '501', value: '05:00', free: true, show: false, baby: '', tel: '', nickName: '', created: ''  },
      { index: 5, key: '502', value: '05:15', free: true, show: false, baby: '', tel: '', nickName: '', created: ''  },
      { index: 6, key: '503', value: '05:30', free: true, show: false, baby: '', tel: '', nickName: '', created: ''  },
      { index: 7, key: '504', value: '05:45', free: true, show: false, baby: '', tel: '', nickName: '', created: ''  },
      { index: 8, key: '601', value: '06:00', free: true, show: false, baby: '', tel: '', nickName: '', created: ''   },
      { index: 9, key: '602', value: '06:15', free: true, show: false, baby: '', tel: '', nickName: '', created: '' },
      { index: 10, key: '603', value: '06:30', free: true, show: false, baby: '', tel: '', nickName: '', created: ''  },
      { index: 11, key: '604', value: '06:45', free: true, show: false, baby: '', tel: '', nickName: '', created: ''  },
      { index: 12, key: '701', value: '07:00', free: true, show: false, baby: '', tel: '', nickName: '', created: '' },
      { index: 13, key: '702', value: '07:15', free: true, show: false, baby: '', tel: '', nickName: '', created: ''  },
      { index: 14, key: '703', value: '07:20', free: true, show: false, baby: '', tel: '', nickName: '', created: '' },
      { index: 15, key: '704', value: '07:45', free: true, show: false, baby: '', tel: '', nickName: '', created: ''  },
      { index: 16, key: '801', value: '08:00', free: true, show: true, baby: '', tel: '', nickName: '', created: ''  },
      { index: 17, key: '802', value: '08:15', free: true, show: true, baby: '', tel: '', nickName: '', created: '' },
      { index: 18, key: '803', value: '08:30', free: true, show: true, baby: '', tel: '', nickName: '', created: ''  },
      { index: 19, key: '804', value: '08:45', free: true, show: true, baby: '', tel: '', nickName: '', created: ''  },
      { index: 20, key: '901', value: '09:00', free: true, show: true, baby: '', tel: '', nickName: '', created: '' },
      { index: 21, key: '902', value: '09:15', free: true, show: true, baby: '', tel: '', nickName: '', created: '' },
      { index: 22, key: '903', value: '09:30', free: true, show: true, baby: '', tel: '', nickName: '', created: '' },
      { index: 23, key: '904', value: '09:45', free: true, show: true, baby: '', tel: '', nickName: '', created: '' },
      { index: 24, key: '101', value: '10:00', free: true, show: true, baby: '', tel: '', nickName: '', created: ''  },
      { index: 25, key: '102', value: '10:15', free: true, show: true, baby: '', tel: '', nickName: '', created: ''  },
      { index: 26, key: '103', value: '10:30', free: true, show: true, baby: '', tel: '', nickName: '', created: ''  },
      { index: 27, key: '104', value: '10:45', free: true, show: true, baby: '', tel: '', nickName: '', created: ''  },
      { index: 28, key: '111', value: '11:00', free: true, show: true, baby: '', tel: '', nickName: '', created: ''  },
      { index: 29, key: '112', value: '11:15', free: true, show: true, baby: '', tel: '', nickName: '', created: ''  },
      { index: 30, key: '113', value: '11:30', free: true, show: true, baby: '', tel: '', nickName: '', created: '' },
      { index: 31, key: '114', value: '11:45', free: true, show: true, baby: '', tel: '', nickName: '', created: '' },
      { index: 32, key: '121', value: '12:00', free: true, show: false, baby: '', tel: '', nickName: '', created: ''  },
      { index: 33, key: '122', value: '12:15', free: true, show: false, baby: '', tel: '', nickName: '', created: ''  },
      { index: 34, key: '123', value: '12:30', free: true, show: false, baby: '', tel: '', nickName: '', created: '' },
      { index: 35, key: '124', value: '12:45', free: true, show: false, baby: '', tel: '', nickName: '', created: '' },
      { index: 36, key: '131', value: '13:00', free: true, show: true, baby: '', tel: '', nickName: '', created: '' },
      { index: 37, key: '132', value: '13:15', free: true, show: true, baby: '', tel: '', nickName: '', created: ''  },
      { index: 38, key: '133', value: '13:30', free: true, show: true, baby: '', tel: '', nickName: '', created: '' },
      { index: 39, key: '134', value: '13:45', free: true, show: true, baby: '', tel: '', nickName: '', created: ''  },
      { index: 40, key: '141', value: '14:00', free: true, show: true, baby: '', tel: '', nickName: '', created: '' },
      { index: 41, key: '142', value: '14:15', free: true, show: true, baby: '', tel: '', nickName: '', created: '' },
      { index: 42, key: '143', value: '14:30', free: true, show: true, baby: '', tel: '', nickName: '', created: '' },
      { index: 43, key: '144', value: '14:45', free: true, show: true, baby: '', tel: '', nickName: '', created: '' },
      { index: 44, key: '151', value: '15:00', free: true, show: true, baby: '', tel: '', nickName: '', created: '' },
      { index: 45, key: '152', value: '15:15', free: true, show: true, baby: '', tel: '', nickName: '', created: '' },
      { index: 46, key: '153', value: '15:30', free: true, show: true, baby: '', tel: '', nickName: '', created: '' },
      { index: 47, key: '154', value: '15:45', free: true, show: true, baby: '', tel: '', nickName: '', created: '' },
      { index: 48, key: '161', value: '16:00', free: true, show: true, baby: '', tel: '', nickName: '', created: '' },
      { index: 49, key: '162', value: '16:15', free: true, show: true, baby: '', tel: '', nickName: '', created: '' },
      { index: 50, key: '163', value: '16:30', free: true, show: true, baby: '', tel: '', nickName: '', created: '' },
      { index: 51, key: '164', value: '16:45', free: true, show: true, baby: '', tel: '', nickName: '', created: '' },
      { index: 52, key: '171', value: '17:00', free: true, show: true, baby: '', tel: '', nickName: '', created: '' },
      { index: 53, key: '172', value: '17:15', free: true, show: true, baby: '', tel: '', nickName: '', created: ''  },
      { index: 54, key: '173', value: '17:30', free: true, show: true, baby: '', tel: '', nickName: '', created: '' },
      // { index: 55, key: '174', value: '17:45', free: true, show: false },
      // { index: 56, key: '181', value: '18:00', free: true, show: false },
      // { index: 57, key: '182', value: '18:15', free: true, show: false },
      // { index: 58, key: '183', value: '18:30', free: true, show: false },
      // { index: 59, key: '184', value: '18:45', free: true, show: false },
      // { index: 60, key: '191', value: '19:00', free: true, show: false },
      // { index: 61, key: '192', value: '19:15', free: true, show: false },
      // { index: 62, key: '193', value: '19:30', free: true, show: false },
      // { index: 63, key: '194', value: '19:45', free: true, show: false },
    ]
  },
  // 初始化
  onLoad: function (e) {
    log.info('[adminViewAppoint] join', e)
    // 动态修改头部标题
    let title = e.year + '/' + e.month + '/' + e.day
    wx.setNavigationBarTitle({
      title: title
    })
    this.initData(e.year, e.month, e.day)
    // this.initData('2019', '9', '26') // 测试用
  },

  initData: function (y, m, d) {
    let mstr = m.length === 1 ? '0' + m : '' + m
    let dstr = d.length === 1 ? '0' + d : '' + d
    let date_id = `${y}${mstr}${dstr}`
    this.refreshItems(date_id)
  },

  // 请求新内容
  refreshItems: function (date_id) {
    let that = this
    wx.cloud.callFunction({
      name: 'commonGet',
      data: {
        filter: {
          date_id: date_id
        },
        dbName: 'app_time'
      },
      success: res => {

        that.renderItems(res.result.data)
      },
      fail: err => {
        log.error('[adminViewAppoint] 读取 [', date_id, '] 预约信息,调用失败', err)
        wx.showToast({
          title: '数据加载错误',
          icon: 'loading',
          duration: 2000,
        })

      }
    })
  },
  // 渲染内容页面
  renderItems: function (data) {
    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        let baby = "items[" + data[i].index + "].baby" //这里需要将设置的属性用字符串进行拼接
        let tel = "items[" + data[i].index + "].tel" //这里需要将设置的属性用字符串进行拼接
        let nickName = "items[" + data[i].index + "].nickName" //这里需要将设置的属性用字符串进行拼接
        let free = "items[" + data[i].index + "].free"
        let created = "items[" + data[i].index + "].created"
        this.setData({
          [baby]: data[i].baby,
          [tel]: data[i].tel,
          [nickName]: data[i].nickName,
          [created]: data[i].created,
          [free]: false
        })
      }
    }

  },
  callPhone: function (e) {
    var phone = e.currentTarget.dataset.ph;
        wx.makePhoneCall({
          phoneNumber: phone
        })
  },

})