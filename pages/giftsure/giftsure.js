// pages/giftsure/giftsure.js
import {
  request
} from "../../utils/request.js";
var app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
      id:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
      var id = options.id || "";
      this.setData({
        id:id
      })
  },

  submitBtn() {

    var id = this.data.id;
    var token = app.globalData.token;

    request({
      url: "/api/home/get_banner",
      header: {
        'content-type': 'application/json', // 默认值
        token: app.globalData.token, storeId: app.globalData.storeId,
      },
      data: {
        id: id,
      }
    }).then(res => {
      //dosome
      wx.showToast({
        title: '确认成功',
        icon: 'success',
        duration: 1000,
        mask: true
      })

      setTimeout(function () {
        wx.switchTab({
          url: '../gift/gift',
        });
      }, 1000)
    })
  }
})