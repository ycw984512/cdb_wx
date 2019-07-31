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
    promotionDetailData: { buying_price:""},
    upload_domain: null,
    coupon_amount: null,
    code: null,
    touristCode: null,
    payMoney: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    console.log(options)
    var that = this;


    var token = app.globalData.token;

    request({
      url: "/api/config/wx_config",
      header: {
        'content-type': 'application/json', // 默认值
        token: app.globalData.token
      },

    }).then(res => {

      if (res.data.error_code == 0) {

        //dosome
        console.log(res);

        this.setData({
          upload_domain: res.data.data.upload_domain,
        })

        var code = options.code || "";
        var touristCode = options.touristCode || "";
        var token = app.globalData.token;
        var upload_domain = app.globalData.upload_domain;
        that.setData({
          upload_domain: upload_domain,
          code: code,
          touristCode: touristCode
        })

        var latitude = app.globalData.latitude;
        var longitude = app.globalData.longitude;
        var touristCode = that.data.touristCode;
        var code = that.data.code;

        if (code == "") { //说明从游客端赠送的进入领取页面
          request({
            url: "/api/tourist_coupon/gift_coupon_detail",
            header: {
              'content-type': 'application/json', // 默认值
              token: app.globalData.token
            },
            data: {
              code: touristCode,
              latitude: latitude,
              longitude: longitude,
            }
          }).then(res => {
            //dosome
            console.log(res);
            that.setData({
              promotionDetailData: res.data.data,
              coupon_amount: res.data.data.coupon_amount
            })

          })

        } else { //说明从商户端分享的进入领取页面
          request({
            url: "/api/tourist_coupon/detail",
            header: {
              'content-type': 'application/json', // 默认值
              token: app.globalData.token
            },
            data: {
              code: code,
              latitude: latitude,
              longitude: longitude,
            }
          }).then(res => {
            //dosome
            console.log(res);
            var payMoney = res.data.data.buying_price - res.data.data.coupon_amount;
            that.setData({
              promotionDetailData: res.data.data,
              coupon_amount: res.data.data.coupon_amount,
              payMoney: payMoney
            })

          })
        }

      } else {
        wx.showModal({
          title: '提示',
          content: res.data.msg,
        })
      }

    })



  },
  onShow() {},

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
      wx.showLoading({
        title: "加载中",
        mask: true
        })
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
            wx.hideLoading();
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

                  wx.showToast({
                    title: '领取成功',
                    icon: 'success',
                    duration: 1500,
                    mask: true
                  })
                  setTimeout(function () {
                    wx.reLaunch({
                      url: '../visitorindex/visitorindex'
                    })
                  }, 1500)
                  
                  // wx.showModal({
                  //   title: '提示',
                  //   content: '领取成功，请点击确定按钮返回个人中心首页',
                  //   showCancel: false,
                  //   success(res) {
                  //     if (res.confirm) {
                  //       wx.reLaunch({
                  //         url: '../visitorindex/visitorindex',
                  //       })
                  //     }
                  //   }
                  // })

                },
                fail(res) {
                  wx.hideLoading();
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

      wx.showLoading({
        title: "加载中",
        mask: true
      })
      wx.request({
        url: baseURL + "/api/tourist_coupon/receiving_gift_coupon",
        method: "POST",
        header: {
          'content-type': 'application/json', // 默认值
          token: app.globalData.token
        },
        data: {
          code: touristCode
        },

        success(res) {
          wx.hideLoading();
          if (res.data.error_code == 0) {
            wx.showToast({
              title: '领取成功',
              icon: 'success',
              duration: 1500,
              mask: true
            })
            setTimeout(function() {
              wx.reLaunch({
                url: '../visitorindex/visitorindex'
              })
            }, 1500)

            // wx.showModal({
            //   title: '提示',
            //   content: '领取成功，请点击确定按钮返回个人中心首页',
            //   showCancel: false,
            //   success(res) {
            //     if (res.confirm) {
            //       wx.reLaunch({
            //         url: '../visitorindex/visitorindex',
            //       })
            //     }
            //   }
            // })

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
  },
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