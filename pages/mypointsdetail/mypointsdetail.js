import { request } from "../../utils/request.js";
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    integral: "",
    page:1,
    list_rows:15,
    pointsData:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var integral = options.integral;
    this.setData({
      integral: integral
    })
this.loadmovies();

  },




  loadmovies() {
    const {
      page,
      list_rows,
    } = this.data;
    var token = app.globalData.token;

    request({
      url: `/api/user/integral_record`,
      data: {
        page: page,
        list_rows: list_rows,
      },
      header: {
        'content-type': 'application/json', // 默认值
        token: app.globalData.token
      },

    }).then(res => {
      const data = res.data.data.data;
      const pointsData = this.data.pointsData;
      console.log(pointsData);
      console.log(data);
      pointsData.push(...data);
      this.setData({
        pointsData: pointsData
      })

    })

  },

  onReachBottom() {
    this.setData({
      page: this.data.page + 1
    })
    this.loadmovies();
  },

})