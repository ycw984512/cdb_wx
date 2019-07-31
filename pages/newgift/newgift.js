// pages/newgift/newgift.js
import {
  request,baseURL
} from "../../utils/request.js";
var app = getApp();
Page({
  data: {
    giftName: "",
    giftMoney: "",
    giftNumber: "",
    giftGoods: "",
    page: 1,
    list_rows: 999,
    /**
     * 页面的初始数据
     */
    allData1: [],
    allData2: [],
    longitude: null,
    latitude: null,
    upload_domain: null,
    selectData: [],
    couponNumber: "",
    selectId: ""

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function(options) {
    this.setData({
      upload_domain: app.globalData.upload_domain,
      longitude: app.globalData.longitude,
      latitude: app.globalData.latitude,
    });
    var token = app.globalData.token;
    const {
      page,
      list_rows,
      longitude,
      latitude
    } = this.data;
    //选择促销券的接口是我发布的优惠券 参数的type为促销券 state为已发布
    request({
      url: "/api/coupon/my_release_coupon",
      header: {
        'content-type': 'application/json', // 默认值
        token: app.globalData.token, storeId: app.globalData.storeId
      },
      data: {
        type: 2,
        state: 3,
        page,
        list_rows,
        longitude,
        latitude,
        use: 1

      }
    }).then(res => {
      //dosome  
      console.log(res);
      this.setData({
        allData1: res.data.data.data,
      })
    })

    //选择联盟商家券的接口是我下载的优惠券 参数的type为促销券 is_overdue为未过期
    request({
      url: "/api/user/download_coupon_list",
      header: {
        'content-type': 'application/json', // 默认值
        token: app.globalData.token, storeId: app.globalData.storeId
      },
      data: {
        type: 2,
        is_overdue: 1,
        page,
        list_rows,
        longitude,
        latitude,
        use: 1
      }
    }).then(res => {
      //dosome  
      console.log(res);
      this.setData({
        allData2: res.data.data.data,
      })
    })
  },

  giftName(e) {
    console.log(e.detail.value);
    this.setData({
      giftName: e.detail.value
    })
  },
  giftMoney(e) {
    console.log(e.detail.value);
    this.setData({
      giftMoney: e.detail.value
    })
  },
  giftNumber(e) {
    console.log(e.detail.value);
    this.setData({
      giftNumber: e.detail.value
    })
  },
  giftGoods(e) {
    console.log(e.detail.value);
    this.setData({
      giftGoods: e.detail.value
    })
  },

  //选择促销券中输入数量的时候改变对应的number
  bindCouponNumber(e) {
    console.log(e);
    var index = e.currentTarget.dataset.index;
    var allData1 = this.data.allData1;
    allData1[index].number = e.detail.value;
    this.setData({
      allData1: allData1
    })
  },
  //选择商家联盟券中输入数量的时候改变对应的number
  bindCouponNumber2(e) {
    console.log(e);

  },
  submitBtn() {
    var selectData = this.data.selectData;
    var giftName = this.data.giftName;
    var giftMoney = Number(this.data.giftMoney);
    var giftNumber = Number(this.data.giftNumber);
    var giftGoods = this.data.giftGoods;
    if (selectData == "") {
      wx.showModal({
        title: '提示',
        content: '必须至少放入一个礼包',
      })
    } else if (giftName == "") {
      wx.showModal({
        title: '提示',
        content: '请输入礼包名称',
      })
    } else if (giftMoney == "") {
      wx.showModal({
        title: '提示',
        content: '请输入线下充值金额',
      })
    } else if (giftMoney <= 0) {
      wx.showModal({
        title: '提示',
        content: '线下充值金额必须大于等于0 ',
      })
    } else if (giftNumber == "") {
      wx.showModal({
        title: '提示',
        content: '请输入需要创建的礼包个数',
      })
    } else if (giftNumber <= 0) {
      wx.showModal({
        title: '提示',
        content: '需要创建的礼包个数必须大于0 ',
      })
    } else {

      var token = app.globalData.token;
      wx.request({
        url: baseURL+"/api/gift/created_package",
        header: {
          'content-type': 'application/json', // 默认值
          token: app.globalData.token, storeId: app.globalData.storeId
        },
        method:"post",
        data: {
          name: giftName,
          pay_money: giftMoney,
          num: giftNumber,
          gift: giftGoods,
          data: selectData,
        },
        success(res){
          console.log(res);
          if (res.data.error_code == 0) {
            wx.showModal({
              title:"提示",
              content:"礼包创建成功，请点击确定跳转到已创建的礼包列表查看吧!"+"",
              showCancel: false,
              success(res) {
                if (res.confirm) {
                  wx.reLaunch({
                    url: '../mygift/mygift',
                    success: function (res) { },
                    fail: function (res) { },
                    complete: function (res) { },
                  })
                }
              }
            })

          } else {
            wx.showModal({
              title: '提示',
              content: res.data.msg+"",
            })
          }
        }
      })




    }



  },

  // 选择促销券放入礼包
  choosePromotion(e) {
    var index = e.currentTarget.dataset.index;
    var allData1 = this.data.allData1;
    var selectData = this.data.selectData;
    var id = allData1[index].id;
    var number = allData1[index].number;
    if (number > 0) {
      wx.showToast({
        title: '加入礼包成功',
        mask: true,
        icon: 'success',
        duration: 1000
      });
      allData1[index].flag = true;
      var obj = {};
      obj.id = id;
      obj.num = Number(number);
      selectData.push(obj);
      this.setData({
        selectData: selectData,
        allData1: allData1
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '请输入正确的礼包数量',
      });
      return;
    }
  },
  // 选择联盟商家券放入礼包
  chooseLeague(e) {

    wx.showToast({
      title: '加入礼包成功',
      icon: 'success',
      mask: true,
      duration: 1000
    });

    var index = e.currentTarget.dataset.index;
    var allData2 = this.data.allData2;
    var selectData = this.data.selectData;
    var id = allData2[index].coupon_id;
    allData2[index].number = 1;

    allData2[index].flag = true;
    var obj = {};
    obj.id = id;
    obj.num = 1;
    console.log(obj)
    selectData.push(obj);
    this.setData({
      selectData: selectData,
      allData2: allData2
    })

  },
  // 取消对应促销券礼包的放入
  cancelPromotion(e) {
    wx.showToast({
      title: '取消放入成功',
      mask: true,
      icon: 'success',
      duration: 1000
    });
    var index = e.currentTarget.dataset.index;
    var allData1 = this.data.allData1;
    var id = allData1[index].id;
    allData1[index].flag = false;
    allData1[index].number = 0;
    var selectData = this.data.selectData;
    selectData.forEach((item, index) => {
      if (item.id == id) {
        selectData.splice(index, 1)
      }
    });
    this.setData({
      allData1: allData1,
      selectData: selectData
    })

  },
  // 取消对应联盟商家券礼包的放入
  cancelLeague(e) {
    wx.showToast({
      title: '取消放入成功',
      mask: true,
      icon: 'success',
      duration: 1000
    });
    var index = e.currentTarget.dataset.index;
    var allData2 = this.data.allData2;
    var id = allData2[index].coupon_id;
    allData2[index].flag = false;
    allData2[index].number = 0;
    var selectData = this.data.selectData;
    selectData.forEach((item, index) => {
      if (item.id == id) {
        selectData.splice(index, 1)
      }
    });
    this.setData({
      allData2: allData2,
      selectData: selectData
    })

  }
})