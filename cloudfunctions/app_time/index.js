// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.action) {
    case 'getDataByMmonth': {
      return getDataByMmonth(event)
    }
    // case 'getWXACode': {
    //   return getWXACode(event)
    // }
    // case 'getOpenData': {
    //   return getOpenData(event)
    // }
    default: {
      return
    }
  }
}

async function getDataByMmonth(event) {
  const { OPENID } = cloud.getWXContext()
  let dbName = event.dbName
  let filter = event.filter ? event.filter : null
  console.log('cloudfunc [getDataByMmonth] , _openid [', OPENID, ']')
  console.log('dbName[', dbName, '], filter[', filter, ']')
  // return db.collection(dbName).where(filter).orderBy('_id', 'asc').get().then(res => {
  //   console.log('response -> ok')
  //   return res
  // })
  let month = filter.month
  let year = filter.year
  const $ = db.command.aggregate
  return db.collection(dbName).
    aggregate().match({
      month: $.eq(month),
      year: $.eq(year)
    }).group({
      _id: '$day',
      num: $.sum(1)
    }).end().then(res => {
      return res
    })
}