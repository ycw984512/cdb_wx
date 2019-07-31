// pages/minePage/minePage.js
import { request } from "../../utils/request.js";   
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // userTitle: '点击登录',
    // userHead: '../../res/images/ic_mine_normal.png',
    shownavindex: 1,
    priceL2H: true,
    loadenable: true,
    avatarUrl: '',
    nickName: '未知',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    balance:0,
    integral:0,
    storeId:""

  },

  goType(e){
    var type = e.currentTarget.dataset.type;
    if(type==1){
      wx.navigateTo({
        url: '../mycoupons/mycoupons',
      })
    } else if (type == 2){
      wx.navigateTo({
        url: '../mycode/mycode',
      })
    } else if (type == 3 ){
      wx.navigateTo({
        url: '../mycollection/mycollection',
      })
    } else if (type == 4) {
      wx.navigateTo({
        url: '../addperson/addperson',
      })
    } else if (type == 5) {
      wx.navigateTo({
        url: '../mystore/mystore',
      })
    } else if (type == 6) {
      wx.navigateTo({
        url: '../storedata/storedata',
      })
    } else if (type == 7) {
      wx.navigateTo({
        url: '../marketcenter/marketcenter',
      })
    } else if (type == 8) {
      wx.navigateTo({
        url: '../proposesuggest/proposesuggest',
      })
    } else if (type == 9) {
      wx.navigateTo({
        url: '../helpcenter/helpcenter',
      })
    } else if (type == 10) {
      wx.navigateTo({
        url: '../online/online',
      })
    } else if (type == 11) {
      app.globalData.storeId = "";
      wx.reLaunch({
        url: '../visitorindex/visitorindex',
      })
    } else if (type == 12) {
      wx.navigateTo({
        url: '../mycodedetail/mycodedetail',
      })
    } 
  }
,
  goMyPoints(){
    var integral = this.data.integral
    wx.navigateTo({
      url: '../mypoints/mypoints?integral='+integral
    })

  },
  
  goMyWallet(){
    wx.navigateTo({
      url: '../mywallet/mywallet',
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 查看是否授权
    wx.getSetting({
      success: (res) => {
        console.log(res);
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: (res) => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                nickName: res.userInfo.nickName,
                canIUse: false
              });
            }
          })
        }
      }
    })

    var storeId = app.globalData.storeId;
    this.setData({
      storeId: storeId
    })
  },
  onShow(){
    var token = app.globalData.token;

    request({
      url: "/api/user/userinfo",
      header: {
        'content-type': 'application/json', // 默认值
        token: app.globalData.token, storeId: app.globalData.storeId,
      }
    }).then(res => {
      //dosome
      console.log(res);
      this.setData({
        balance: res.data.data.balance,
        integral: res.data.data.integral,
      })

    })
  },
  bindGetUserInfo: function (e) {
    this.setData({
      avatarUrl: e.detail.userInfo.avatarUrl,
      nickName: e.detail.userInfo.nickName,
      canIUse: false
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
      console.log(111)
  },



  // loginTap: function () {
  //   var that = this;
  //   if (!isLoginSuccess) {
  //     wx.showLoading({
  //       title: '正在登录...',
  //     })
  //     // 登录
  //     wx.login({
  //       success: res => {
  //         // 发送 res.code 到后台换取 openId, sessionKey, unionId
  //       }
  //     })
  //     // 获取用户信息
  //     wx.getSetting({
  //       success: res => {
  //         wx.hideLoading();
  //         if (res.authSetting['scope.userInfo']) {
  //           // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
  //           wx.getUserInfo({
  //             success: res => {
  //               // 可以将 res 发送给后台解码出 unionId
  //               app.globalData.userInfo = res.userInfo

  //               // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
  //               // 所以此处加入 callback 以防止这种情况
  //               if (app.userInfoReadyCallback) {
  //                 app.userInfoReadyCallback(res)
  //               }
  //               that.initLoginMsg();
  //             },
  //             fail: res => {
  //               wx.hideLoading();
  //               isLoginSuccess = false;
  //               that.setData({
  //                 userTitle: '点击登录',
  //                 userHead: '../../static/images/ic_mine_normal.png'
  //               })
  //             }
  //           })
  //         }
  //       }
  //     })
  //   }
  // },

  // initLoginMsg: function () {
  //   if (app.globalData.userInfo) {
  //     isLoginSuccess = true;
  //     this.setData({
  //       userHead: app.globalData.userInfo.avatarUrl,
  //       userTitle: '尊贵的，' + app.globalData.userInfo.nickName
  //     })
  //   } else if (this.data.canIUse) {
  //     // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
  //     // 所以此处加入 callback 以防止这种情况
  //     isLoginSuccess = true;
  //     app.userInfoReadyCallback = res => {
  //       this.setData({
  //         userHead: res.userInfo.avatarUrl,
  //         userTitle: '尊贵的，' + res.userInfo.nickName
  //       })
  //     }
  //   } else {
  //     // 在没有 open-type=getUserInfo 版本的兼容处理
  //     wx.getUserInfo({
  //       success: res => {
  //         isLoginSuccess = true;
  //         app.globalData.userInfo = res.userInfo
  //         this.setData({
  //           userHead: res.userInfo.avatarUrl,
  //           userTitle: '尊贵的，' + res.userInfo.nickName
  //         })
  //       },
  //       fail() {
  //         isLoginSuccess = false;
  //         this.setData({
  //           userTitle: '点击登录',
  //           userHead: '../../static/images/ic_mine_normal.png'
  //         })
  //       }
  //     })
  //   }
  // },

})