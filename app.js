//app.js

import { request } from "./utils/request.js"   
import GlobalConfig from './config/index'

const globalConfig = new GlobalConfig()

globalConfig.init()


App({
  globalData: {
    token: null,
    wechat_title:null,
    platform_name: null,
    platform_phone: null,
    introduce: null,
    upload_domain: null,
    longitude:null,
    latitude:null,
    service_charge:null,
    imgUploadUrl: "https://www.zbcdb.com",
    panic_buying_coupon_release_agreement:null,
    promotion_coupon_release_agreement:null,
    coupon_release_integral:null,
    is_store:0,
    config: globalConfig,
    storeId:""
  },
  onLaunch: function () {
    // wx.setEnableDebug({
    //   enableDebug: true
    // })
    // this.loginWx();

  },

  loginWx: function () {
    var that = this;
    // 获取用户信息
    wx.getUserInfo({
      success: res => {
        // 可以将 res 发送给后台解码出 unionId
        var userInfo = res.userInfo
        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        // 登录
        wx.login({
          success: res => {
            if (res.code) {
              // 发送 res.code ,昵称和头像到后台地址换取 token
              var code = res.code; var avatarUrl =userInfo.avatarUrl; var nickName = userInfo.nickName;

              request({
                method:"post",
                url: "/api/token/user",
                data: { code: code, picture: avatarUrl, name: nickName}
              }).then(res => {
                console.log(res);
                this.globalData.token = res.data.data.token;
                this.globalData.type = res.data.data.token;
                wx.setStorageSync('token', res.data.data.token);
                if (this.userTokenReadyCallback) {
                  this.userTokenReadyCallback(res)
                }

              })
            } else {
              console.log('登录失败！' + res.errMsg)
            }
          }
        })
      },
      fail(err){
        console.log(err)
      }
    })
  },
})