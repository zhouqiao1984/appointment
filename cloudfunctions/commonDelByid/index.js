// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let _openid = wxContext.OPENID
  let dbName = event.dbName
  let id = event.id
  console.log('cloudfunc [commonDelByid] , _openid [', _openid, ']')
  console.log('dbName[', dbName, '], Del-ID[', id, ']')
  return db.collection(dbName).doc(id)
    .remove().then(res => {
      console.log('response -> ', res)
      return res
  })

}