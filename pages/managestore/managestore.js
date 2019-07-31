// pages/managestore/managestore.js

import {
  request
} from "../../utils/request.js";
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    list_rows: 999,
    allDate: null,
    upload_domain: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var upload_domain = app.globalData.upload_domain;
    this.setData({
      upload_domain: app.globalData.upload_domain,
    });
    var token = app.globalData.token;
    var {
      page,
      list_rows
    } = this.data;
    request({
      url: "/api/user/get_store_list",
      header: {
        'content-type': 'application/json', // 默认值
        token: app.globalData.token
      },
      data: {
        page: page,
        list_rows
      }
    }).then(res => {

      if (res.data.error_code == 0) {

        //dosome
        console.log(res);

        this.setData({
          allDate: res.data.data.data,
        })

      } else {
        wx.showModal({
          title: '提示',
          content: res.data.msg,
        })
      }

    })

  },

  goStore(e) {
    var id = e.currentTarget.dataset.id;
    app.globalData.storeId = id;
    wx.reLaunch({
      url: '../index/index',
    })
  },

})