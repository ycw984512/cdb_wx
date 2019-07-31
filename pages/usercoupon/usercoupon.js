// pages/mycode/mycode.js
import { request } from "../../utils/request.js";
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    codeData: null,
    upload_domain: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    var upload_domain = app.globalData.upload_domain; this.setData({ upload_domain: app.globalData.upload_domain, })
    var token = app.globalData.token;

    request({
      url: "/api/tourist_coupon/write_off_detail",
      header: {
        'content-type': 'application/json', // 默认值
        token: app.globalData.token
      },
      data:{
        id:id
      }
    }).then(res => {
      //dosome
      console.log(res);
      this.setData({
        codeData: res.data.data,
      })
    })
  },
  goUsefulCoupon(){
    wx.navigateTo({
      url: '../usefulcoupon/usefulcoupon',
    })
  }
})