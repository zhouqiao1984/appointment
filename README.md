2019 9 8 begin

# 云开发 quickstart

这是云开发的快速启动指引，其中演示了如何上手使用云开发的三大基础能力：

- 数据库：一个既可在小程序前端操作，也能在云函数中读写的 JSON 文档型数据库
- 文件存储：在小程序前端直接上传/下载云端文件，在云开发控制台可视化管理
- 云函数：在云端运行的代码，微信私有协议天然鉴权，开发者只需编写业务逻辑代码

## 参考文档

- [云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)

## 需求
1、预约提前量是否要求
2、指南-消息，预约成功后发送
3、
    顶部固定
    <view style="position:fixed;top:0;">
    ......
    </view>
    底部固定
    <view style="position:fixed;bottom:0;">
    ......
    </view>
4、底部固定栏
   app.json中配置tabBar，跳转到 tabBar 页面,并关闭其他所有非 tabBar 页面
   其他方式跳转tabBar中页面不能传参且只能用
   wx.switchTab({
    url: '/index'
  })
5、
    <include src="header.wxml"/>
    <view> body </view>
    <include src="footer.wxml"/>