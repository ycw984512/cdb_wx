// pages/orderList/orderList.js
import { request } from "../../utils/request.js";
var app = getApp(); 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stateList: [
      "首页", "抢购券", "促销券"
    ],
    selectedIndex: 0,
    pageId:"",
    type:"",
    marginTop:20,
    upload_domain:null,

    //数据列表数据
    indexData: undefined,
    buyData: [],
    promotionData: [],
    longitude:null,
    latitude: null,
    proPage: 1,
    proLimit: 5,
    buyPage: 1,
    buyLimit: 5,
    collection_status:0,
    name:"",
    address:"",
    is_store: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var is_store = app.globalData.is_store;
    console.log(is_store);
    var that = this;
    var upload_domain = app.globalData.upload_domain
    wx.createSelectorQuery().selectAll('.top_wrap').boundingClientRect(function (rect) {
      console.log(rect[0]);
      var marginTop = rect[0].height + rect[0].height;
      that.setData({
        marginTop: marginTop,
        upload_domain: upload_domain,
        is_store: is_store
      })
    }).exec()

    console.log(options);

    // 获取店铺Id  发送请求获取数据
    var pageId = options.id;
    var type = options.type||0;
    var that= this;
    this.setData({
      pageId: pageId,
      type:type
    });

  },

  onShow(){
    var type =this.data.type;
    var pageId = this.data.pageId;
    if (type == 0) {
      request({
        url: "/api/store/detail",
        header: {
          'content-type': 'application/json', // 默认值
          token: app.globalData.token, storeId: app.globalData.storeId
        },
        data: {
          id: pageId,
        }
      }).then(res => {
        //dosome
        console.log(res);
        this.setData({
          indexData: res.data.data,
          longitude: res.data.data.longitude,
          latitude: res.data.data.latitude,
          collection_status: res.data.data.collection_status,
          name: res.data.data.name,
          address: res.data.data.address,
        })

      })
    } else if (type == 1) {
      this.setData({
        selectedIndex: 1
      });
      request({
        url: "/api/store/detail",
        header: {
          'content-type': 'application/json', // 默认值
          token: app.globalData.token, storeId: app.globalData.storeId
        },
        data: {
          id: pageId,
        }
      }).then(res => {
        //dosome
        console.log(res);
        this.setData({
          indexData: res.data.data,
          longitude: res.data.data.longitude,
          latitude: res.data.data.latitude,
          collection_status: res.data.data.collection_status,
          name: res.data.data.name,
          address: res.data.data.address,
        })
        this.loadBuylist()
      })
    }
  },
  goBuyDetail(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../buydetail/buydetail?id='+id,
    })
  },
  goProDetail(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../promotiondetail/promotiondetail?id=' + id,
    })
  },
  goShopAddress(e){
    var latitude = Number(e.currentTarget.dataset.latitude);
    var longitude = Number(e.currentTarget.dataset.longitude);
    var address = this.data.address;
    var name = this.data.name;
    wx.openLocation({
      latitude,
      longitude,
      scale: 18,
      name,
      address
    }) 
  }
,
  goCollection(e){
    var that = this
    var id = e.currentTarget.dataset.id;
    var state = e.currentTarget.dataset.collection_status;
    if (state == 1) {
      request({
        url: "/api/store/do_collection",
        header: {
          'content-type': 'application/json', // 默认值
          token: app.globalData.token, storeId: app.globalData.storeId
        },
        data: {
          state: 0,
          id: id,
        }
      }).then(res => {

        this.setData({
          collection_status: 0
        })
        wx.showToast({
          title: '取消收藏成功',
          icon: 'success',
          duration: 1000,
        })


      })
    } else if (state == 0) {
      request({
        url: "/api/store/do_collection",
        header: {
          'content-type': 'application/json', // 默认值
          token: app.globalData.token, storeId: app.globalData.storeId
        },
        data: {
          state: 1,
          id: id,
        }
      }).then(res => {

        this.setData({
          collection_status: 1
        })
        wx.showToast({
          title: '收藏成功',
          icon: 'success',
          duration: 1000,
        })
      })
    }
  },
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
          proPage: 1,
          promotionData: [],
          buyPage: 1,
          buyData:[]
        })
      }else if (dataIndex==1){
        this.setData({
          selectedIndex: dataIndex,
          proPage: 1,
          promotionData:[]
        })
        this.loadBuylist();
      } else if (dataIndex == 2) {
        // 获取店铺促销券列表数据
        this.setData({
          selectedIndex: dataIndex,
          buyPage: 1,
          buyData: []
        })
        this.loadProlist();
      }

    } 
  },
  loadProlist() {
    const { proPage, proLimit, longitude, latitude, pageId} = this.data;
    var token = app.globalData.token;
    request({
      url: `/api/coupon/index`,
      data: {
        page: proPage,
        list_rows: proLimit,
        longitude: app.globalData.longitude,
        latitude: app.globalData.latitude,
        store_id: pageId,
        type:2
      },
      header: {
        'content-type': 'application/json', // 默认值
        token: token, storeId: app.globalData.storeId
      },
    }).then(res => {
      //dosome
      console.log(res.data.data.data);
      var promotionData = this.data.promotionData.concat(res.data.data.data);
      this.setData({
        promotionData: promotionData
      })
    })

  },
  loadBuylist() {
    const { buyPage, buyLimit, longitude, latitude, pageId } = this.data;
    var token = app.globalData.token;
    request({
      url: `/api/coupon/index`,
      data: {
        page: buyPage,
        list_rows: buyLimit,
        longitude: app.globalData.longitude,
        latitude: app.globalData.latitude,
        store_id: pageId,
        type: 1
      },
      header: {
        'content-type': 'application/json', // 默认值
        token: token, storeId: app.globalData.storeId
      },
    }).then(res => {
      //dosome
      console.log(res.data.data.data);
      var buyData = this.data.buyData.concat(res.data.data.data);
      this.setData({
        buyData: buyData
      })
    })

  },
  onReachBottom() {
      if(this.data.selectedIndex==1){
        const buyPage = this.data.buyPage;
        this.setData({
          buyPage: buyPage + 1
        })
        this.loadBuylist();
      } else if (this.data.selectedIndex==2){
        const proPage = this.data.proPage;
        this.setData({
          proPage: proPage + 1
        })
        this.loadProlist();
      }
  },

  goPhone(e){
    var phone = e.currentTarget.dataset.store_mobile;
    wx.makePhoneCall({
      phoneNumber: phone,
      success(res){
        console.log(res)
      }
    })
  }
})