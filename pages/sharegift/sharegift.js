// pages/mygift/mygift.js
import {
  request,
  baseURL
} from "../../utils/request.js";
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    giftList: '',
    id: null,
    code: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var token = app.globalData.token;
    var id = options.id;
    var code = options.code;
    this.setData({
      id: id,
      code: code
    });
    request({
      url: "/api/gift/detail",
      header: {
        'content-type': 'application/json', // 默认值
        token: app.globalData.token
      },
      data: {
        id: id
      }
    }).then(res => {
      //dosome
      console.log(res);
      this.setData({
        giftList: res.data.data,
      })
    })
  },

  goGiftDetail() {
    var id = this.data.id;
    wx.navigateTo({
      url: '../giftdetail/giftdetail?id=' + id,
    })
  },

  backindex() {
    wx.redirectTo({
      url: '../visitorindex/visitorindex',
    })
  },

  //立即领取礼包
  giveIt(e) {
    var id = this.data.id;
    var code = this.data.code
    var token = app.globalData.token;
    wx.request({
      url: baseURL + "/api/gift/pre_receive",
      header: {
        'content-type': 'application/json', // 默认值
        token: app.globalData.token
      },
      method: "post",
      data: {
        id: id,
        code: code
      },
      success(res) {
        //dosome
        console.log(res);
        if (res.data.error_code == 0) {
          // wx.showModal({
          //   title: '提示',
          //   content: '领取成功，请等待商家确认返佣信息',
          //   showCancel: false,
          //   success(res) {
          //     if (res.confirm) {
          //       wx.reLaunch({
          //         url: '../visitorindex/visitorindex',
          //       })
          //     }
          //   }
          // })

          wx.showToast({
            title: '领取成功，请等待商家确认返佣信息',
            icon: 'none',
            duration: 2000,
            mask: true
          })
          setTimeout(function() {
            wx.reLaunch({
              url: '../visitorindex/visitorindex'
            })
          }, 2000)

        } else {
          wx.showToast({
            title: '领取失败',
            icon: 'success',
            duration: 1500,
            mask: true
          })
          // wx.showModal({
          //   title: '提示',
          //   content: res.data.msg,
          // })
        }
      }
    })
  },


})