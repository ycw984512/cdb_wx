var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    txtypes: ["支付宝", "银行卡"],
    current: 0,
    zhye: 2000,
    allmoney: "",
    yhkindex: "",
    yhklist: ["中国银行", "建设银行", "兴业银行", "交通银行"],
    sf: "",
    bank: [],
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var sf = options.sf;
    that.setData({
      sf: sf
    })
    wx.request({
      url: "entry/wxapp/Bank",

      success: function (res) {

        var list = [];
        for (var i in res.data) {
          list.push(res.data[i].title)
        }
        that.setData({
          bank: list,
        });
        console.log(that.data.bank)
      }
    })
    if (options.sf == '0') {
      wx.request({
        url: "entry/wxapp/Storeinfos",
        data: {
          store_id: wx.getStorageSync("store_id")
        },
        success: function (res) {
          that.setData({
            list: res.data
          })
        }
      })

    } else {
      wx.request({
        url: "entry/wxapp/Userinfos",
        data: {
          user_id: wx.getStorageSync("UserData").id
        },
        success: function (res) {
          console.log(res.data)
          that.setData({
            list: res.data
          })
        }
      })
    }

  },

  allmoney() {
    this.setData({
      allmoney: this.data.list.money
    })
  },
  
  txsel(e) {
    this.setData({
      current: e.currentTarget.dataset.dex,
      yhkindex: "",
      allmoney: ""
    })
  },
  selyhk(e) {
    this.setData({
      yhkindex: e.detail.value
    })
  },
  // 提现到微信
  wxform(e) {
    var t = this,
      val = e.detail.value;
    if (val.txmoney == "") {
      wx.showModal({
        content: '请输入提现金额',
      })
    } else if (val.txmoney < 0.01) {
      wx.showModal({
        content: '提现金额需大于0.01',
      })
    } else if (val.txmoney > val.umoney) {
      wx.showModal({
        content: '提现金额过大',
      })
    } else {
      console.log(val);
      val.store_id = wx.getStorageSync("store_id");
      val.user_id = wx.getStorageSync("UserData").id;
      val.typs = "微信";
      if (t.data.sf == '0') {
        val.style = "sj";
      } else {
        val.style = "yh";
      }
wx.request({
        url: "entry/wxapp/Tixian",
        data: val,
        success: function(res) {
          wx.showModal({
            title: '提示',
            content: '提现成功!请等待后台审核',
            showCancel: true,
            success: function() {
              wx.navigateBack({})
            },
          })
        }
      })
    }
  },
  // 提现到支付宝
  zfbform(e) {
    var t = this,
      val = e.detail.value;
    if (val.zhbzhanghao == "") {
      wx.showModal({
        content: '请输入支付宝账号',
      })
    } else if (val.zhbname == "") {
      wx.showModal({
        content: '请输入支付宝姓名',
      })
    } else if (val.txmoney == "") {
      wx.showModal({
        content: '请输入提现金额',
      })
    } else if (val.txmoney < 0.01) {
      wx.showModal({
        content: '提现金额需大于0.01',
      })
    } else if (val.txmoney > val.umoney) {
      wx.showModal({
        content: '提现金额过大',
      })
    } else {
      console.log(val)
      val.store_id = wx.getStorageSync("store_id");
      val.typs = "支付宝";
      if (t.data.sf == '0') {
        val.style = "sj";
      } else {
        val.style = "yh";
      }
      val.user_id = wx.getStorageSync("UserData").id;
      wx.request({
        url: "entry/wxapp/GetPlatform",
        success: function(res) {
          console.log(res.data.txshouxufei);
          var feilu = res.data.txshouxufei;
          if (feilu > 1) {
            var shouxufei = 0.01 * feilu * val.txmoney
          } else {
            var shouxufei = feilu * val.txmoney;
          }
          var txcount = Number(shouxufei) + Number(val.txmoney);

          if (txcount > val.umoney) {
            wx.showModal({
              title: '提示',
              content: '提现手续费为' + shouxufei.toFixed(2) + '元,将从您提现金额中扣除',
              success: function(res) {
                if (res.confirm) {
                  app.util.request({
                    url: "entry/wxapp/Tixian",
                    data: val,
                    success: function(res) {
                      wx.showModal({
                        title: '提示',
                        content: '提现成功!请等待后台审核',
                        showCancel: true,
                        success: function() {
                          wx.navigateBack({})
                        },
                      })
                    }
                  })
                }
              }
            })
          } else {
            wx.showModal({
              title: '提示',
              content: '提现手续费为' + shouxufei.toFixed(2) + '元,将从您剩余金额中扣除',
              success: function(res) {
                if (res.confirm) {
                  wx.request({
                    url: "entry/wxapp/Tixian",
                    data: val,
                    success: function(res) {
                      wx.showModal({
                        title: '提示',
                        content: '提现成功!请等待后台审核',
                        showCancel: true,
                        success: function() {
                          wx.navigateBack({})
                        },
                      })
                    }
                  })
                }
              }
            })
          }
        }
      })

    }
  },
  // 提现到银行卡
  yhform(e) {
    var t = this,
      val = e.detail.value;
    if (val.yhnames == "") {
      wx.showModal({
        content: '请选择提现银行卡',
      })
    } else if (val.yhdizhi == "") {
      wx.showModal({
        content: '请输入开户行地址',
      })
    } else if (val.yhkahao == "") {
      wx.showModal({
        content: '请输入银行卡号',
      })
    } else if (val.yhname == "") {
      wx.showModal({
        content: '请输入银行预留姓名',
      })
    } else if (val.txmoney == "") {
      wx.showModal({
        content: '请输入提现金额',
      })
    } else if (val.txmoney < 0.01) {
      wx.showModal({
        content: '提现金额需大于0.01',
      })
    } else if (val.txmoney > val.umoney) {
      wx.showModal({
        content: '提现金额过大',
      })
    } else {
      console.log(val);
      val.store_id = wx.getStorageSync("store_id");
      val.typs = "银行卡";
      if (t.data.sf == '0') {
        val.style = "sj";
      } else {
        val.style = "yh";
      }
      val.user_id = wx.getStorageSync("UserData").id;
      wx.request({
        url: "entry/wxapp/GetPlatform",
        success: function(res) {
          console.log(res.data.txshouxufei);
          var feilu = res.data.txshouxufei;
          if (feilu > 1) {
            var shouxufei = 0.01 * feilu * val.txmoney
          } else {
            var shouxufei = feilu * val.txmoney;
          }
          var txcount = Number(shouxufei) + Number(val.txmoney);

          if (txcount > val.umoney) {
            wx.showModal({
              title: '提示',
              content: '提现手续费为' + shouxufei.toFixed(2) + '元,将从您提现金额中扣除',
              success: function(res) {
                if (res.confirm) {
                  app.util.request({
                    url: "entry/wxapp/Tixian",
                    data: val,
                    success: function(res) {
                      wx.showModal({
                        title: '提示',
                        content: '提现成功!请等待后台审核',
                        showCancel: true,
                        success: function() {
                          wx.navigateBack({})
                        },
                      })
                    }
                  })
                }
              }
            })
          } else {
            wx.showModal({
              title: '提示',
              content: '提现手续费为' + shouxufei.toFixed(2) + '元,将从您剩余金额中扣除',
              success: function(res) {
                if (res.confirm) {
                  wx.request({
                    url: "entry/wxapp/Tixian",
                    data: val,
                    success: function(res) {
                      wx.showModal({
                        title: '提示',
                        content: '提现成功!请等待后台审核',
                        showCancel: true,
                        success: function() {
                          wx.navigateBack({})
                        },
                      })
                    }
                  })
                }
              }
            })
          }
        }
      })
    }
  },
  

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    var fximgs = wx.getStorageSync("fximgs");
    console.log(fximgs);
    if (fximgs != '') {
      return {
        title: '充店宝',
        path: `/zh_zbkq/pages/index/index`,
        imageUrl: fximgs
      }
    } else if (fximgs == '') {
      return {
        title: '充店宝',
        path: `zh_zbkq/pages/index/index`,
      }
    }
  },
})