// pages/choosetemplate/choosetemplate.js
import { request } from "../../utils/request.js"; 
var app = getApp(); 

Page({

  /**
   * 页面的初始数据
   */
  data: {
      templateType:"",
      templateData:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    request({
      url: "/api/coupon/templat_list",
      header: {
        'content-type': 'application/json', // 默认值
        token: app.globalData.token, storeId: app.globalData.storeId,
      },

    }).then(res => {
      //dosome
      console.log(res);
      this.setData({
        templateData: res.data.data,
      })
    })
  },

  radioChange(e){
    console.log(e);
    this.setData({
      templateType: e.detail.value,
    })
    let pages = getCurrentPages();//当前页面栈
    let prevPage = pages[pages.length - 2];//上一页面
    prevPage.setData({
      //直接给上移页面赋值
      template_id: e.detail.value
    });

    wx.navigateBack({
      delta: 1
    })

  }
})