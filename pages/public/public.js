// pages/orderList/orderList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    publicData:[{
        title:"创建抢购券",
        imgUrl:"/static/images/aaa1.png",
        type:1
    },
      {
        title: "创建促销券",
        imgUrl: "/static/images/aaa2.png",
        type: 2
        
      },
      {
        title: "已创建的抢购券",
        imgUrl: "/static/images/aaa3.png",
        type: 3
      },
      {
        title: "已创建的促销券",
        imgUrl: "/static/images/aaa4.png",
        type: 4
      }]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


  },

  goType(e){
    var type = e.currentTarget.dataset.type;
    if(type==1){
      wx.navigateTo({
        url: '../publicbuylist/publicbuylist'
      })
    } else if (type == 2){
      wx.navigateTo({
        url: '../publicpromotion/publicpromotion'
      })
    } else if (type == 3) {
      wx.navigateTo({
        url: '../haspublicbuy/haspublicbuy'
      })
    } else if(type == 4) {
      wx.navigateTo({
        url: '../haspublicpromotion/haspublicpromotion'
      })
    }
  }
})