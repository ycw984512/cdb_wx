// pages/orderList/orderList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    publicData: [
      {
      title: "创建礼包",
      imgUrl: "/static/images/public.png",
      type:1
    },
    {
      title: "已创建的礼包",
      imgUrl: "/static/images/libao2.png",
      type: 2
    }
    ]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


  },

  goTypeUrl(e){
    var type = e.currentTarget.dataset.type;
    if(type==1){
      wx.navigateTo({
        url: '../newgift/newgift',
      })
    }else if(type==2){
      wx.navigateTo({
        url: '../mygift/mygift',
      })
    }

  }


})