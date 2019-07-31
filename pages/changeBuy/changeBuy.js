// pages/publicbuylist/publicbuylist.js
import { request } from "../../utils/request.js";
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startDate: "",
    endDate: "",
    productImg: "",
    items: [
      { name: 'common', value: '一般模式'},
      { name: 'extension', value: '推广模式' },
    ],
    type: "common",
    couponName: "",
    couponPrice: "",
    couponBuyPrice: "",
    couponRate: "",
    extensionRate: "",
    template_id: "",
    upload_domain: null,
    id: null,
    caleValue: 0,
    textFlag: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var id = options.id;
    var upload_domain = app.globalData.upload_domain;
    this.setData({
      upload_domain: upload_domain,
      id: id
    });

    request({
      url: "/api/coupon/edit_detail",
      header: {
        'content-type': 'application/json', // 默认值
        token: app.globalData.token, storeId: app.globalData.storeId,
      },
      data: {
        id: id,
      }
    }).then(res => {
      var items = that.data.items;

      if (res.data.data.pattern == 1){
        console.log(1)
        items[0].checked=true;
        items[1].checked = false;
      }else{
        console.log(2)
        items[0].checked = false;
        items[1].checked = true
      }
     //dosome
      console.log(res);
      that.setData({
        couponName: res.data.data.name,
        couponPrice: res.data.data.original_price,
        startDate: res.data.data.start_time,
        endDate: res.data.data.end_time,
        productImg: res.data.data.logo,
        template_id: res.data.data.instructions,
        couponRate: res.data.data.rebate_commission,
        couponBuyPrice: res.data.data.buying_price,
        extensionRate: res.data.data.promotion_commission,
        type: res.data.data.pattern == 1 ? "common" :"extension",
        items:items
      })
    })
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    this.setData({
      type: e.detail.value
    })
  }
  ,
  bindStartDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      startDate: e.detail.value
    })
  },
  bindEndDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      endDate: e.detail.value
    })
  },
  addProductImg() {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        // 等有了真实的上传图片的地址再测试，把下面的this.setData注释掉 这部分解开
        var token = app.globalData.token;
        wx.uploadFile({
          url: app.globalData.imgUploadUrl + '/api/upload/img',

          filePath: res.tempFilePaths[0],
          name: 'file', //按个人情况修改，文件对应的 key,开发者在服务器端通过这个 key 可以获取到文件二进制内容，(后台接口规定的关于图片的请求参数)
          header: {
            "Content-Type": "multipart/form-data", //记得设置,
            token: token,
          },
          success(res) {
            const data = res.data;
            var upload_domain = that.data.upload_domain;
            console.log(res);
            console.log(res.data);
            console.log(JSON.parse(res.data).data);
            that.setData({
              productImg: JSON.parse(res.data).data,
              licenseBtn: false
            })

          }
        })

        // that.setData({
        //   productImg: res.tempFilePaths[0],
        // })

      }
    })
  },
  nameTap(e) {
    this.setData({
      couponName: e.detail.value
    })
  }
  ,
  buyPriceTap(e) {
    var extensionRate = this.data.extensionRate == '' ? 0 : this.data.extensionRate;
    extensionRate = extensionRate / 100;
    var caleValue = (e.detail.value - 1) * extensionRate
    this.setData({
      couponBuyPrice: e.detail.value,
      caleValue: caleValue
    })
  }
  ,
  originPriceTap(e) {
    this.setData({
      couponPrice: e.detail.value
    })
  }
  ,
  rateTap(e) {
    this.setData({
      couponRate: e.detail.value
    })
  }
  ,
  describeTap(e) {
    this.setData({
      template_id: e.detail.value
    })
  },
  extensionRateTap(e) {
    var couponBuyPrice = this.data.couponBuyPrice == '' ? 0 : this.data.couponBuyPrice;
    var caleValue = (couponBuyPrice - 1) * e.detail.value / 100

    this.setData({
      extensionRate: e.detail.value,
      caleValue: caleValue
    })
  },
  submitBtn() {
    // 如果上面那种图片上传服务器获取地址的方法不行的话可以换promise的方法 用new Promise封装一层 然后用promise.all的方法去一个一个获取结果
    var id = this.data.id;
    var start_time = this.data.startDate;
    var end_time = this.data.endDate;
    var logo = this.data.productImg;
    var name = this.data.couponName;
    var original_price = this.data.couponPrice;
    var buying_price = this.data.couponBuyPrice;
    var rebate_commission = this.data.couponRate;
    var pattern = this.data.type == "extension" ? 2 : 1;
    var instructions = this.data.template_id;
    var promotion_commission = this.data.extensionRate;
    var token = app.globalData.token;
    var type = 1;
    if (name == "") { wx.showModal({ title: '提示', content: '卡券名称不能为空', }) }
    else if (original_price == "") { wx.showModal({ title: '提示', content: '原价不能为空', }) }
    else if (buying_price == "") { wx.showModal({ title: '提示', content: '抢购价不能为空', }) }
    else if (original_price <= 0) { wx.showModal({ title: '提示', content: '原价不能小于或等于0', }) }
    else if (buying_price <= 0) { wx.showModal({ title: '提示', content: '抢购价不能小于或等于0', }) }
    else if (start_time == "") { wx.showModal({ title: '提示', content: '开始日期不能为空', }) }
    else if (end_time == "") { wx.showModal({ title: '提示', content: '结束日期不能为空', }) }
    else if (logo == "") { wx.showModal({ title: '提示', content: '产品图片不能为空', }) }
    else if (rebate_commission == "") { wx.showModal({ title: '提示', content: '返利佣金不能为空', }) }
    else if (rebate_commission < 1 || rebate_commission > 100) { wx.showModal({ title: '提示', content: '返利佣金请输入正确的范围', }) }
    else if (instructions == "") { wx.showModal({ title: '提示', content: '说明不能为空', }) } 
    else if (pattern == 2) {
      if (promotion_commission == "") {
        wx.showModal({
          title: '提示',
          content: '推广佣金不能为空',
        })
      } else if (promotion_commission < 1 || promotion_commission > 100) {
        wx.showModal({
          title: '提示',
          content: '推广佣金请输入正确的范围',
        })
      } else{
        request({
          url: "/api/coupon/update_coupon",
          data: {
            start_time: start_time,
            end_time: end_time,
            logo: logo,
            name: name,
            original_price: original_price,
            buying_price: buying_price,
            rebate_commission: rebate_commission,
            promotion_commission: promotion_commission,
            type: type,
            instructions: instructions,
            pattern: pattern,
            id: id
          },
          header: {
            'content-type': 'application/json', // 默认值
            token: token, storeId: app.globalData.storeId,
          },
        }).then(res => {
          //dosome
          console.log(res);
          if (res.data.error_code == 0) {
            wx.showToast({
              title: '发布成功',
              icon: 'success',
              duration: 1500
            })
            setTimeout(function () {
              wx.redirectTo({
                url: '../haspublicbuy/haspublicbuy',
              })
            }, 1500)
          } else {
            wx.showModal({
              title: '提示',
              content: res.data.msg,
            })
          }

        })
      }
    }
    else {
      request({
        url: "/api/coupon/update_coupon",
        data: {
          start_time: start_time,
          end_time: end_time,
          logo: logo,
          name: name,
          original_price: original_price,
          buying_price: buying_price,
          rebate_commission: rebate_commission,
          promotion_commission: promotion_commission,
          type: type,
          instructions: instructions,
          pattern: pattern,
          id: id
        },
        header: {
          'content-type': 'application/json', // 默认值
          token: token, storeId: app.globalData.storeId,
        },
      }).then(res => {
        //dosome
        console.log(res);
        if (res.data.error_code == 0) {
          wx.showToast({
            title: '发布成功',
            icon: 'success',
            duration: 1500
          })
          setTimeout(function () {
            wx.redirectTo({
              url: '../haspublicbuy/haspublicbuy',
            })
          }, 1500)
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
          })
        }

      })
    }

  },
  goHowTOTemplate() {
    wx.navigateTo({
      url: '../后台的一个说明连接/后台的一个说明连接',
    })
  },
  goTemplate() {
    wx.navigateTo({
      url: '../choosetemplate/choosetemplate'
    })
  }

})