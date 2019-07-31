// pages/orderList/orderList.js
import {
  request
} from "../../utils/request.js";
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stateList: [
      "领取列表", "核销列表"
    ],
    selectedIndex: 0,
    marginTop: 20,
    allData: "",
    //促销券下载id
    id: null,
    //数据列表数据  
    page1: 1,
    limit1: 5,
    tab1Data: [],
    page2: 1,
    limit2: 5,
    tab2Data: [],
    latitude:null,
    longitude:null,
    type:null,
    upload_domain: null 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var upload_domain = app.globalData.upload_domain; this.setData({ upload_domain: app.globalData.upload_domain, });

    var that = this;
    wx.createSelectorQuery().selectAll('.top_wrap').boundingClientRect(function(rect) {
      console.log(rect[0]);
      var marginTop = rect[0].height + rect[0].height;
      that.setData({
        marginTop: marginTop
      })
    }).exec()

    console.log(options);

    // 获取促销券下载Id
    var id = options.id;
    var coupon_id = options.coupon_id;
    var type = options.type;
    var longitude = app.globalData.longitude;
    var latitude = app.globalData.latitude;

    this.setData({
      id: id,
      coupon_id: coupon_id,
      type: type,
      longitude: longitude,
      latitude: latitude,
    });
    var that = this;
    var token = app.globalData.token;
    request({
      url: "/api/coupon/download_detail",
      header: {
        'content-type': 'application/json', // 默认值
        token: app.globalData.token, storeId: app.globalData.storeId
      },
      data: {
        id: id,
        state: type,
        longitude: longitude,
        latitude: latitude,
      }
    }).then(res => {
      //dosome
      console.log(res);
      that.setData({
        allData: res.data.data,
      })
    })
    this.loadTab1list()
  },


  turnPage: function(e) {
    var that = this;
    var dataIndex = e.currentTarget.dataset.index;
    if (this.data.selectedIndex != dataIndex) {
      if (dataIndex == 0) {
        // 获取店铺促销券列表数据
        this.setData({
          selectedIndex: dataIndex,
          page2: 1,
          tab2Data: [],
        })
        this.loadTab1list();
      } else if (dataIndex == 1) {
        this.setData({
          selectedIndex: dataIndex,
          page1: 1,
          tab1Data: [],
        })
        this.loadTab2list();
      }
    }
  },

  //下载的促销券领取列表
  loadTab1list() {
    const {
      page1,
      limit1,
      id
    } = this.data;
    var token = app.globalData.token;
    request({
      url: `/api/coupon/receipt_list`,
      data: {
        page: page1,
        list_rows: limit1,
        id: id,
        type: 2,
        state:1
      },
      header: {
        'content-type': 'application/json', // 默认值
        token: token, storeId: app.globalData.storeId
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

  //下载的促销券核销列表
  loadTab2list() {
    const {
      page2,
      limit2,
      id
    } = this.data;
    var token = app.globalData.token;
    request({
      url: `/api/coupon/receipt_list`,
      data: {
        page: page2,
        list_rows: limit2,
        id: id,
        type: 2,
        state: 3
      },
      header: {
        'content-type': 'application/json', // 默认值
        token: token, storeId: app.globalData.storeId
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
    } 
  },

})