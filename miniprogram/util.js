// 手机号校验
function checkTel(tel) {
  if (tel != ''){
    var reg = /^1[34578]\d(9)$/;
    if (reg.test(tel)){
      return true
    }else{
      return false
    }
  }else{
    return true
  }
}



module.exports = {
  checkTel: checkTel
}