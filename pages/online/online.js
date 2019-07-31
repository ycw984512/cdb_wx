var app = getApp();
import {
  request
} from "../../utils/request.js";
Page({
  data: {},

  tel: function() {
    var tel = app.globalData.platform_phone;
    wx.makePhoneCall({
      phoneNumber: tel
    })
  },
  goSug() {
    wx.navigateTo({
      url: '../proposesuggest/proposesuggest',
    })
  },
  goHelp() {
    wx.navigateTo({
      url: '../helpcenter/helpcenter',
    })
  },
  onLoad: function(n) {

  },
  // onShareAppMessage: function () {
  //   var fximgs = wx.getStorageSync("fximgs");
  //   console.log(fximgs);
  //   if (fximgs != '') {
  //     return {
  //       title: '充店宝',
  //       path: `/zh_zbkq/pages/index/index`,
  //       imageUrl: fximgs
  //     }
  //   } else if (fximgs == '') {
  //     return {
  //       title: '充店宝',
  //       path: `zh_zbkq/pages/index/index`,
  //     }
  //   }
  // },
});