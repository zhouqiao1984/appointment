// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let _openid = wxContext.OPENID
  let dbName = event.dbName
  let dbData = event.dbData
  dbData._openid = _openid
  
  console.log('cloudfunc [commonAdd] , _openid [', _openid, ']')
  console.log('dbName[', dbName, '], dbData[', dbData, ']')
  return db.collection(dbName).add({
    data: dbData,
    }).then(res => {
        console.log('response -> ', res)
        return res
    })
}