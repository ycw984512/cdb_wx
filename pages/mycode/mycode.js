// pages/mycode/mycode.js
import { request } from "../../utils/request.js"   ;
var app = getApp();        
Page({

  /**
   * 页面的初始数据
   */
  data: {
      codeData:null,
    upload_domain: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var upload_domain = app.globalData.upload_domain ;           this.setData({ upload_domain: app.globalData.upload_domain, })
    var token = app.globalData.token;

    request({
      url: "/api/user/extension_code",
      header: {
        'content-type': 'application/json', // 默认值
        token: app.globalData.token
      },
    }).then(res => {
      //dosome
      console.log(res);
      this.setData({
        codeData: res.data.data,
      })
    })
  },

})