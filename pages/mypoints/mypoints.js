// pages/mypoints/mypoints.js
import { request } from "../../utils/request.js"       
Page({

  /**
   * 页面的初始数据
   */
  data: {
    integral:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var integral = options.integral;
    this.setData({
      integral: integral
    })
  },

  recharge(e){
    wx.navigateTo({
      url: '../pointscharge/pointscharge'
    })
  }
,
  lookPoints(e){
    var integral = this.data.integral
    wx.navigateTo({
      url: '../mypointsdetail/mypointsdetail?integral=' + integral,
    })
  }
})