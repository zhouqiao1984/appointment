// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init(
  {
    env: 'prod-e1-qwert', // 发布
    traceUser: true,
  }
)
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let _openid = wxContext.OPENID
  let dbName = event.dbName
  let filter = event.filter ? event.filter : null
  let column = event.column ? event.column : null
  let maxCount = event.maxCount ? event.maxCount : 40 // 必填参数 上限20
  console.log('cloudfunc [commonGet] , _openid [', _openid, ']')
  console.log('dbName[', dbName, '], filter[', filter,']')
  return db.collection(dbName).where(filter)
    .field(column).limit(maxCount).get().then(res => {
    console.log('response -> ',res)
    return res
  })
}