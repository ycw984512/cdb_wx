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
    list_rows: 5
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadmovies()
  },

  loadmovies() {
    var {
      page,
      list_rows
    } = this.data;
    var token = app.globalData.token;
    request({
      url: "/api/store/marketing_center",
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
      console.log(res);
      this.setData({
        allData: res.data.data.data,
      })
    })

  },
  onReachBottom() {
    this.setData({
      page: this.data.page + 1
    })
    this.loadmovies();
  },

  "enablePullDownRefresh": true,

  onPullDownRefresh: function () {
    const page = this.data.page;
    this.setData({
      page: 1,
      allData: []
    })
    this.loadmovies();
  },
})