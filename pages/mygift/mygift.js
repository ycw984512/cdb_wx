  // pages/mygift/mygift.js
import {
  request
} from "../../utils/request.js";
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    giftList: [],
    page: 1,
    list_rows: 10,
    imgUrl: null,
    upload_domain: null,
    flag: false,
    moneyFlag: false,
    timeId: null,
    timeData: null,
    timer: null,
    items: [{
        name: 'common',
        value: '余额支付',
        checked: 'true'
      },
      {
        name: 'extension',
        value: '微信支付'
      },

    ],
    type: "common",
    storeId: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var token = app.globalData.token;
    var upload_domain = app.globalData.upload_domain;
    var storeId = app.globalData.storeId;

    this.setData({
      upload_domain: app.globalData.upload_domain,
      storeId: storeId
    });

    this.loadmovies();

  },

  loadmovies() {
    const {
      page,
      list_rows
    } = this.data;
    request({
      url: "/api/gift/index",
      header: {
        'content-type': 'application/json', // 默认值
        token: app.globalData.token,
        storeId: app.globalData.storeId
      },
      data: {
        page: page,
        list_rows: list_rows,
      }
    }).then(res => {
      //dosome
      console.log(res);
      var giftList = this.data.giftList;
      giftList.push(...res.data.data.data)
      this.setData({
        giftList: giftList,
      })
    })

  },
  radioChange: function(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    this.setData({
      type: e.detail.value
    })
  },

  //删除礼包
  removeCoupon(e) {
    var id = e.currentTarget.dataset.id;
    var token = app.globalData.token;
    request({
      url: "/api/gift/delete_package",
      header: {
        'content-type': 'application/json', // 默认值
        token: app.globalData.token,
        storeId: app.globalData.storeId
      },
      data: {
        id: id,
      }
    }).then(res => {
      //dosome
      console.log(res);
      if (res.data.error_code == 0) {
        wx.showToast({
          title: '删除成功',
          icon: 'success',
          duration: 1000,
          mask: true
        })
        setTimeout(function() {
          wx.reLaunch({
            url: '../mygift/mygift'
          })
        }, 1000)

      } else {
        wx.showModal({
          title: '提示',
          content: res.data.msg,
        })
      }
    })
  },

  //转赠礼包
  giveCoupon(e) {
    var that = this
    var id = e.currentTarget.dataset.id;
    var token = app.globalData.token;
    request({
      url: "/api/gift/get_giving_code",
      header: {
        'content-type': 'application/json', // 默认值
        token: app.globalData.token,
        storeId: app.globalData.storeId
      },
      data: {
        id: id,
      }
    }).then(res => {
      //dosome
      console.log(res);

      if (res.data.error_code == 0) {
        this.setData({
          imgUrl: res.data.data.code_img,
          flag: true,
          timeId: id,
 
        })

        clearInterval(that.data.timer); //开启定时器之前先清除定时器


        that.setData({

          timer: setInterval(function() { //开启轮询，1秒钟一次请求
            var token = app.globalData.token;

            request({
              url: "/api/gift/get_pre_receive_user",
              header: {
                'content-type': 'application/json', // 默认值
                token: app.globalData.token,
                storeId: app.globalData.storeId
              },
              data: {
                id: id,
                code:res.data.data.code
              }
            }).then(res => {
              console.log(res)
              if (res.data.error_code == 0) { //系统不报错
                if (res.data.data.is_exist == 1) { //is_exist==1时说明客户那边确认领取了
                  console.log("进来了is_exist == 1")
                  var timeData = res.data.data.data;
                  that.setData({
                    timeData: timeData,
                    flag: false,
                    moneyFlag: true,
                  })
                  clearInterval(that.data.timer)
                } else {
                  console.log("进来了is_exist == 0")
                }

              } else {
                wx.showModal({
                  title: '提示',
                  content: res.data.msg,
                })
              }
            })

          }, 1000)

        })


      } else {
        wx.showModal({
          title: '提示',
          content: res.data.msg,
        })
      }

    })

  },
  goNewGifts() {
    wx.navigateTo({
      url: '../newgift/newgift',
    })
  },
  //取消转赠
  cancelImg() {
    this.setData({
      flag: false
    })
  },

  //查看礼包详情
  goGiftDetail(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../giftdetail/giftdetail?id=' + id,
    })
  },

  //支付返佣金额
  payMoney(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var type = this.data.type;
    if (type == "extension") {
      request({
        url: "/api/gift/confirm_receive",
        header: {
          'content-type': 'application/json', // 默认值
          token: app.globalData.token,
          storeId: app.globalData.storeId
        },
        data: {
          id: id,
          pay_type: 1
        }
      }).then(res => {
        console.log(res);
        if (res.data.error_code == 0) {
          if (res.data.data.pay == 1) {
            wx.requestPayment({
              timeStamp: res.data.data.wx_pay.timeStamp,
              nonceStr: res.data.data.wx_pay.nonceStr,
              package: res.data.data.wx_pay.package,
              paySign: res.data.data.wx_pay.paySign,
              signType: "MD5",
              success(res) {
                that.setData({
                  moneyFlag: false
                })

                wx.showToast({
                  title: '支付成功',
                })

              },
              fail(res) {
                console.log(res)
              },

            })
          } else {
            that.setData({
              moneyFlag: false
            })
            wx.showToast({
              title: '确认成功',
            })
          }
        } else {

          that.setData({
            moneyFlag: false
          })

          wx.showModal({
            title: '提示',
            content: res.data.msg,
          })
        }

      })
    } else if (type == "common") {
      request({
        url: "/api/gift/confirm_receive",
        header: {
          'content-type': 'application/json', // 默认值
          token: app.globalData.token,
          storeId: app.globalData.storeId
        },
        data: {
          id: id,
          pay_type: 0
        }
      }).then(res => {
        console.log(res);
        if (res.data.error_code == 0) {
          if (res.data.data.pay == 1) {
            that.setData({
              moneyFlag: false
            })
            wx.showModal({
              title: '提示',
              content: '支付成功',
            })
          } else {
            that.setData({
              moneyFlag: false
            })
            wx.showToast({
              title: '确认成功',
            })
          }
        } else {

          that.setData({
            moneyFlag: false
          })

          wx.showModal({
            title: '提示',
            content: res.data.msg,
          })
        }

      })
    }
  },

  //取消不支付返佣
  cancleFlag() {
    this.setData({
      moneyFlag: false
    })
  },

  //卸载页面的时候清除定时器
  onUnload() {
    clearInterval(this.data.timer);
  },

  //卸载页面的时候清除定时器
  onHide() {
    clearInterval(this.data.timer);
  },


  onReachBottom() {
    const page = this.data.page;
    this.setData({
      page: page + 1,

    })
    this.loadmovies();
  },

  onPullDownRefresh: function() {
    const page = this.data.page;
    this.setData({
      page: 1,
      giftList: []
    })
    this.loadmovies();
    wx.stopPullDownRefresh();
  },
})