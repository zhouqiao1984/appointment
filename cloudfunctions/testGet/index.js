// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init(
  {
    env: 'prod-e1-qwert', // 发布
    // env: ENV === 'local' ? 'dev-e1-gfq8a' : ENV,
    traceUser: true,
  }
)
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let _openid = wxContext.OPENID
  let dbName = event.dbName
  return db.collection(dbName).get().then(res => {
      console.log('response -> ', res)
      return res
    })
}