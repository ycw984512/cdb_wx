// pages/haspublicpromotion/haspublicpromotion.js
import {
  request
} from "../../utils/request.js"
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    upload_domain: null,
    page: 1,
    list_rows: 10,
    proCouponData: [],
    flag: true,
    addNumber: 1,
    addNumberId: undefined,
    addNumFlag: true,
    addNumberValue: 1,
    addNumberConId: undefined,
    coupon_release_integral: null,
    all_integral: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var upload_domain = app.globalData.upload_domain;
    var coupon_release_integral = app.globalData.coupon_release_integral;
    this.setData({
      upload_domain: app.globalData.upload_domain,
      coupon_release_integral: coupon_release_integral
    });
    this.loadmovies();
  },


  loadmovies() {
    const {
      page,
      list_rows,
    } = this.data;
    var token = app.globalData.token;

    request({
      url: `/api/coupon/my_release_coupon`,
      data: {
        page: page,
        list_rows: list_rows,
        type: 2,
      },
      header: {
        'content-type': 'application/json', // 默认值
        token: app.globalData.token,
        storeId: app.globalData.storeId,
      },

    }).then(res => {
      if (res.data.error_code == 0) {

        const data = res.data.data.data;
        const proCouponData = this.data.proCouponData;
        console.log(proCouponData);
        proCouponData.push(...data);
        this.setData({
          proCouponData: proCouponData
        })
      } else {
        wx.showModal({
          title: '提示',
          content: res.data.msg,
        })
      }


    })

  },

  onReachBottom() {
    this.setData({
      page: this.data.page + 1
    })
    this.loadmovies();
  },

  onPullDownRefresh: function() {
    const page = this.data.page;
    this.setData({
      page: 1,
      proCouponData: []
    })
    this.loadmovies();
    wx.stopPullDownRefresh();
  },

  //提交审核
  immediateCheck(e) {
    var that = this;
    var token = app.globalData.token;
    var id = e.currentTarget.dataset.id;
    request({
      url: "/api/coupon/update_state",
      data: {
        id: id,
        type: 4
      },
      header: {
        'content-type': 'application/json', // 默认值
        token: app.globalData.token,
        storeId: app.globalData.storeId,
      },
    }).then(res => {
      if (res.data.error_code == 0) {

        wx.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 1000
        })
        setTimeout(function() {
          wx.redirectTo({
            url: '../haspublicpromotion/haspublicpromotion',
          })
        }, 1000)
      } else {
        wx.showModal({
          title: '提示',
          content: res.data.msg,
        })
      }

    })
  },

  //撤回申请
  withdraw(e) {
    var that = this;
    var token = app.globalData.token;
    var id = e.currentTarget.dataset.id;
    request({
      url: "/api/coupon/update_state",
      data: {
        id: id,
        type: 1
      },
      header: {
        'content-type': 'application/json', // 默认值
        token: app.globalData.token,
        storeId: app.globalData.storeId,
      },
    }).then(res => {

      if (res.data.error_code == 0) {

        wx.showToast({
          title: '撤回成功',
          icon: 'success',
          duration: 1000
        })
        setTimeout(function() {
          wx.redirectTo({
            url: '../haspublicpromotion/haspublicpromotion',
          })
        }, 1000)
      } else {
        wx.showModal({
          title: '提示',
          content: res.data.msg,
        })
      }

    })
  },

  //立即发布
  listerInput(e) {

    var all_integral = this.data.all_integral;
    var coupon_release_integral = this.data.coupon_release_integral;
    all_integral = coupon_release_integral * Number(e.detail.value)
    this.setData({
      addNumber: e.detail.value,
      all_integral: all_integral
    })
  },

  immediatePublic(e) {
    var all_integral = this.data.all_integral;
    var coupon_release_integral = this.data.coupon_release_integral;
    var addNumber = this.data.addNumber;
    all_integral = coupon_release_integral * Number(addNumber);
    var id = e.currentTarget.dataset.id;
    this.setData({
      addNumberId: id,
      flag: false,
      all_integral: all_integral
    })
  },
  quxiao() {
    this.setData({
      flag: true,
      addNumber: 1
    })
  },

  queren(e) {
    var that = this;
    var token = app.globalData.token;
    var id = this.data.addNumberId;
    var number = this.data.addNumber;
    request({
      url: "/api/coupon/update_state",
      data: {
        id: id,
        type: 2,
        num: number
      },
      header: {
        'content-type': 'application/json', // 默认值
        token: app.globalData.token,
        storeId: app.globalData.storeId,
      },
    }).then(res => {

      if (res.data.error_code == 0) {

        this.setData({
          flag: true
        })

        wx.showToast({
          title: '发布成功',
          icon: 'success',
          duration: 1000
        })
        setTimeout(function() {
          wx.redirectTo({
            url: '../haspublicpromotion/haspublicpromotion',
          })
        }, 1000)

      } else {
        wx.showModal({
          title: '提示',
          content: res.data.msg,
        })
      }


    })
  },

  //增加数量
  //增加数量
  listerAddNumber(e) {
    var all_integral = this.data.all_integral;
    var coupon_release_integral = this.data.coupon_release_integral;
    all_integral = coupon_release_integral * Number(e.detail.value)
    this.setData({
      addNumberValue: e.detail.value,
      all_integral: all_integral
    })
  },

  addNumberTap(e) {
    var id = e.currentTarget.dataset.id;
    var addNumberValue = this.data.addNumberValue;
    var coupon_release_integral = this.data.coupon_release_integral;
    var all_integral = this.data.all_integral;
    all_integral = coupon_release_integral * Number(addNumberValue)
    this.setData({
      addNumberConId: id,
      addNumFlag: false,
      all_integral: all_integral
    })
  },
  addNumberquxiao() {
    this.setData({
      addNumFlag: true,
      addNumberValue: 1
    })
  },

  addNumberqueren(e) {
    var that = this;
    var token = app.globalData.token;
    var id = this.data.addNumberConId;
    var number = this.data.addNumberValue;
    request({
      url: "/api/coupon/add_num",
      data: {
        id: id,
        num: number
      },
      header: {
        'content-type': 'application/json', // 默认值
        token: app.globalData.token,
        storeId: app.globalData.storeId,
      },
    }).then(res => {
      if (res.data.error_code == 0) {


        this.setData({
          flag: true
        })

        wx.showToast({
          title: '增加成功',
          icon: 'success',
          duration: 1000
        })
        setTimeout(function() {
          wx.redirectTo({
            url: '../haspublicpromotion/haspublicpromotion',
          })
        }, 1000)
      } else {
        wx.showModal({
          title: '提示',
          content: res.data.msg,
        })
      }

    })
  },

  //重新发布
  repeatPublic(e) {
    var that = this;
    var token = app.globalData.token;
    var id = e.currentTarget.dataset.id;
    request({
      url: "/api/coupon/update_state",
      data: {
        id: id,
        type: 6
      },
      header: {
        'content-type': 'application/json', // 默认值
        token: app.globalData.token,
        storeId: app.globalData.storeId,
      },
    }).then(res => {

      if (res.data.error_code == 0) {

        wx.showToast({
          title: '重新发布成功',
          icon: 'success',
          duration: 1000
        })
        setTimeout(function() {
          wx.redirectTo({
            url: '../haspublicpromotion/haspublicpromotion',
          })
        }, 1000)
      } else {
        wx.showModal({
          title: '提示',
          content: res.data.msg,
        })
      }


    })
  },
  //立即下架
  immediateLower(e) {
    var that = this;
    var token = app.globalData.token;
    var id = e.currentTarget.dataset.id;
    request({
      url: "/api/coupon/update_state",
      data: {
        id: id,
        type: 3
      },
      header: {
        'content-type': 'application/json', // 默认值
        token: app.globalData.token,
        storeId: app.globalData.storeId,
      },
    }).then(res => {

      if (res.data.error_code == 0) {

        wx.showToast({
          title: '下架成功',
          icon: 'success',
          duration: 1000
        })
        setTimeout(function () {
          wx.redirectTo({
            url: '../haspublicpromotion/haspublicpromotion',
          })
        }, 1000)
       } else { wx.showModal({ title: '提示', content: res.data.msg, }) }

    })
  },


  //删除卡券
  removeCoupon(e) {
    var that = this;
    var token = app.globalData.token;
    var id = e.currentTarget.dataset.id;
    request({
      url: "/api/coupon/update_state",
      data: {
        id: id,
        type: 5
      },
      header: {
        'content-type': 'application/json', // 默认值
        token: app.globalData.token,
        storeId: app.globalData.storeId,
      },
    }).then(res => {

      if (res.data.error_code == 0) { 
        wx.showToast({
          title: '删除成功',
          icon: 'success',
          duration: 1000
        })
        setTimeout(function () {
          wx.redirectTo({
            url: '../haspublicpromotion/haspublicpromotion',
          })
        }, 1000)
      } else { wx.showModal({ title: '提示', content: res.data.msg, }) }

    })
  },

  //修改卡券

  changeCoupon(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../changepromotion/changepromotion?id=' + id,
    })

  },
  //查看记录
  lookCoupon(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../lookpromotiondetail/lookpromotiondetail?type=2&id=' + id,
    })

  },

  goPromotionDetail(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({

      url: '../promotiondetail/promotiondetail?isHidden=1&id=' + id,
    })
  }
})