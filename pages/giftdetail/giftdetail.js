// pages/giftdetail/giftdetail.js
import {
  request
} from "../../utils/request.js";
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    giftData: null,
    upload_domain: null,
    id: null,
    page: 1,
    list_rows: 5,
    giftDetailData:[],
    longitude:null,
    latitude: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that=this;
    var upload_domain = app.globalData.upload_domain;
    var id = options.id;
    this.setData({
      upload_domain: app.globalData.upload_domain,
      id: id,
    });
    var latitude = app.globalData.latitude; var longitude = app.globalData.longitude;
        that.setData({
          longitude: longitude,
          latitude: latitude
        });
        var token = app.globalData.token;

        request({
          url: "/api/gift/detail",
          header: {
            'content-type': 'application/json', // 默认值
            token: app.globalData.token, storeId: app.globalData.storeId,
          },
          data: {
            id: id,
          }
        }).then(res => {
          //dosome
          console.log(res);
          that.setData({
            giftData: res.data.data,
          })
        })
        that.loadmovies();


  },

  loadmovies() {
    const {
      page,
      list_rows,
      id,
      longitude,
      latitude

    } = this.data;
    var token = app.globalData.token;

    request({
      url: `/api/gift/detailed_list`,
      data: {
        page: page,
        list_rows: list_rows,
        id: id,
        longitude: longitude,
        latitude: latitude,
      },
      header: {
        'content-type': 'application/json', // 默认值
        token: app.globalData.token, storeId: app.globalData.storeId,
      },

    }).then(res => {
      const data = res.data.data.data;
      const giftDetailData = this.data.giftDetailData;
      console.log(giftDetailData);
      console.log(data);
      giftDetailData.push(...data);
      this.setData({
        giftDetailData: giftDetailData
      })

    })

  },

  onReachBottom() {
    this.setData({
      page: this.data.page + 1
    })
    this.loadmovies();
  },
})