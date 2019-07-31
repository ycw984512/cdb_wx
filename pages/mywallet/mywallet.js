import {
  request
} from "../../utils/request.js";
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allData: "",
    money: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  onShow(){
    var token = app.globalData.token;

    request({
      url: "/api/user/userinfo",
      header: {
        'content-type': 'application/json', // 默认值
        token: app.globalData.token, storeId: app.globalData.storeId
      },
    }).then(res => {
      //dosome
      console.log(res);
      this.setData({
        money: res.data.data.balance,
      })
    })

  },
  //点击提现按钮
  cash_money(){
    wx.navigateTo({
      url: '../cashpage/cashpage',
    })

  }
  ,
  //点击充值按钮
  charge_money(){
    wx.navigateTo({
      url: '../moneycharge/moneycharge',
    })
  },
  goType(e) {
    var type = e.currentTarget.dataset.type;
    if (type == 1) {
      wx.navigateTo({
        url: '../listcz/listcz',
      })
    } else if (type == 2) {
      wx.navigateTo({
        url: '../listtx/listtx',
      })
    } else if (type == 3) {
      wx.navigateTo({
        url: '../listfl/listfl',
      })
    } else if (type == 4) {
      wx.navigateTo({
        url: '../listkf/listkf',
      })
    } 
  }
  ,


})