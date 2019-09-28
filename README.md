2019 9 8 begin

# 云开发 quickstart

这是云开发的快速启动指引，其中演示了如何上手使用云开发的三大基础能力：

- 数据库：一个既可在小程序前端操作，也能在云函数中读写的 JSON 文档型数据库
- 文件存储：在小程序前端直接上传/下载云端文件，在云开发控制台可视化管理
- 云函数：在云端运行的代码，微信私有协议天然鉴权，开发者只需编写业务逻辑代码

## 参考文档

- [云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)

## 说明
一款预约服务的小程序
********************************************************************************
一、开发计划 0926
  1、预约功能对日期和角色进行限制
  2、每天预约时间、数量固定(35)。额满变灰不开放
  3、登录时用户表记录微信昵称，管理员需看到昵称
  4、用户申请提升等级，提交中间表，管理员审核通过。用户操作更新自身等级 
  5、设计预约变更、取消功能
  6、预约时间前一天发推送
  7、在适当位置添加使用说明
  8、统一错误页面

********************************************************************************
二、问题汇总:
  1、未完成的预约是否可以取消，或者距离预约开始时间多久前可以取消
  2、是否每人每天只能预约一次

********************************************************************************
三、 广告可行性分析
    1、优势:定位人群针对性强，由于推拿信息推送，授权用户不会取关
    2、原则:例如每周推送一个广告或每月两次
    3、广告内容：谨慎食物类，可选择例如，
       童装、儿童摄影、儿童教育、儿童娱乐等方向
       群内宝妈亲测觉得不错的商家可推荐

********************************************************************************
四、设计书

全局 app.globalData.openId
样式:
    方框      金黄色      #FFD700
    背景      白 色       #FFFFFF
              蓝色系      #1296db
    预约数    深蓝绿色     #3CB371
              深绿        #62b900
              浅绿        #11cd6e

一、主页
    进入主页，检查用户是否授权，
      已授权 => 首页
      未授权 => 授权页
二、授权页
    填写宝宝名字、手机号，作为用户的基本信息，点击完成，同意授权 => 首页
三、首页
    首页展示
      1、推拿店轮播图
      2、地址与联系电话
      3、地图坐标
    底部菜单栏
      1、首页
      2、预约
      3、我的
四、预约
    1、预约主页
        展示当月日历，可切换下月，当天标注橙色，
        每天35个时间段，
        点击具体日期进入预约页面，点击过去的日期无效
    2、预约页面
        显示当天所有的时间段，绿色为空闲可预约，红色为繁忙，不可预约
        选择一个时间段，点击确定 (校验该时间段是否仍是空闲，校验改用户在当天是否存在预约记录)，
        完成预约，返回上一页
五、我的
    1、我的主页
        显示微信头像，昵称，宝宝名字、手机号等个人信息，支持宝宝名字及手机号的更新功能
        提供 我的预约、管理员 (只有是管理员的用户可见) 功能
    2、我的预约
        查看预约记录，显示用户昵称、宝宝名字、手机号、预约时间、操作时间等信息
        ??? 未完成的预约是否可以取消，或者距离预约开始时间多久前可以取消
        取消预约既删除该记录，并存日志表
    3、管理员
        显示本月及下月日历，日期上方显示当天已预约数，点击具体日期可查看当天预约详情
        a.预约详情
            显示每个时间段的预约用户信息
可扩展功能 (云函数可读写任意数据)
一、管理员功能
    1、预约时间段可配置，选择目前开放的预约结束时间，与预约日历联动
    2、预约模式
        暂设为3种预约模式
            0 游客 1 普通用户 2 会员
        用户等级设置为
            0 游客 1 普通用户 2 会员  3、管理员   字段类型 number
        升级方法为管理员操作?或申请升级密码，密码存入密码库
        将密码发送给用户，
        用户使用密码将自身等级+1, (需查询用户表校验该密码是否有效)
        并存储本次升级所用的密码  
   
二、预约变更
    用户A,B线下联系同意更换，
    B告知A app_time的_id
    A用户点更换预约时间，输入_id
    用_id查出B的openid，将A要换的预约给B用户
    B用户在被换预约上点同意更换，将改预约给A用户


