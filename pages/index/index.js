// pages/searchHotel/searchHotel.js
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk = new QQMapWX({
  key: 'C5JBZ-NHXW3-VBI33-3COH5-JJDLH-HTFSK'
});
import {
  request
} from "../../utils/request.js";

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    location: '',
    inputValue: "",
    imgUrls: [
      'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
      'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
      'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
    ],
    bannerData: [],
    couponData: [],
    shoplistData: [],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    token: null,

    province: null,
    district: null,
    city: null,
    page: 1,
    limit:99,
    upload_domain: null,
    moneyFlag: false,
    timeData: null,


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function() {
   
    console.log(1);
    var that = this;

    var latitude = app.globalData.latitude;
    var longitude = app.globalData.longitude;
    console.log(latitude, longitude)

    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: (res) => {
        console.log(res);
        that.setData({
          city: res.result.address_component.city,
          province: res.result.address_component.province,
          district: res.result.address_component.district
        });
        var token = app.globalData.token;
        // var latitude = that.data.latitude;
        // var longitude = that.data.longitude;
        var province = that.data.province;
        var district = that.data.district;
        var city = that.data.city;
        console.log(token)
        //banner图接口
        request({
          url: "/api/home/get_banner",
          method: "post",
          header: {
            'content-type': 'application/json', // 默认值
            token: token,
            storeId: app.globalData.storeId,
          },
          data: {
            district: district,
            province: province,
            city: city,
          }
        }).then(res => {
          //dosome
          console.log(res);
          var upload_domain = app.globalData.upload_domain
          that.setData({
            bannerData: res.data.data.imgs,
            upload_domain: upload_domain
          })
        })
        // 行业分类接口
        request({
          url: "/api/store/get_catetgory",
          method: "post",
          header: {
            'content-type': 'application/json', // 默认值
            token: token,
            storeId: app.globalData.storeId,
          },

        }).then(res => {
          //dosome

          var couponData = res.data.data;
          var upload_domain = app.globalData.upload_domain
          couponData.map((item, index) => {
            return item.icon = upload_domain + item.icon
          })
          console.log(couponData);
          var couponData = couponData.slice(0,4);
          couponData.push({
            id: "",
            name: "全部",
            icon: "../../static/images/all.png"
          })
          that.setData({
            couponData: couponData,
          })
        })

   //获取附近商家
        this.setData({
          shoplistData: [],
          page: 1,
        })
        that.loadmovies();

        //获取推送消息

        request({
          url: "/api/home/message",
          header: {
            'content-type': 'application/json', // 默认值
            token: app.globalData.token,
            storeId: app.globalData.storeId,
          },
          data: {
            page: 1,
            list_rows: 999
          }
        }).then(res => {
          console.log(res)
          if (res.data.error_code == 0) { //系统不报错

            if (res.data.data.data.length > 0) { //有消息推送
              that.setData({
                timeData: res.data.data.data,
                moneyFlag: true
              })
            }

          } else {
            wx.showModal({
              title: '提示',
              content: res.data.msg,
            })
          }
        })

      }
    })



  },


  locationTap: function() {
    var that = this;
    wx.chooseLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function(res) {

        var latitude = res.latitude;
        var longitude = res.longitude;
        console.log(latitude, longitude);
        app.globalData.latitude = latitude;
        app.globalData.longitude = longitude;
        that.setData({
          city: res.name,
        })

      },
    })
  },

  // locationTap: function() {
  //   wx.navigateTo({
  //     url: '../select_city/select_city'
  //   })
  // },

  payMoney() {
    this.setData({
      moneyFlag: false
    })
  },
  saoCode() {
    wx.scanCode({
      success(res) {
        console.log(res);
        var result = JSON.parse(res.result)
        var type = Number(result.type);
        var code = result.code;
        console.log(type)
        console.log(code)
        if (type == 2) {

          var token = app.globalData.token;
          request({
            url: "/api/store_staff/add_staff",
            header: {
              'content-type': 'application/json', // 默认值
              token: app.globalData.token,
              storeId: app.globalData.storeId,
            },
            data: {
              key: code
            }
          }).then(res => {
            //dosome  
            if (res.data.error_code == 0) {
              // wx.showModal({
              //   title: '提示',
              //   content: '添加成功',
              // })
              wx.showToast({
                title: '添加成功',
                icon: 'success',
                duration: 1500,
                mask: true
              })

            } else {
              wx.showModal({
                title: '提示',
                content: res.data.msg,
              })
            }
          })
        } else if (type == 1) {
          var token = app.globalData.token;
          request({
            url: "/api/store/write_off_coupon",
            header: {
              'content-type': 'application/json', // 默认值
              token: app.globalData.token,
              storeId: app.globalData.storeId,
            },
            data: {
              code: code
            }
          }).then(res => {
            //dosome  
            if (res.data.error_code == 0) {
              // wx.showModal({
              //   title: '提示',
              //   content: '核销成功',
              // })
              wx.showToast({
                title: '核销成功',
                icon: 'success',
                duration: 1500,
                mask: true
              })
            } else {
              wx.showModal({
                title: '提示',
                content: res.data.msg,
              })
            }
          })
        }
      }
    })
  },
  inputListener(e) {
    console.log(e);
    this.setData({
      inputValue: e.detail.value
    })
  },
  searchEvent(e) {
    console.log(e);
    var inputValue = this.data.inputValue;
    request({
      url: "/mock/5cf0c9643a6d9356cd506250/example/mock",
      data: {
        inputValue: inputValue
      }
    }).then(res => {
      //dosome
      console.log(res);
    })
  },
  goProList(e) {
    console.log(e);
    var title = e.currentTarget.dataset.title == "全部" ? "全部分类" : e.currentTarget.dataset.title;
    var id = e.currentTarget.dataset.id;

    wx.navigateTo({
      url: '../promotionlist/promotionlist?title=' + title + '&industry_category_id=' + id,
    })
  },
  goBuyList(e) {
    console.log(e);
    var title = e.currentTarget.dataset.title == "全部" ? "全部分类" : e.currentTarget.dataset.title;
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../buylist/buylist?title=' + title + '&industry_category_id=' + id,
    })
  },
  storeDetail(e) {
    console.log(e);
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../storedetail/storedetail?id=' + id,
    })
  },
  loadmovies() {
   
    const {
      page,
      limit,

    } = this.data;
    var token = app.globalData.token;
    var longitude = app.globalData.longitude;
    var latitude = app.globalData.latitude;
    request({
      url: `/api/home/store`,
      data: {
        page: page,
        list_rows: limit,
        longitude: longitude,
        latitude: latitude,
      },
      header: {
        'content-type': 'application/json', // 默认值
        token: token,
        storeId: app.globalData.storeId,
      },
    }).then(res => {
      //dosome
      console.log(res);
      var shoplistData = this.data.shoplistData.concat(res.data.data.data);
      this.setData({
        shoplistData: shoplistData
      })
    })

  },

  onReachBottom() {
    const page = this.data.page;
    this.setData({
      page: page + 1
    })
    this.loadmovies();
  },

  // 分享小程序进入首页
  onShareAppMessage() {
    return {
      title: '充店宝',
      path: '/pages/loadingIndex/loadingIndex',
      success(res) {
        console.log(res)
      }
    }
  }
})