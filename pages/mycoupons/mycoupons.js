// pages/orderList/orderList.js
import {
  request, baseURL
} from "../../utils/request.js";
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stateList: [
      "下载的抢购券", "下载的促销券", "过期的促销券", "过期的抢购券"
    ],
    selectedIndex: 0,
    marginTop: 20,
    upload_domain: null,
    name: null,
    //数据列表数据
    page1: 1,
    limit1: 10,
    tab1Data: [],
    page2: 1,
    limit2: 10,
    tab2Data: [],
    page3: 1,
    limit3: 10,
    tab3Data: [],
    page4: 1,
    limit4: 10,
    tab4Data: [],
    longitude: null,
    latitude: null,
    shareNumber: 1,
    shareNumberId: undefined,
    shareNumFlag: true,
    shareNumberValue: 1,
    shareCoupon_id:null,
    shareFlag: true,
    code: null,
    store_name: undefined

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showShareMenu({
      withShareTicket: true
    })
    console.log(options);
    var name = options.name || null;
    var upload_domain = app.globalData.upload_domain;
    var longitude = app.globalData.longitude;
    var latitude = app.globalData.latitude;
    this.setData({
      upload_domain: app.globalData.upload_domain,
      name: name,
      longitude: longitude,
      latitude: latitude
    });
    var that = this;
    wx.createSelectorQuery().selectAll('.top_wrap').boundingClientRect(function(rect) {
      console.log(rect[0]);
      var marginTop = rect[0].height + rect[0].height;
      that.setData({
        marginTop: marginTop
      })
    }).exec()

    var that = this;
    this.loadTab1list();
  },


  turnPage: function(e) {
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
          page2: 1,
          tab2Data: [],
          page3: 1,
          tab3Data: [],
          page4: 1,
          tab4Data: [],
          page1: 1,
          tab1Data: [],
        })
        this.loadTab1list();
      } else if (dataIndex == 1) {
        this.setData({
          selectedIndex: dataIndex,
          page1: 1,
          tab1Data: [],
          page3: 1,
          tab3Data: [],
          page4: 1,
          tab4Data: [],
          page2: 1,
          tab2Data: [],
        })
        this.loadTab2list();
      } else if (dataIndex == 2) {
        // 获取店铺促销券列表数据
        this.setData({
          selectedIndex: dataIndex,
          page2: 1,
          tab2Data: [],
          page1: 1,
          tab1Data: [],
          page4: 1,
          tab4Data: [],
          page3: 1,
          tab3Data: [],
        })
        this.loadTab3list();
      } else if (dataIndex == 3) {
        // 获取店铺促销券列表数据
        this.setData({
          selectedIndex: dataIndex,
          page2: 1,
          tab2Data: [],
          page3: 1,
          tab3Data: [],
          page1: 1,
          tab1Data: [],
          page4: 1,
          tab4Data: [],
        })
        this.loadTab4list();
      }

    }
  },

  //下载的抢购券函数
  loadTab1list() {
    const {
      page1,
      limit1,
      name,
      longitude,
      latitude
    } = this.data;
    var token = app.globalData.token;
    request({
      url: `/api/user/download_coupon_list`,
      data: {
        page: page1,
        list_rows: limit1,
        type: 1,
        is_overdue: 1,
        longitude,
        latitude

      },
      header: {
        'content-type': 'application/json', // 默认值
        token: token, storeId: app.globalData.storeId,
      },
    }).then(res => {
      //dosome
      console.log(res.data.data.data);
      var tab1Data = this.data.tab1Data.concat(res.data.data.data);
      this.setData({
        tab1Data: tab1Data
      })
    })

  },

  //下载的促销券函数
  loadTab2list() {
    const {
      page2,
      limit2,
      name,
      longitude,
      latitude
    } = this.data;
    var token = app.globalData.token;
    request({
      url: `/api/user/download_coupon_list`,
      data: {
        page: page2,
        list_rows: limit2,
        type: 2,
        is_overdue: 1,
        longitude,
        latitude

      },
      header: {
        'content-type': 'application/json', // 默认值
        token: token, storeId: app.globalData.storeId,
      },
    }).then(res => {
      //dosome
      console.log(res.data.data.data);
      var tab2Data = this.data.tab2Data.concat(res.data.data.data);
      this.setData({
        tab2Data: tab2Data
      })
    })

  },

  //过期的促销券函数
  loadTab3list() {
    const {
      page3,
      limit3,
      name,
      longitude,
      latitude
    } = this.data;
    var token = app.globalData.token;
    request({
      url: `/api/user/download_coupon_list`,
      data: {
        page: page3,
        list_rows: limit3,
        type: 2,
        is_overdue: 2,
        longitude,
        latitude

      },
      header: {
        'content-type': 'application/json', // 默认值
        token: token, storeId: app.globalData.storeId,
      },
    }).then(res => {
      //dosome
      console.log(res.data.data.data);
      var tab3Data = this.data.tab3Data.concat(res.data.data.data);
      this.setData({
        tab3Data: tab3Data
      })
    })

  },
  //过期的抢购券
  loadTab4list() {
    const {
      page4,
      limit4,
      name,
      longitude,
      latitude
    } = this.data;
    var token = app.globalData.token;
    request({
      url: `/api/user/download_coupon_list`,
      data: {
        page: page4,
        list_rows: limit4,
        type: 1,
        is_overdue: 2,
        longitude,
        latitude

      },
      header: {
        'content-type': 'application/json', // 默认值
        token: token, storeId: app.globalData.storeId,
      },
    }).then(res => {
      //dosome
      console.log(res.data.data.data);
      var tab4Data = this.data.tab4Data.concat(res.data.data.data);
      this.setData({
        tab4Data: tab4Data
      })
    })

  },

  onReachBottom() {
    if (this.data.selectedIndex == 0) {
      const page1 = this.data.page1;
      this.setData({
        page1: page1 + 1
      })
      this.loadTab1list();
    } else if (this.data.selectedIndex == 1) {
      const page2 = this.data.page2;
      this.setData({
        page2: page2 + 1
      })
      this.loadTab2list();
    } else if (this.data.selectedIndex == 2) {
      const page3 = this.data.page3;
      this.setData({
        page3: page3 + 1
      })
      this.loadTab3list();
    } else if (this.data.selectedIndex == 3) {
      const page4 = this.data.page4;
      this.setData({
        page4: page4 + 1
      })
      this.loadTab4list();
    }
  },


  // 下载的抢购券查看明细
  lookCouponBuy(e) {
    var id = e.currentTarget.dataset.id;
    var coupon_id = e.currentTarget.dataset.coupon_id;
    wx.navigateTo({
      url: '../mybuydetail/mybuydetail?type=1&coupon_id='+coupon_id+'&id=' + id,

    })
  },
  // 下载的抢购券分享好友
  shareCouponBuy(e) {
    var id = e.currentTarget.dataset.id;
  },
  // 下载的抢购券删除卡券
  deleteCouponBuy(e) {
    var token = app.globalData.token;
    var id = e.currentTarget.dataset.id;
    request({
      url: "/api/coupon/delete_download_coupon",
      data: { id: id},
      header: {
        'content-type': 'application/json', // 默认值
        token: app.globalData.token, storeId: app.globalData.storeId,
      },
    }).then(res => {
      if (res.data.error_code == 0) {
        wx.showToast({
          title: '删除卡券成功',
          icon: 'success',
          duration: 1000
        })
        this.setData({
          page1: 1,
          tab1Data: [],
        })
        this.loadTab1list();

       } else { wx.showModal({ title: '提示', content: res.data.msg, }) }

    })

  },
  //下载的促销券查看明细
  lookCouponPro(e) {
    var id = e.currentTarget.dataset.id;
    var coupon_id = e.currentTarget.dataset.coupon_id;
    wx.navigateTo({
      url: '../mypromotiondetail/mypromotiondetail?type=1&coupon_id=' + coupon_id +'&id=' + id,

    })

  },
  //下载的促销券删除卡券
  deleteCouponPro(e) {
    var token = app.globalData.token;
    var id = e.currentTarget.dataset.id;
    request({
      url: "/api/coupon/delete_download_coupon",
      data: { id: id},
      header: {
        'content-type': 'application/json', // 默认值
        token: app.globalData.token, storeId: app.globalData.storeId,
      },
    }).then(res => {
      if (res.data.error_code == 0) { 
        wx.showToast({
          title: '删除卡券成功',
          icon: 'success',
          duration: 1000
        })
        this.setData({
          page2: 1,
          tab2Data: [],
        })
        this.loadTab2list();
      } else { wx.showModal({ title: '提示', content: res.data.msg, }) }

    })
  },
