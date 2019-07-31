// pages/search/search.js
var app = getApp(); 
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk = new QQMapWX({
  key: 'C5JBZ-NHXW3-VBI33-3COH5-JJDLH-HTFSK'
});

Page({

  /**
   * 页面的初始数据
   */
  data: {
    location: '赣州市',
    //flag为true是抢购券,false的话是优惠券
    flag:true,
    inputValue: ""
  },

  locationTap: function () {
    wx.navigateTo({
      url: '../select_city/select_city?city='+this.data.location
    })
  },
  //自定义事件接收的是input事件传过来的值
  inputListener(e){
      console.log(e.detail.value);
    this.setData({
      inputValue: e.detail.value
    })
  },
   //自定义事件接收的是input事件传过来的值
  searchEvent(e){
    console.log(e.detail.value);
    var id = e.detail.value;
    if(this.data.flag){
      wx.navigateTo({
        url: '../buylist/buylist?title=全部分类&name='+id
      })
    }else{
      wx.navigateTo({
        url: '../promotionlist/promotionlist?title=全部分类&name='+id,
      })
    }
   
  },
    saoCode() {
    wx.scanCode({
      success(res) {
        console.log(res);
      }
    })
  },
  onLoad(){
    var that = this;
    var latitude = app.globalData.latitude; var longitude = app.globalData.longitude;
        qqmapsdk.reverseGeocoder({
          location: { latitude: latitude, longitude: longitude },
          success: (res) => {
            console.log(res);
            that.setData({
              location: res.result.address_component.city
            });
          }
        })

  },
  changeFlag(){
    this.setData({
      flag:!this.data.flag
    })
  }
})