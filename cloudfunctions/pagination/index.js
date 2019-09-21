// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let _openid = wxContext.OPENID
  let dbName = event.dbName
  let filter = event.filter ? event.filter : null // 筛选条件 默认为空 格式 { _id : 'abcde' }
  let pageIndex = event.pageIndex ? event.pageIndex :1 // 当前第几页，默认为1
  let pageSize = event.pageSize ? event.pageSize : 10 // 每页几条记录 默认10
  const countResult = await db.collection(dbName).where(filter).count() // 总记录数
  const total = countResult.total
  const totalPage = Math.ceil(total / 10)
  let hasMore = true // 是否还有数据
  if (pageIndex > totalPage || pageIndex == totalPage){
    hasMore = false
  }
  console.log('cloudfunc [pagination], _openid[', _openid, ']')
  console.log('dbName[', dbName, '], filter[', filter, '], pageIndex[', pageIndex, '], pageSize[', pageSize, '], total[', total, '], totalPage[', totalPage, '], hasMore[', hasMore,']')
  return db.collection(dbName).where(filter).field({
    _id: true,
    _openid: true,
    created: true,
    view: true,
    date_id: true
  }).orderBy('_id', 'desc').skip((pageIndex - 1) * pageSize).limit(pageSize).get().then(res =>{
    res.hasMore = hasMore
    res.total = total // 总数
    console.log('response -> ', res)
    return res
  })
}