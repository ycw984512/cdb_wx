// pages/pointscharge/pointscharge.js
import { request } from "../../utils/request.js"; var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

    moneyValue:"",

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
 
  },
  moneyInput(e){
    var moneyValue = e.detail.value;
    this.setData({
      moneyValue
    })
  },
  submitBtn() {

    var token = app.globalData.token;
    var moneyValue = this.data.moneyValue;
    if (moneyValue <= 0){
      wx.showModal({
        title: '提示',
        content: '充值金额需要大于0',
      })
    } else if (moneyValue > 99999999) {
      wx.showModal({
        title: '提示',
        content: '充值金额不能超过99999999',
      })
    } else {
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      request({
        url: "/api/user/pay_balance",
        header: {
          'content-type': 'application/json', // 默认值
          token: app.globalData.token, storeId: app.globalData.storeId,
        },
        data: {
          amount: moneyValue,
        }
      }).then(res => {
        //dosome
        console.log(res);
        if (res.data.error_code == 0) {
          wx.hideLoading();
          wx.requestPayment({
            timeStamp: res.data.data.wx_pay.timeStamp,
            nonceStr: res.data.data.wx_pay.nonceStr,
            package: res.data.data.wx_pay.package,
            paySign: res.data.data.wx_pay.paySign,
            signType: "MD5",
            success(res) {
              wx.showToast({
                title: '充值成功',
                mask: true,
                duration: 1000
              })
              setTimeout(function () {
                wx.reLaunch({
                  url: '../mywallet/mywallet',
                });
              }, 1000)
            },
            fail(res) {
              wx.hideLoading();
            },
            complete(res) {

            }
          })
        } else {
          wx.hideLoading();
          wx.showToast({
            icon:"none",
            title: res.data.msg,
          })
        }
      })
    }
  }

})