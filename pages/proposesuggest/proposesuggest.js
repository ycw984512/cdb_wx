var app = getApp();
import { request } from "../../utils/request.js";    
Page({

  /**
   * 页面的初始数据
   */
  data: {
    required: false, //按钮颜色
    jylen: 0, //建议字数
    content: "", //建议
    tels: "", //电话
  },
  // 建议
  jianyilen(e) {
    this.setData({
      content: e.detail.value,
      jylen: e.detail.value.length,
    })
    this.test();
  },
  //电话
  tel(e) {
    this.setData({
      tels: e.detail.value,
    })
    this.test();
  },
  //验证
  test() {
    if (this.data.tels != "" && this.data.content != "") {
      this.setData({
        required: true
      })
    } else {
      this.setData({
        required: false
      })
    }
  },
  jianyiform(e) {
    var t = this, val = e.detail.value;
    var str = /^1[3|4|5|6|7|8|9][0-9]\d{4,8}$/;
    var yx = /^([a-zA-Z0-9_\.])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
    if (!str.test(val.tels)) {
      wx.showModal({
        content: '电话号码不正确',
        showCancel: false
      })
    } else if (val.email != "" && !yx.test(val.email)) {
      wx.showModal({
        content: '邮箱格式不正确',
        showCancel: false
      })
    } else if (this.data.content.length<=5) {
      wx.showModal({
        content: '意见或建议不能少于5个字',
        showCancel: false
      })
    }else {
      var token = app.globalData.token;
      var content = this.data.content;
      request({
        url: "/api/user/feedback",
        header: {
          'content-type': 'application/json', // 默认值
          token: app.globalData.token
        },
        data: {
          phone: val.tels,
          email: val.email,
          qq: val.qq,
          content: content,
        }
      }).then(res => {
        //dosome
        console.log(res);
        if (res.data.error_code == 0) { 
          wx.showToast({
            title: '提交成功!',
          })
          setTimeout(function () {
            wx.navigateBack({})
          }, 1000)
        } else { wx.showModal({ title: '提示', content: res.data.msg, }) }


      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
})