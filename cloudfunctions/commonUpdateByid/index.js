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
  let dbData = event.dbData
  let _id = event._id
  dbData._openid = _openid
  console.log('logInfo: ', event.logInfo)
  console.log('cloudfunc [commonUpdateByid], _openid[', _openid, ']')
  console.log('dbName[', dbName, '], _id[',_id,']')
  console.log('dbData[', dbData, ']')
  return db.collection(dbName).doc(_id).update({
    data: dbData,
  }).then(res => {
    console.log('response -> ', res)
    return res
  })
}