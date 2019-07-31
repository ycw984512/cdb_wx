// pages/loadingIndex/loadingIndex.js;
var app = getApp();

import {
  request
} from "../../utils/request.js";
import {
  getQueryVariable
} from "../../utils/utils.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag: false,
    id: "",
    type: "",
    key: "",
    mold: "",
    code: "",
    couponId: "",
    extension_code: "",
    touristCode: "",
    storeId: null,
    giftCode: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow(){
    app.globalData.storeId = "";
  },
  onLoad: function(options) {
    var scene = decodeURIComponent(options.scene);
    console.log(scene);
    if (scene !="undefined"){
      var id = getQueryVariable(scene,"id") || "";
      var type = getQueryVariable(scene,"type")|| "";
      var key = getQueryVariable(scene,"key")  || "";
      var touristCode = getQueryVariable(scene,"touristCode") || "";
      var code = getQueryVariable(scene,"code")|| "";
      var couponId = getQueryVariable(scene,"couponId")|| "";
      var extension_code = getQueryVariable(scene,"extension_code") || "";
      var storeId = getQueryVariable(scene,"storeId")|| "";
      var giftCode = getQueryVariable(scene,"giftCode")|| "";

      console.log(type)

    }else{
      var id = options.id || "";
      var type = options.type || "";
      var key = options.key || "";
      var touristCode = options.touristCode || "";
      var code = options.code || "";
      var couponId = options.couponId || "";
      var extension_code = options.extension_code || "";
      var storeId = options.storeId || "";
      var giftCode = options.giftCode || "";
    }


    this.setData({
      id: id,
      type: type,
      key: key,
      code: code,
      touristCode: touristCode,
      couponId: couponId,
      extension_code: extension_code,
      storeId: storeId,
      giftCode: giftCode
    })
    var that = this;
    wx.getSetting({
      success(res) {
        console.log(res.authSetting)
        if (JSON.stringify(res.authSetting) == "{}") {
          that.setData({
            flag: true
          })
        } else {

          wx.showLoading({
            title: '加载中',
            mask: true,
          })
          that.loginWx();
        }
      }
    })

  },
  loginWx: function() {
    var that = this;
    // 获取用户信息
    wx.getUserInfo({
      success: res => {
        // 可以将 res 发送给后台解码出 unionId
        var userInfo = res.userInfo
        // 由于 getUserInfo 是网络请求，所以网络慢的情况下会加载的时间长一点
        // 登录
        wx.login({
          success: res => {
            if (res.code) {
              // 发送 res.code ,昵称和头像到后台地址换取 token
              var code = res.code;
              var avatarUrl = userInfo.avatarUrl;
              var nickName = userInfo.nickName;
              console.log(code);
              request({
                method: "post",
                url: "/api/token/user",
                data: {
                  code: code,
                  picture: avatarUrl,
                  name: nickName
                }
              }).then(res => {
                console.log(res);
                app.globalData.token = res.data.data.token;
                app.globalData.is_store = res.data.data.is_store;
                wx.setStorageSync('token', res.data.data.token);

                request({
                  url: "/api/config/wx_config",
                  header: {
                    'content-type': 'application/json', // 默认值
                    token: res.data.data.token
                  },
                }).then(res => {
                  //dosome
                  console.log(res);

                  app.globalData.coupon_release_integral = res.data.data.coupon_release_integral;
                  app.globalData.wechat_title = res.data.data.wechat_title;
                  app.globalData.platform_name = res.data.data.platform_name;
                  app.globalData.platform_phone = res.data.data.platform_phone;
                  app.globalData.introduce = res.data.data.introduce;
                  app.globalData.upload_domain = res.data.data.upload_domain;
                  app.globalData.panic_buying_coupon_release_agreement = res.data.data.panic_buying_coupon_release_agreement;
                  app.globalData.promotion_coupon_release_agreement = res.data.data.promotion_coupon_release_agreement;
                  app.globalData.service_charge = res.data.data.service_charge;

                  wx.getLocation({
                    type: 'gcj02',
                    success(res) {
                      var latitude = res.latitude
                      var longitude = res.longitude
                      app.globalData.latitude = latitude;
                      app.globalData.longitude = longitude;

                      var is_store = app.globalData.is_store;
                      console.log(is_store)
                      var id = that.data.id;
                      var type = that.data.type;
                      var key = that.data.key;
                      var touristCode = that.data.touristCode;
                      var code = that.data.code;
                      var couponId = that.data.couponId;
                      var extension_code = that.data.extension_code;
                      var storeId = that.data.storeId;
                      var giftCode = that.data.giftCode;

                      if (type == "") { //根据传过来的type判断是否是从其它页面扫码或者分享过来的，如果为空的话，就跳转到首页
                        console.log("type为空,不是通过扫码分享进入的")
                        if (is_store == 1) {
                          console.log("是商户,跳转到商户端")
                          wx.switchTab({
                            url: '../index/index'
                          })
                        } else if (is_store == 0) {
                          console.log("是游客,跳转到游客端")
                          wx.redirectTo({
                            url: '../visitorindex/visitorindex',
                          })
                        }
                      } else {

                        console.log("type不为空,是通过扫码分享进入的")

                        if (type == 1) { //如果不为空的话 根据type的值去跳转到哪个页面去
                          console.log("type==1的话是分享礼包进来的")
                          wx.redirectTo({
                            url: '../sharegift/sharegift?code=' + giftCode + '&id=' + id, //type==1的话是分享礼包进来的
                          })
                        } else if (type == 2) {
                          console.log("type==2的话是分享抢购券进来的", code)
                          wx.redirectTo({
                            url: '../sharecoupon/sharecoupon?touristCode=' + touristCode + '&code=' + code, //type==2的话是分享抢购券进来的
                          })
                        } else if (type == 3) {
                          console.log("type==3的话是通过扫描推广码进来的")
                          wx.redirectTo({
                            url: '../setinfo/setinfo?extension_code=' + extension_code, //type==3的话是通过扫描推广码进来的
                          })
                        } else if (type == 4) {
                          console.log("type==4的话是通过扫描添加员工码进来的")
                          wx.redirectTo({
                            url: '../addpersonindex/addpersonindex?key=' + key, //type==4的话是通过扫描添加员工码进来的
                          })
                        } else if (type == 5) {
                          console.log("type==5的话是通过门店分享进来的")
                          wx.redirectTo({
                            url: '../mystore/mystore?id=' + storeId, //type==4的话是通过分享门店进来的
                          })
                        }
                      }
                    },
                    fail(err) {
                      wx.showModal({
                        title: '提示',
                        content: '获取位置信息失败，请打开GPS，并重新进入小程序',
                      })
                    }
                  })


                })


              })
            } else {
              console.log('登录失败！' + res.errMsg)
            }
          }
        })
      },
      fail(err) {
        console.log(err)
      }
    })
  },
  getUserInfo() {
    var that = this;

    wx.showLoading({
      title: '加载中',
      mask: true,

    })

    wx.getUserInfo({
      success: res => {
        // 可以将 res 发送给后台解码出 unionId
        var userInfo = res.userInfo
        // 由于 getUserInfo 是网络请求，所以网络慢的情况下会加载的时间长一点
        // 登录
        wx.login({
          success: res => {
            if (res.code) {
              // 发送 res.code ,昵称和头像到后台地址换取 token
              var code = res.code;
              var avatarUrl = userInfo.avatarUrl;
              var nickName = userInfo.nickName;
              console.log(code);
              request({
                method: "post",
                url: "/api/token/user",
                data: {
                  code: code,
                  picture: avatarUrl,
                  name: nickName
                }
              }).then(res => {
                console.log(res);
                app.globalData.token = res.data.data.token;
                app.globalData.is_store = res.data.data.is_store;
                wx.setStorageSync('token', res.data.data.token);

                request({
                  url: "/api/config/wx_config",
                  header: {
                    'content-type': 'application/json', // 默认值
                    token: res.data.data.token
                  },
                }).then(res => {
                  //dosome
                  console.log(res);
                  app.globalData.coupon_release_integral = res.data.data.coupon_release_integral;
                  app.globalData.wechat_title = res.data.data.wechat_title;
                  app.globalData.platform_name = res.data.data.platform_name;
                  app.globalData.platform_phone = res.data.data.platform_phone;
                  app.globalData.introduce = res.data.data.introduce;
                  app.globalData.upload_domain = res.data.data.upload_domain;
                  app.globalData.panic_buying_coupon_release_agreement = res.data.data.panic_buying_coupon_release_agreement;
                  app.globalData.promotion_coupon_release_agreement = res.data.data.promotion_coupon_release_agreement;
                  app.globalData.service_charge = res.data.data.service_charge;

                  wx.getLocation({
                    type: 'gcj02',
                    success(res) {
                      var latitude = res.latitude
                      var longitude = res.longitude
                      app.globalData.latitude = latitude;
                      app.globalData.longitude = longitude;

                      var is_store = app.globalData.is_store;

                      console.log(is_store)
                      var id = that.data.id;
                      var type = that.data.type;
                      var key = that.data.key;
                      var touristCode = that.data.touristCode;
                      var code = that.data.code;
                      var couponId = that.data.couponId;
                      var extension = that.data.extension;
                      var storeId = that.data.storeId;
                      var giftCode = that.data.giftCode;

                      if (type == "") { //根据传过来的type判断是否是从其它页面扫码或者分享过来的，如果为空的话，就跳转到首页
                        console.log("type为空,不是通过扫码分享进入的")
                        if (is_store == 1) {
                          console.log("是商户,跳转到商户端")
                          wx.switchTab({
                            url: '../index/index'
                          })
                        } else if (is_store == 0) {
                          console.log("是游客,跳转到游客端")
                          wx.redirectTo({
                            url: '../visitorindex/visitorindex',
                          })
                        }
                      } else {

                        console.log("type不为空,是通过扫码分享进入的")

                        if (type == 1) { //如果不为空的话 根据type的值去跳转到哪个页面去
                          console.log("type==1的话是分享礼包进来的")
                          wx.redirectTo({
                            url: '../sharegift/sharegift?code=' + giftCode + '&id=' + id, //type==1的话是分享礼包进来的
                          })
                        } else if (type == 2) {
                          console.log("type==2的话是分享抢购券进来的")
                          wx.redirectTo({
                            url: '../sharecoupon/sharecoupon?touristCode=' + touristCode + '&code=' + code, //type==2的话是分享抢购券进来的
                          })
                        } else if (type == 3) {
                          console.log("type==3的话是通过扫描推广码进来的")
                          wx.redirectTo({
                            url: '../setinfo/setinfo?extension_code=' + extension_code, //type==3的话是通过扫描推广码进来的
                          })
                        } else if (type == 4) {
                          console.log("type==4的话是通过扫描添加员工码进来的")
                          wx.redirectTo({
                            url: '../addpersonindex/addpersonindex?key=' + key, //type==4的话是通过扫描添加员工码进来的
                          })
                        } else if (type == 5) {
                          console.log("type==5的话是通过门店分享进来的")
                          wx.redirectTo({
                            url: '../mystore/mystore?id=' + storeId, //type==5的话是通过分享门店进来的
                          })
                        }
                      }
                    },
                    fail(err) {
                      wx.showModal({
                        title: '提示',
                        content: '获取位置信息失败，请打开GPS，并重新进入小程序',
                      })
                    }
                  })


                })



              })
            } else {
              console.log('登录失败！' + res.errMsg)
            }
          }
        })
      },
      fail(err) {
        console.log(err)
      }
    })
  },

})