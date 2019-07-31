// pages/marketcenter/marketcenter.js
import {
  request
} from "../../utils/request.js";
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allData: [],
    page: 1,
    list_rows: 15
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.loadmovies()
  },

  loadmovies() {
    var {
      page,
      list_rows
    } = this.data;
    var token = app.globalData.token;
    request({
      url: "/api/user/withdrawal_record",
      header: {
        'content-type': 'application/json', // 默认值
        token: app.globalData.token, storeId: app.globalData.storeId,
      },
      data: {
        page,
        list_rows
      }
    }).then(res => {
      //dosome
      console.log(res.data.data.data);
      console.log(this);
      var allData = this.data.allData.concat(res.data.data.data)
      this.setData({
        allData: allData,
      })
    })

  },
  onReachBottom() {
    this.setData({
      page: this.data.page + 1
    })
    this.loadmovies();
  },



  onPullDownRefresh: function() {
    const page = this.data.page;
    this.setData({
      page: 1,
      allData: []
    })
    this.loadmovies();
    wx.stopPullDownRefresh();
  },
})