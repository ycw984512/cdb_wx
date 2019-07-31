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
    upload_domain: null,
    id: null,
    storeData: "",
    storeId:"",
    name:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var storeId = app.globalData.storeId;
    var that = this;
    var token = app.globalData.token;
    var upload_domain = app.globalData.upload_domain;
    that.setData({
      upload_domain: upload_domain
    })

    if(storeId==""){
      var id = options.id || "";

      if (id == "") {
        request({
          url: "/api/store/settled_state",
          header: {
            'content-type': 'application/json', // 默认值
            token: app.globalData.token, storeId: app.globalData.storeId
          },
        }).then(res => {
          //dosome

          var id = res.data.data.data.id;
          console.log(id);

          that.setData({
            id: id
          })

          request({
            url: "/api/store/detail",
            header: {
              'content-type': 'application/json', // 默认值
              token: app.globalData.token, storeId: app.globalData.storeId
            },
            data: {
              id: id
            }
          }).then(res => {
            //dosome
            console.log(res);
            that.setData({
              storeData: res.data.data,
              name: res.data.data.name,
            })

          })

        })
      } else {
        this.setData({
          id:id
        });
        request({
          url: "/api/store/detail",
          header: {
            'content-type': 'application/json', // 默认值
            token: app.globalData.token, storeId: app.globalData.storeId
          },
          data: {
            id: id
          }
        }).then(res => {
          //dosome
          console.log(res);
          that.setData({
            storeData: res.data.data,
            name: res.data.data.name,
          })

        })
      }
    }else{
      request({
        url: "/api/store/detail",
        header: {
          'content-type': 'application/json', // 默认值
          token: app.globalData.token, storeId: app.globalData.storeId
        },
        data: {
          id: storeId
        }
      }).then(res => {
        //dosome
        console.log(res);
        that.setData({
          storeData: res.data.data,
          name: res.data.data.name,
        })

      })
    }




  },

  goPhone(e){
    var tel = e.currentTarget.dataset.tel;
    wx.makePhoneCall({
      phoneNumber: tel,
    })
  },
  download(e) {
    var id = e.currentTarget.dataset.id;
    this.setData({
      flag: false,
      couponId: id
    })
  },
  listerInput(e) {
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

  backindex() {
    wx.reLaunch({
      url: '../loadingIndex/loadingIndex',
    })
  },

  queren(e) {
    var token = app.globalData.token;
    var num = this.data.addNumber;
    if (num <= 0) {
      wx.showModal({
        title: '提示',
        content: "请输入大于0的数字"
      })
    } else {
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
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
          })
        }
      })
    }
  },
  openLocation(e) {
    var latitude = Number(e.currentTarget.dataset.latitude);
    var longitude = Number(e.currentTarget.dataset.longitude);
    var name = e.currentTarget.dataset.name;
    var address = e.currentTarget.dataset.address;
    wx.openLocation({
      latitude,
      longitude,
      scale: 18,
      name,
      address
    })

  },

  // 继续分享
  onShareAppMessage() {
    var id = this.data.id;
    var name = this.data.name;
    return {
      title: name,
      path: '/pages/loadingIndex/loadingIndex?&storeId=' + id + '&type=5',
      success(res) {
        console.log(res)
      }
    }

  }

})