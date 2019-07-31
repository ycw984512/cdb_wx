// pages/pointscharge/pointscharge.js
import { request } from "../../utils/request.js"; var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeIndex:999999,
    pointsData:[],
    activeId:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var token = app.globalData.token;

    request({
      url: "/api/integral/integral_commodity",
      header: {
        'content-type': 'application/json', // 默认值
        token: app.globalData.token, storeId: app.globalData.storeId
      },
    }).then(res => {
      //dosome
      console.log(res);
      this.setData({
        pointsData: res.data.data,
      })
    })
  },
  chooseTap(e){
    var Index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id;
    this.setData({
      activeId: id,
      activeIndex: Index
    })
  },
  submitBtn(){
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var activeId = this.data.activeId
    var token = app.globalData.token;
    if(activeId==""){
      wx.hideLoading();
      wx.showModal({
        title: '提示',
        content: '请选择需要充值的积分',
      })
    }else{
      request({
        url: "/api/integral/pay_integral",
        header: {
          'content-type': 'application/json', // 默认值
          token: app.globalData.token, storeId: app.globalData.storeId
        },
        data: {
          id: activeId,
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
                  url: '../home/home',
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
            title: res.data.msg,
          })
        }
      })
    }
  }

})