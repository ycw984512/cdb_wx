// pages/searchHotel/searchHotel.js
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk = new QQMapWX({
  key: 'C5JBZ-NHXW3-VBI33-3COH5-JJDLH-HTFSK'
});
import {
  request, baseURL
} from "../../utils/request.js";

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // stateList: [
    //   "可使用", "已使用", "已过期", "待支付"
    // ],
    stateList: [
      "可使用", "已使用", "已过期",
    ],
    selectedIndex: 0,
    latitude: null,
    longitude: null,
    upload_domain: null,
    token: null,
    userPage: 1,
    userLimit: 999,
    userData: [],
    havePage: 1,
    haveLimit: 999,
    haveData: [],
    overPage: 1,
    overLimit: 999,
    overData: [],
    // payPage: 1,
    // payLimit: 10,
    // payData: [],
  
    shareNumber: 1,
    shareNumberId: undefined,
    shareNumFlag: true,
    shareNumberValue: 1,
    shareFlag: true,
    code: null,
    store_name: undefined
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(app.getToken());
    var upload_domain = app.globalData.upload_domain; this.setData({ upload_domain: app.globalData.upload_domain, });
    var that = this;

    var latitude = app.globalData.latitude; var longitude = app.globalData.longitude;
        that.setData({
          latitude: latitude,
          longitude: longitude,
          userPage: 1,
          userLimit: 5,
          userData: [],
          havePage: 1,
          haveLimit: 5,
          haveData: [],
          overPage: 1,
          overLimit: 5,
          overData: []
        })
        that.loadUserlist();
        that.loadHavelist();
        that.loadOverlist();
   

  },

  //去地址显示页面
  locationTap: function () {
    wx.navigateTo({
      url: '../select_city/select_city?city=' + this.data.city
    })
  },

  //二维码扫描
  saoCode() {
    wx.scanCode({
      success(res) {
        console.log(res);
      }
    })
  },

  //tab页交互
  turnPage: function (e) {
    var that = this;
    var dataIndex = e.currentTarget.dataset.index;
    if (this.data.selectedIndex != dataIndex) {
      // this.setData({
      //   selectedIndex: dataIndex
      // });
      if (dataIndex == 0) {
        // 获取店铺促销券列表数据
        this.setData({
          selectedIndex: dataIndex,
          userPage: 1,
          userData: [],
          havePage: 1,
          haveData: [],
          overPage: 1,
          overData: [],
          // payPage: 1,
          // payData: [],
        })
        this.loadUserlist();
      } else if (dataIndex == 1) {
        this.setData({
          selectedIndex: dataIndex,
          userPage: 1,
          userData: [],
          havePage: 1,
          haveData: [],
          overPage: 1,
          overData: [],
          // payPage: 1,
          // payData: [],
        })
        this.loadHavelist();
      } else if (dataIndex == 2) {
        // 获取店铺促销券列表数据
        this.setData({
          selectedIndex: dataIndex,
          userPage: 1,
          userData: [],
          havePage: 1,
          haveData: [],
          overPage: 1,
          overData: [],
          // payPage: 1,
          // payData: [],
        })
        this.loadOverlist();
      } 
  // 获取店铺促销券列表数据
      // else if (dataIndex == 3) {

      //   this.setData({
      //     selectedIndex: dataIndex,
      //     userPage: 1,
      //     userData: [],
      //     havePage: 1,
      //     haveData: [],
      //     overPage: 1,
      //     overData: [],
      //     payPage: 1,
      //     payData: [],
      //   })
      //   this.loadPaylist();
      // }

    }
  },

  //游客端跳转我的
  goVisMy() {
    wx.redirectTo({
      url: '../visitormy/visitormy',
    })
  }
  ,

  //可使用的数据请求
  loadUserlist() {
    const { userPage, userLimit, longitude, latitude } = this.data;
    var token = app.globalData.token;
    request({
      url: `/api/user/my_coupon`,
      data: {
        page: userPage,
        list_rows: userLimit,
        type: 1, longitude, latitude
      },
      header: {
        'content-type': 'application/json', // 默认值
        token: token
      },
    }).then(res => {
      //dosome
      console.log(res.data.data.data);
      var userData = this.data.userData.concat(res.data.data.data);
      this.setData({
        userData: userData
      })
    })

  },

  //已使用的数据请求
  loadHavelist() {
    const { havePage, haveLimit, longitude, latitude } = this.data;
    var token = app.globalData.token;
    request({
      url: `/api/user/my_coupon`,
      data: {
        page: havePage,
        list_rows: haveLimit,
        type: 2, longitude, latitude
      },
      header: {
        'content-type': 'application/json', // 默认值
        token: token
      },
    }).then(res => {
      //dosome
      console.log(res.data.data.data);
      var haveData = this.data.haveData.concat(res.data.data.data);
      this.setData({
        haveData: haveData
      })
    })

  },
  //已过期的数据请求
  loadOverlist() {
    const { overPage, overLimit, longitude, latitude } = this.data;
    var token = app.globalData.token;
    request({
      url: `/api/user/my_coupon`,
      data: {
        page: overPage,
        list_rows: overLimit,
        type: 3, longitude, latitude
      },
      header: {
        'content-type': 'application/json', // 默认值
        token: token
      },
    }).then(res => {
      //dosome
      console.log(res.data.data.data);
      var overData = this.data.overData.concat(res.data.data.data);
      this.setData({
        overData: overData
      })
    })

  },

  //待支付的数据请求
    // loadPaylist() {
    //   const { payPage, payLimit, longitude, latitude } = this.data;
    //   var token = app.globalData.token;
    //   request({
    //     url: `/api/user/my_coupon`,
    //     data: {
    //       page: payPage,
    //       list_rows: payLimit,
    //       type: 4, longitude, latitude
    //     },
    //     header: {
    //       'content-type': 'application/json', // 默认值
    //       token: token
    //     },
    //   }).then(res => {
    //     //dosome
    //     console.log(res.data.data.data);
    //     var payData = this.data.payData.concat(res.data.data.data);
    //     this.setData({
    //       payData: payData
    //     })
    //   })

    // },
  //下拉加载
  onReachBottom() {
    if (this.data.selectedIndex == 0) {
      const userPage = this.data.userPage;
      this.setData({
        userPage: userPage + 1
      })
      this.loadUserlist();
    } else if (this.data.selectedIndex == 1) {
      const havePage = this.data.havePage;
      this.setData({
        havePage: havePage + 1
      })
      this.loadHavelist();
    } else if (this.data.selectedIndex == 2) {
      const overPage = this.data.overPage;
      this.setData({
        overPage: overPage + 1
      })
      this.loadOverlist();
    } else if (this.data.selectedIndex == 4) {
      const payPage = this.data.payPage;
      this.setData({
        payPage: payPage + 1
      })
      this.loadPaylist();
    }
  },

  //立即使用
  userd(e) {
    var id = e.currentTarget.dataset.id;
    var time = new Date(e.currentTarget.dataset.time).getTime();
    var date = new Date();
    var nowTime = date.getTime();
    console.log(time, nowTime)
    console.log(new Date(time), new Date(nowTime))
    if (nowTime >= time) {
      wx.navigateTo({
        url: '../usercoupon/usercoupon?id=' + id,
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '该优惠券使用时间还未开始',
      })
    }
  },


  //删除卡券
  removeCoupon(e) {
    var id = e.currentTarget.dataset.id;
    var token = app.globalData.token;
    request({
      url: "/api/user/del_coupon",
      header: {
        'content-type': 'application/json', // 默认值
        token: app.globalData.token
      },
      data: {
        id: id
      }
    }).then(res => {
      //dosome
      if (res.data.error_code == 0) {
        wx.showToast({
          title: '删除成功',
          icon: 'success',
          duration: 1000,
          mask: true
        })

        setTimeout(function () {
          wx.redirectTo({
            url: '../visitorindex/visitorindex',
          });
        }, 1000)

      } else { wx.showModal({ title: '提示', content: res.data.msg, }) }
    })


  },

  //立即支付
  payCoupon(e) {
    var id = e.currentTarget.dataset.id;
    var token = app.globalData.token;

    request({
      url: "/api/tourist_coupon/pay_couponr_residual_amount",
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
      if (res.data.error_code == 0) {
        wx.requestPayment({
          timeStamp: res.data.data.wx_pay.timeStamp,
          nonceStr: res.data.data.wx_pay.nonceStr,
          package: res.data.data.wx_pay.package,
          paySign: res.data.data.wx_pay.paySign,
          signType: "MD5",
          success(res) {
            wx.showModal({
              title: '提示',
              content: '支付成功',
              showCancel: false,
              success(res) {
                if (res.confirm) {
                  wx.reLaunch({
                    url: '../visitorindex/visitorindex',
                  })
                }
              }
            })

          },
          fail(res) {
            console.log(res)
          },
          complete(res) {
            console.log(res)
          }
        })

      } else {
        wx.showModal({
          title: '提示',
          content: res.data.msg,
        })
      }
    })


  }
