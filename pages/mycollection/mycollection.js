// pages/mycollection/mycollection.js
import { request } from "../../utils/request.js";      
var app = getApp(); 
Page({

  /**
   * 页面的初始数据
   */
  data: {
      page:1,
    list_rows:8,
    collectionData:[],
    upload_domain:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      upload_domain: app.globalData.upload_domain,
    })
    this.loadmovies();
  },

  loadmovies() {
    const {
      page,
      list_rows,
    } = this.data;
    var token = app.globalData.token;

    request({
      url: `/api/user/collection`,
      data: {
        page: page,
        list_rows: list_rows,
      },
      header: {
        'content-type': 'application/json', // 默认值
        token: app.globalData.token
      },

    }).then(res => {
      const data = res.data.data.data;
      const collectionData = this.data.collectionData;
      console.log(collectionData);
      console.log(data);
      collectionData.push(...data);
      this.setData({
        collectionData: collectionData
      })

    })

  },
  onPullDownRefresh: function () {
    const page = this.data.page;
    this.setData({
      page: 1,
      collectionData: []
    })
    this.loadmovies();
  },

  onReachBottom() {
      this.setData({
        page:this.data.page + 1
      })
    this.loadmovies();
  },
  goStoreDetail(e){
    var id = e.currentTarget.dataset.id;

    wx.navigateTo({
      url: '../storedetail/storedetail?id=' + id,
    })
  }
})