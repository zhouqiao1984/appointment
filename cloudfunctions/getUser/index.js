// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let _openid = wxContext.OPENID
  let dbName = 'app_user'
  console.log('cloudfunc [getUser] , _openid [', _openid, ']')
  console.log('dbName[', dbName, ']')
  return db.collection(dbName).where({
    _openid: _openid
  }).get().then(res => {
      console.log('response -> ', res)
      return res
    })
}