//过期的促销券查看明细
  lookOldPro(e){
    var id = e.currentTarget.dataset.id;
    var coupon_id = e.currentTarget.dataset.coupon_id;
    wx.navigateTo({
      url: '../mypromotiondetail/mypromotiondetail?type=1&coupon_id=' + coupon_id +'&id=' + id,

    })
  },
//过期的促销券删除卡券
  deleteOldPro(e) {
    var token = app.globalData.token;
    var id = e.currentTarget.dataset.id;
    request({
      url: "/api/coupon/delete_download_coupon",
      data: { id: id},
      header: {
        'content-type': 'application/json', // 默认值
        token: app.globalData.token, storeId: app.globalData.storeId,
      },
    }).then(res => {
      if (res.data.error_code == 0) { 
        wx.showToast({
          title: '删除卡券成功',
          icon: 'success',
          duration: 1000
        })
        this.setData({
          page3: 1,
          tab3Data: [],
        })
        this.loadTab3list();

      } else { wx.showModal({ title: '提示', content: res.data.msg, }) }

    })
  },
  //过期的抢购券查看明细
  lookOldBuy(e) {
    var id = e.currentTarget.dataset.id;
    var coupon_id = e.currentTarget.dataset.coupon_id;
    wx.navigateTo({
      url: '../mybuydetail/mybuydetail?type=1&coupon_id=' + coupon_id +'&id=' + id,

    })
  },
  //过期的抢购券删除卡券
  deleteOldBuy(e) {
    var token = app.globalData.token;
    var id = e.currentTarget.dataset.id;
    request({
      url: "/api/coupon/delete_download_coupon",
      data: { id: id},
      header: {
        'content-type': 'application/json', // 默认值
        token: app.globalData.token, storeId: app.globalData.storeId,
      },
    }).then(res => {
      if (res.data.error_code == 0) { 
        wx.showToast({
          title: '删除卡券成功',
          icon: 'success',
          duration: 1000
        })
        this.setData({
          page4: 1,
          tab4Data: [],
        })
        this.loadTab4list();

      } else { wx.showModal({ title: '提示', content: res.data.msg, }) }

    })
  },
