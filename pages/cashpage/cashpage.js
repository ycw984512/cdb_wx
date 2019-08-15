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
    rate: "",
    txtypes: ["微信", "银行卡"],
    current: 0,
    inputNumber:'',
    inputName:'',
    bank: ["中国农业银行", "中国工商银行", "中国建设银行", "中国银行", "中国交通银行","兴业银行",],
    yhkindex:0
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
  txsel(e) {
    this.setData({
      current: e.currentTarget.dataset.dex,
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
  selyhk(e) {
    this.setData({
      yhkindex: e.detail.value
    })
  },

  numberInput(e){
      this.setData({
        inputNumber:e.detail.value
      })
  },
  nameInput(e) {
    this.setData({
      inputName: e.detail.value
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
    var inputNumber = this.data.inputNumber;
    var inputName = this.data.inputName;
    var bankName = this.data.bank[this.data.yhkindex];
    if(this.data.current==0){
      if (inputMoney == "") {
        wx.showToast({
          image: '/static/images/chahao2.png',
          icon: 'none',
          title: '请输入提现金额',
          mask: true,
          duration: 1500
        })

      } else if (inputMoney <= 0) {

        wx.showToast({
          image: '/static/images/chahao2.png',
          title: '提现金额错误',
          mask: true,
          duration: 1500
        })

      } else {

        var token = app.globalData.token;

        request({
          url: "/api/user/balance_withdrawal",
          header: {
            'content-type': 'application/json', // 默认值
            token: app.globalData.token,
            storeId: app.globalData.storeId,
          },
          data: {
            mode:1,
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
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              });
            }, 2000)

          } else {

            wx.showToast({
              icon: "none",
              title: res.data.msg,
              mask: true,
              duration: 2000
            })

          }

        })
      }
    }else{
      if (inputMoney == "") {
        wx.showToast({
          image: '/static/images/chahao2.png',
          icon: 'none',
          title: '请输入提现金额',
          mask: true,
          duration: 1500
        })

      } else if (inputMoney <= 0) {

        wx.showToast({
          image: '/static/images/chahao2.png',
          title: '提现金额错误',
          mask: true,
          duration: 1500
        })

      } else if (inputNumber == "") {
        wx.showToast({
          image: '/static/images/chahao2.png',
          icon: 'none',
          title: '请输入银行卡号',
          mask: true,
          duration: 1500
        })

      } else if (inputName == "") {
        wx.showToast({
          image: '/static/images/chahao2.png',
          icon: 'none',
          title: '请输入真实姓名',
          mask: true,
          duration: 1500
        })

      } else {

        var token = app.globalData.token;

        request({
          url: "/api/user/balance_withdrawal",
          header: {
            'content-type': 'application/json', // 默认值
            token: app.globalData.token,
            storeId: app.globalData.storeId,
          },
          data: {
            mode: 2,
            bank_card_number: inputNumber,
            real_name: inputName,
            bank: bankName,
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
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              });
            }, 2000)

          } else {

            wx.showToast({
              icon: "none",
              title: res.data.msg,
              mask: true,
              duration: 2000
            })

          }

        })
      }


    }


  }

})