// pages/promotiondetail/promotiondetail.js
import {
  request,
  baseURL
} from "../../utils/request.js";
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    promotionDetailData: null,
    upload_domain: null,
    coupon_amount: null,
    code: null,
    touristCode: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


    console.log(options)
    var that = this;

    var id = options.id;
    var token = app.globalData.token;
    var latitude = app.globalData.latitude;
    var longitude = app.globalData.longitude;
    var upload_domain = app.globalData.upload_domain; this.setData({ upload_domain: app.globalData.upload_domain, });
    request({
      url: "/api/tourist_coupon/my_coupon_detail",
      header: {
        'content-type': 'application/json', // 默认值
        token: app.globalData.token
      },
      data: {
        id: id,
        latitude,
        longitude
      }
    }).then(res => {

      if (res.data.error_code == 0) {

        //dosome
        console.log(res);

        this.setData({
          promotionDetailData: res.data.data,
        })

      } else { wx.showModal({ title: '提示', content: res.data.msg, }) }

    })


  },
  onShow() { },

  openLocation(e) {

    var longitude = Number(e.currentTarget.dataset.longitude);
    var latitude = Number(e.currentTarget.dataset.latitude);
    var name = e.currentTarget.dataset.name;
    var address = e.currentTarget.dataset.address;

    wx.openLocation({
      latitude,
      longitude,
      scale: 18,
      name,
      address
    })


  },

  download(e) {
    // var id = this.data.id;
    // var couponId = this.data.couponId;
    // var mold = this.data.mold;

    var touristCode = this.data.touristCode;
    var code = this.data.code;
    var token = app.globalData.token;
    var code = this.data.code;

    if (touristCode == "") { //code 为空说明从商户端分享的 还没进行支付0.01元
      wx.request({
        url: baseURL + "/api/tourist_coupon/receive",
        header: {
          'content-type': 'application/json', // 默认值
          token: app.globalData.token
        },
        data: {
          code: code
        },
        method: "post",
        success(res) {
          //dosome
          if (res.data.error_code == 0) {

            if (res.data.data.pay == 1) {
              wx.requestPayment({
                timeStamp: res.data.data.wx_pay.timeStamp,
                nonceStr: res.data.data.wx_pay.nonceStr,
                package: res.data.data.wx_pay.package,
                paySign: res.data.data.wx_pay.paySign,
                signType: "MD5",
                success(res) {
                  wx.showModal({
                    title: '提示',
                    content: '领取成功，请点击确定按钮返回个人中心首页',
                    showCancel: false,
                    success(res) {
                      if (res.confirm) {
                        wx.reLaunch({
                          url: '../visitorindex/visitorindex',
                        })
                      }
                    }
                  })

                },
                fail(res) {
                  wx.showToast({
                    title: '支付失败!',
                  })
                },
                complete(res) {
                  console.log(res)
                }
              })


            } else {
              wx.showToast({
                title: '取消支付',
              })
            }

          } else {

            wx.showModal({
              title: '提示',
              content: res.data.msg,
            })
          }
        }
      })
    } else { //touristCode 不为空说明从游客端赠送的  不需要支付0.01元下载了

      wx.request({
        url: baseURL + "/api/tourist_coupon/receiving_gift_coupon",
        header: {
          'content-type': 'application/json', // 默认值
          token: app.globalData.token
        },
        data: {
          code: touristCode
        },
        method: "post",
        success(res) {
          if (res.data.error_code == 0) {
            wx.showModal({
              title: '提示',
              content: '领取成功，请点击确定按钮返回个人中心首页',
              showCancel: false,
              success(res) {
                if (res.confirm) {
                  wx.reLaunch({
                    url: '../visitorindex/visitorindex',
                  })
                }
              }
            })

          } else {
            wx.showModal({
              title: '提示',
              content: res.data.msg,
            })
          }
        }
      })
    }


  },

  goPhone(e) {
    var tel = e.currentTarget.dataset.tel;
    wx.makePhoneCall({
      phoneNumber: tel,
    })
  }
  ,
  backindex() {
    wx.redirectTo({
      url: '../visitorindex/visitorindex',
    })
  },
  // 继续分享
  onShareAppMessage() {
    var code = this.data.code;
    var touristCode = this.data.touristCode;
    var id = this.data.promotionDetailData.id;
    console.log(baseURL + '/api/share_img/coupon?id=' + id);
    if (code == '') {
      return {
        title: '抢购券转发',
        path: '/pages/loadingIndex/loadingIndex?touristCode=' + touristCode + '&type=2',
        imageUrl: baseURL + '/api/share_img/coupon?id=' + id,
        success(res) {
          console.log(res)
        }
      }
    } else {
      return {
        title: '抢购券转发',
        path: '/pages/loadingIndex/loadingIndex?code=' + code + '&type=2',
        imageUrl: baseURL + '/api/share_img/coupon?id=' + id,
        success(res) {
          console.log(res)
        }
      }
    }

  }

})