//跳转促销券详情页面
  goProDetail(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../promotiondetail/promotiondetail?isHidden=1&id='+id,
    })
  },
  //跳转抢购券详情页面
  goBuyDetail(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../buydetail/buydetail?isHidden=1&id=' + id,
    })
  }
,

  //分享卡券

  shareNumberTap(e) {
    var id = e.currentTarget.dataset.id;
    var store_name = e.currentTarget.dataset.store_name;
    var coupon_id = e.currentTarget.dataset.coupon_id;
    this.setData({
      shareNumberId: id,
      shareNumFlag: false,
      shareCoupon_id: coupon_id,
      store_name: store_name
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
      url: "/api/coupon/share_coupon",
      data: {
        id: id,
        num: shareNumber,
        type: 2
      },
      header: {
        'content-type': 'application/json', // 默认值
        token: app.globalData.token, storeId: app.globalData.storeId,
      },
    }).then(res => {
      if (res.data.error_code == 0) { 
        var code = res.data.data.code;
        console.log(code);
        this.setData({
          shareNumFlag: true,
          shareFlag: false,
          code: code
        })

      } else { wx.showModal({ title: '提示', content: res.data.msg, }) }

    })
  },

  sharequxiao() {
    this.setData({
      shareFlag: true,
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
      var id = this.data.shareCoupon_id;
      var store_name = this.data.store_name;
      console.log(baseURL+'/api/share_img/coupon?id='+id);
      console.log(code)
      return {
        title: store_name,
        path: '/pages/loadingIndex/loadingIndex?code=' + code + '&type=2',
        imageUrl: baseURL+'/api/share_img/coupon?id='+id,
        success(res) {
          console.log(res)
        }
      }

    }

  }
})