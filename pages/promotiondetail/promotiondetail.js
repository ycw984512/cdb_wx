// pages/promotiondetail/promotiondetail.js
import {
  request
} from "../../utils/request.js";
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    promotionDetailData: null,
    upload_domain:null,
    id:null,
    collection_status:0,
    flag: true,
    addNumber: 1,
    couponId: undefined,
    pointsPrice:0,
    isShow:true,
    is_store:null,
    isHidden:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    var is_store = app.globalData.is_store;
    var isShow = options.isShow || true;
    var isHidden = options.isHidden || 2;
    var that = this;
    var id = options.id || "";
    var token = app.globalData.token;

    var upload_domain = app.globalData.upload_domain;
    that.setData({
      upload_domain: upload_domain,
      id:id,
      isShow: isShow,
      is_store: is_store,
      isHidden:isHidden
    })
  },
  onShow(){
    var that=this;
    var latitude = app.globalData.latitude; var longitude = app.globalData.longitude;
        const  id= that.data.id;
        request({
          url: "/api/coupon/detail",
          header: {
            'content-type': 'application/json', // 默认值
            token: app.globalData.token, storeId: app.globalData.storeId
          },
          data: {
            id: id,
            latitude: latitude,
            longitude: longitude,

          }
        }).then(res => {
          //dosome
          console.log(res);
          that.setData({
            promotionDetailData: res.data.data,
            collection_status: res.data.data.is_collection,
            pointsPrice: res.data.data.download_integral

          })
        })
 

  },
  download(e) {
    var id = e.currentTarget.dataset.id;
    this.setData({
      flag: false,
      couponId: id
    })
  },
  listerInput(e){
    this.setData({
      addNumber: e.detail.value
    })
  },
  quxiao() {
    this.setData({
      flag: true,
      addNumber: 1
    })
  },
queren(e){
  var token = app.globalData.token;
  var num = this.data.addNumber;
  if(num<=0){
    wx.showModal({ title: '提示', content:"请输入大于0的数字" })
  }else{
    request({
      url: "/api/coupon/download",
      data: {
        id: this.data.couponId,
        num: num
      },
      header: {
        'content-type': 'application/json', // 默认值
        token: app.globalData.token, storeId: app.globalData.storeId
      },
    }).then(res => {
      console.log(res);
      if (res.data.error_code == 0) { 
        this.setData({
          flag: true,
          addNumber: 1
        });
        wx.showToast({
          title: '下载成功',
        })
      } else { wx.showModal({ title: '提示', content: res.data.msg, }) }
    })
  }
}

  ,
  goCouponAddress(e) {
    var id = e.currentTarget.dataset.id;
    var latitude = Number(e.currentTarget.dataset.latitude);
    var longitude = Number(e.currentTarget.dataset.longitude);
    wx.openLocation({
      latitude,
      longitude,
      scale: 18
    }) 

  },
  goStoreDetil(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../storedetail/storedetail?id='+id,
    })
  },
  goStoreDetilPro(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../storedetail/storedetail?type=1&id=' + id,
    })
  },
  goCollection(e){
    var that = this
    var is_collection = Number(e.currentTarget.dataset.collection);
    var store_id = e.currentTarget.dataset.store_id;
    if(is_collection==1){
      request({
        url: "/api/store/do_collection",
        header: {
          'content-type': 'application/json', // 默认值
          token: app.globalData.token, storeId: app.globalData.storeId
        },
        data: {
          state: 0,
          id: store_id,
        }
      }).then(res => {

      this.setData({
        collection_status:0
      })

      })
    }else if(is_collection==0){
      request({
        url: "/api/store/do_collection",
        header: {
          'content-type': 'application/json', // 默认值
          token: app.globalData.token, storeId: app.globalData.storeId
        },
        data: {
          state: 1,
          id: store_id,
        }
      }).then(res => {

        this.setData({
          collection_status: 1
        })

      })
    }

  }
})