// pages/minePage/minePage.js
import {
  request
} from "../../utils/request.js";
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
    // canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUse: false,
    balance: 0,
    integral: 0

  },

  goType(e) {
    var type = e.currentTarget.dataset.type;
    if (type == 1) {
      wx.navigateTo({
        url: '../setinfo/setinfo',
      })
    } else if (type == 2) {
      wx.navigateTo({
        url: '../mywallet/mywallet',
      })
    } else if (type == 3) {
      wx.navigateTo({
        url: '../proposesuggest/proposesuggest',
      })
    } else if (type == 4) {
      wx.navigateTo({
        url: '../online/online',
      })
    } else if (type == 6) {
      wx.navigateTo({
        url: '../managestore/managestore',
      })
    }else if (type == 5) {

      wx.showLoading({
        title: '正在加载',
      })

      var that = this;
      // 获取用户信息
      wx.getUserInfo({
        success: res => {
          // 可以将 res 发送给后台解码出 unionId
          var userInfo = res.userInfo
          // 由于 getUserInfo 是网络请求，所以网络慢的情况下会加载的时间长一点
          // 登录
          wx.login({
            success: res => {
              if (res.code) {
                // 发送 res.code ,昵称和头像到后台地址换取 token
                var code = res.code;
                var avatarUrl = userInfo.avatarUrl;
                var nickName = userInfo.nickName;
                console.log(code);
                request({
                  method: "post",
                  url: "/api/token/user",
                  data: {
                    code: code,
                    picture: avatarUrl,
                    name: nickName
                  }
                }).then(res => {
                  console.log(res);
                  app.globalData.token = res.data.data.token;
                  app.globalData.is_store = res.data.data.is_store;
                  wx.setStorageSync('token', res.data.data.token);

                  console.log(res.data.data.is_store)

                  if (res.data.data.is_store == 1) {
                    wx.switchTab({
                      url: '../index/index'
                    })
                  } else if (res.data.data.is_store == 0) {

                    wx.hideLoading();

                    wx.showToast({
                      title: '请先入住成为商户，才可进入商户端',
                      icon: 'none',
                      duration: 2000,
                      mask: true
                    })
      
                    
                    // wx.showModal({
                    //   title: '提示',
                    //   content: "请先入驻成为商户，才可进入商户端!"+"",
                    // });
             
                  }

                })
              } else {
                console.log('登录失败！' + res.errMsg)
              }
            }
          })
        },
        fail(err) {
          console.log(err)
        }
      })

      // var is_store = app.globalData.is_store; 

      // console.log(is_store)    
      // if(is_store==1){
      //   wx.reLaunch({
      //     url: '../loadingIndex/loadingIndex',
      //   })
      // }else{
      //   wx.showModal({
      //     title: '提示',
      //     content: '请先入驻成为商户，才可进入商户端!',
      //   })
      // }
    }
  },
  goVisIndex() {
    wx.redirectTo({
      url: '../visitorindex/visitorindex',
    })
  }

  ,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
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
        } else {
          this.setData({
            canIUse: true
          });
        }
      }
    })
  },
  bindGetUserInfo: function(e) {
    this.setData({
      avatarUrl: e.detail.userInfo.avatarUrl,
      nickName: e.detail.userInfo.nickName,
      canIUse: false
    })
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