var app = getApp();
import {
  request
} from "../../utils/request.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allMoney: "",
    inputMoney: "",
    realMoney: "",
    rateMoney: "",
    rate: ""
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var token = app.globalData.token;
    var rate = app.globalData.service_charge;
    console.log(rate);
    this.setData({
      rate: rate
    })
    request({
      url: "/api/user/userinfo",
      header: {
        'content-type': 'application/json', // 默认值
        token: app.globalData.token,
        storeId: app.globalData.storeId,
      },
    }).then(res => {
      //dosome
      console.log(res);
      this.setData({
        allMoney: res.data.data.balance,
      })
    })

  },

  allmoney() {
    var allMoney = Number(this.data.allMoney);
    var rate = Number(this.data.rate);
    var rateMoney = allMoney * rate * 0.01 //手续费
    var realMoney = allMoney - rateMoney //实际到账金额
    console.log(rateMoney, realMoney)
    this.setData({
      inputMoney: allMoney,
      rateMoney,
      realMoney
    })
  },

  moneyInput(e) {
    var inputMoney = e.detail.value;
    var rate = Number(this.data.rate);
    var rateMoney = inputMoney * rate * 0.01 //手续费
    var realMoney = inputMoney - rateMoney //实际到账金额
    this.setData({
      inputMoney: inputMoney,
      rateMoney,
      realMoney

    })
  },
  submit() {
    var inputMoney = this.data.inputMoney;
    if (inputMoney == "") {
      // wx.showModal({
      //   title: '提示',
      //   content: '提现金额不能小于或等于0',
      // })
      wx.showToast({
        image: '/static/images/chahao2.png',
        icon: 'none',
        title: '请输入提现金额',
        mask: true,
        duration: 1500
      })

    } else if (inputMoney <= 0) {
      // wx.showModal({
      //   title: '提示',
      //   content: '提现金额不能小于或等于0',
      // })
      wx.showToast({
        image: '/static/images/chahao2.png',
        title: '提现金额错误',
        mask: true,
        duration: 1500
      })

    }  else {

      var token = app.globalData.token;

      request({
        url: "/api/user/balance_withdrawal",
        header: {
          'content-type': 'application/json', // 默认值
          token: app.globalData.token,
          storeId: app.globalData.storeId,
        },
        data: {
          amount: inputMoney
        }
      }).then(res => {
        //dosome
        console.log(res);

        if (res.data.error_code == 0) {

          wx.showToast({

            title: '提现请求已提交',
            mask: true,
            duration: 2000
          })
          setTimeout(function() {
            wx.navigateBack({
              delta: 1
            });
          }, 2000)

          // wx.showModal({
          //   title: '提示',
          //   content: "提现请求已提交,请耐心等待!",
          //   showCancel: false,
          //   success(res) {
          //     if (res.confirm) {
          //       wx.navigateBack({
          //         delta: 1
          //       })
          //     }
          //   }
          // })



        } else {

          wx.showToast({
            icon:"none",
            title: res.data.msg,
            mask: true,
            duration: 2000
          })
          // wx.showModal({
          //   title: '提示',
          //   content: res.data.msg,
          // })
        }

      })
    }


  }

})