// pages/addpersonindex/addpersonindex.js
import {
  request
} from "../../utils/request.js";
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    key: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var key = options.key || "";
      this.setData({
        key: key,
      });
  },

  submitBtn() {
    var token = app.globalData.token;
    var storeId = app.globalData.storeId;
    var key = this.data.key;
    request({
      url: "/api/store_staff/add_staff",
      header: {
        'content-type': 'application/json', // 默认值
        token: app.globalData.token, storeId: storeId 
      },
      data: {
        key: key,
      }
    }).then(res => {
      if (res.data.error_code == 0) { 
        wx.showToast({
          title: '添加成功',
          icon: 'success',
          duration: 1000,
          mask: true
        })

        setTimeout(function () {
          wx.switchTab({
            url: '../visitorindex/visitorindex',
          });
        }, 1000)

      } else { wx.showModal({ title: '提示', content: res.data.msg, }) }



    })
  }

})