,


  //转赠好友

  //分享卡券

  shareNumberTap(e) {
    var id = e.currentTarget.dataset.couponid;
    var store_name = e.currentTarget.dataset.store_name;
    this.setData({
      shareNumberId: id,
      shareNumFlag: false,
      store_name:store_name
    })
  },

  listerShareNumber(e) {
    this.setData({
      shareNumberValue: e.detail.value
    })
  },


  shareNumberquxiao() {
    this.setData({
      shareNumFlag: true,

    })
  },

  shareNumberqueren() {
    var token = app.globalData.token;
    var id = this.data.shareNumberId;
    var shareNumber = this.data.shareNumberValue;

    request({
      url: "/api/tourist_coupon/gift_coupon",
      data: {
        id: id,
        num: shareNumber,
      },
      header: {
        'content-type': 'application/json', // 默认值
        token: app.globalData.token
      },
    }).then(res => {

      if (res.data.error_code == 0) {
        var code = res.data.data.code;
        console.log(code);
        this.setData({
          shareNumFlag: true,
          shareNumberValue: 1,
          shareFlag: false,
          code: code
        })

      } else { wx.showModal({ title: '提示', content: res.data.msg, }) }

    })
  },

  sharequxiao() {
    // this.setData({
    //   shareFlag: true,
    // })
    var code = this.data.code; //code
    request({
      url: "/api/tourist_coupon/release_gift_coupon",
      data: {
        code: code,
      },
      header: {
        'content-type': 'application/json', // 默认值
        token: app.globalData.token,
      },
    }).then(res => {

      if (res.data.error_code == 0) {

        this.setData({
          shareFlag: true,
        })

        wx.showToast({
          title: '取消成功',
        })
      } else {
        this.setData({
          shareFlag: true,
        })
        wx.showModal({
          title: '提示',
          content: res.data.msg,
        })
      }

    })
  }
  ,
  onShareAppMessage(e) {
    this.setData({
      shareFlag: true,
      shareNumberValue: 1
    })
    console.log(e);
    if (e.from == "button") {
      var code = this.data.code;
      var id = this.data.shareNumberId;
      var store_name = this.data.store_name;
      console.log(code)
      console.log(baseURL + '/api/share_img/coupon?id=' + id)
      return {
        title: '抢购券转发',
        path: '/pages/loadingIndex/loadingIndex?touristCode=' + code + '&type=2',
        imageUrl: baseURL + '/api/share_img/coupon?id=' + id,
        success(res) {
          console.log(res)
        }
      }

    }

  }
})