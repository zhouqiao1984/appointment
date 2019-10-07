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
  console.log('logInfo: ', event.logInfo)
  console.log('cloudfunc [batchUpdate], _openid[', _openid, ']')
  console.log('dbName[', dbName, ']')
  console.log('dbData[', dbData, ']')

  let arr = []
  let collection = db.collection(dbName)
  for (let i = 0; i < dbData.length; i++) {
    let p = new Promise((resolve, reject) => {
      collection.doc(dbData[i]._id).update({
        data: {
          grade: dbData[i].grade,
          updated: dbData[i].updated
        },
      })
    })
    arr.push(p)
  }
  return Promise.all(arr).then((result) => {
    console.log("success --> ",result)
    return result
  }).catch((error) => {
    console.log("failed --> ",error)  // 打开的是 'failed'
    return error
  })
 
}