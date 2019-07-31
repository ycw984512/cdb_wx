// pages/setinfo/setinfo.js
import {
  request, baseURL
} from "../../utils/request.js";
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk = new QQMapWX({
  key: 'C5JBZ-NHXW3-VBI33-3COH5-JJDLH-HTFSK'
});
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showTextOne: "请选择1",
    showTextTwo: "请选择2",
    state: undefined,
    nowText: "",
    logoUrl: "",
    logoBtn: true,
    licenseUrl: "",
    licenseBtn: true,
    idPositiveUrl: "",
    idPositiveBtn: true,
    idReverseUrl: "",
    idReverseBtn: true,
    personValue: "",
    phoneValue: "",
    addressValue: "",
    telValue: "",
    selectVlaue: "",
    lowerSelectValue: "",
    radioVlaue: false,
    longitude: "",
    latitude: "",
    province: "",
    city: "",
    district: "",
    address: "",
    selectArray: [],
    lowerSelectArray: [],
    upload_domain: null,
    address: "",
    extension_code: null,
    token: null,
    xieyi: false,
    ptxx: null,
    reject_reason: ""

  },

  /**
   * 生命周期函数--监听页面加载
   */

  onShow() {
    try {
      var extension_code = wx.getStorageSync('extension_code')
      if (extension_code) {
        this.setData({
          extension_code: extension_code,
        })
      }
    } catch (e) {
      console.log(获取推广码失败)
    }
  },
  onLoad: function(options) {

    var token = app.globalData.token;
    request({
      url: "/api/store/settled_state",
      header: {
        'content-type': 'application/json', // 默认值
        token: app.globalData.token
      },
    }).then(res => {
      //dosome
      console.log(res);
      this.setData({
        state: res.data.data.state
      })

      if (res.data.data.state == 0) {

        if (options.extension_code) {
          var extension_code = options.extension_code || "";
          wx.setStorageSync('extension_code', extension_code);
          this.setData({
            extension_code: extension_code,
          });
        } else {

          try {

            var extension_code = wx.getStorageSync('extension_code')
            if (extension_code) {
              this.setData({
                extension_code: extension_code,
              })
            }
          } catch (e) {
            console.log(获取推广码失败)
          }
        }


        var upload_domain = app.globalData.upload_domain;
        var token = app.globalData.token;

        this.setData({
          upload_domain: upload_domain,
          token: token
        });
        var that = this;

        var latitude = app.globalData.latitude;
        var longitude = app.globalData.longitude;
        that.setData({
          latitude: latitude,
          longitude: longitude
        })
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: (res) => {
            console.log(res);
            that.setData({
              city: res.result.address_component.city,
              province: res.result.address_component.province,
              district: res.result.address_component.district
            });
            var token = app.globalData.token;
            var province = that.data.province;
            var district = that.data.district;
            var city = that.data.city;

            // 行业分类接口
            request({
              url: "/api/store/get_catetgory",
              method: "post",
              header: {
                'content-type': 'application/json', // 默认值
                token: token
              },
            }).then(res => {
              //dosome
              var couponData = res.data.data;
              that.setData({
                selectArray: couponData,
              })
            })

            // 获取平台协议
            request({
              url: "/api/store/get_entry_agreement",
              method: "post",
              header: {
                'content-type': 'application/json', // 默认值
                token: token
              },
            }).then(res => {
              //dosome
              console.log(res.data.data)
              var ptxx = res.data.data;
              that.setData({
                ptxx: ptxx,
              })
            })
          }
        })

      } else if (res.data.data.state == 3) {

        try {
          var extension_code = wx.getStorageSync('extension_code')
          if (extension_code) {
            this.setData({
              extension_code: extension_code,
            })
          }
        } catch (e) {
          console.log(获取推广码失败)
        }


        var upload_domain = app.globalData.upload_domain;
        var token = app.globalData.token;
        this.setData({
          upload_domain: upload_domain,
          token: token
        });

        console.log(res.data.data.data)

        var industry_category_pid = res.data.data.data.industry_category_pid;
        var industry_category_id = res.data.data.data.industry_category_id;



        this.setData({
          logoUrl: res.data.data.data.logo,
          logoBtn: false,
          personValue: res.data.data.data.contacts,
          phoneValue: res.data.data.data.phone,
          address: res.data.data.data.address,
          addressValue: res.data.data.data.name,
          telValue: res.data.data.data.store_mobile,
          licenseUrl: res.data.data.data.business_license,
          licenseBtn: false,
          idPositiveUrl: res.data.data.data.id_card_positive,
          idPositiveBtn: false,
          idReverseUrl: res.data.data.data.id_card_back,
          idReverseBtn: false,
          reject_reason: res.data.data.data.reject_reason,
        })

        var that = this;

        var latitude = app.globalData.latitude;
        var longitude = app.globalData.longitude;
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: (res) => {
            console.log(res);
            that.setData({
              city: res.result.address_component.city,
              province: res.result.address_component.province,
              district: res.result.address_component.district
            });
            var token = app.globalData.token;
            var province = that.data.province;
            var district = that.data.district;
            var city = that.data.city;

            // 行业分类接口
            request({
              url: "/api/store/get_catetgory",
              method: "post",
              header: {
                'content-type': 'application/json', // 默认值
                token: token
              },
            }).then(res => {
              //dosome
              var couponData = res.data.data;

              couponData.forEach((item, index) => {
                if (item.id == industry_category_pid) {
                  that.setData({
                    selectVlaue: item,
                    showTextOne: item.name
                  })
                  request({
                    url: "/api/store/get_catetgory",
                    header: {
                      'content-type': 'application/json', // 默认值
                      token: app.globalData.token
                    },
                    data: {
                      pid: item.id,
                    }
                  }).then(res => {
                    //dosome
                    console.log(res);
                    res.data.data.forEach((item, index) => {
                      if (item.id == industry_category_id) {
                        that.setData({
                          lowerSelectValue: item,
                          showTextTwo: item.name
                        })
                      }
                    })
                    that.setData({
                      lowerSelectArray: res.data.data,
                    })
                  })



                }

              })

              that.setData({
                selectArray: couponData,
              })
            })

            // 获取平台协议
            request({
              url: "/api/store/get_entry_agreement",
              method: "post",
              header: {
                'content-type': 'application/json', // 默认值
                token: token
              },
            }).then(res => {
              //dosome
              console.log(res.data.data)
              var ptxx = res.data.data;
              that.setData({
                ptxx: ptxx,
              })
            })
          }
        })

      }
    })

  },
  chooseLogo() {
    var that = this;
    wx.chooseImage({
      count: 1,
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
            that.setData({
              logoUrl: JSON.parse(res.data).data,
              logoBtn: false
            })

          }
        })
      }
    })
  },
  chooseLicense() {
    var that = this;
    wx.chooseImage({
      count: 1,
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
            that.setData({
              licenseUrl: JSON.parse(res.data).data,
              licenseBtn: false
            })

          }
        })
      }
    })
  },
  LicensePositive() {
    var that = this;

    wx.chooseImage({
      count: 1,
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
            that.setData({
              idPositiveUrl: JSON.parse(res.data).data,
              idPositiveBtn: false
            })

          }
        })
      }
    })
  },
  LicenseReverse() {
    var that = this;
    wx.chooseImage({
      count: 1,
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
            that.setData({
              idReverseUrl: JSON.parse(res.data).data,
              idReverseBtn: false
            })

          }
        })
      }
    })
  },
  chooseAddress() {
    var that = this
    wx.chooseLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success(res) {
        const latitude = res.latitude;
        const longitude = res.longitude;
        const address = res.address;
        that.setData({
          latitude: latitude,
          longitude: longitude,
          address: address,
        })
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: (res) => {
            console.log(res);
            that.setData({
              city: res.result.address_component.city,
              province: res.result.address_component.province,
              district: res.result.address_component.district
            });
          }
        })
      }
    })
  },
  // scaleImage() {
  //   var arr = [];
  //   arr.push(this.data.upload_domain +this.data.logoUrl);
  //   wx.previewImage({
  //     urls: arr,
  //   })
  // },
  // scaleLicenseImage() {
  //   var arr = [];
  //   arr.push(this.data.upload_domain +this.data.licenseUrl);
  //   wx.previewImage({
  //     urls: arr,
  //   })
  // },
  // scalePositiveImage() {
  //   var arr = [];
  //   arr.push(this.data.upload_domain+this.data.idPositiveUrl);
  //   wx.previewImage({
  //     urls: arr,
  //   })
  // },
  // scaleReverseImage() {
  //   var arr = [];
  //   arr.push(this.data.upload_domain +this.data.idReverseUrl);
  //   wx.previewImage({
  //     urls: arr,
  //   })
  // },

  backindex() {
    wx.redirectTo({
      url: '../visitorindex/visitorindex',
    })
  },

  getDate: function(e) {
    console.log(e.detail);
    this.setData({
      selectVlaue: e.detail,
      lowerSelectValue: [],
      nowText: "请选择"
    })

    var token = app.globalData.token;
    var pid = this.data.selectVlaue.id;
    request({
      url: "/api/store/get_catetgory",
      header: {
        'content-type': 'application/json', // 默认值
        token: app.globalData.token
      },
      data: {
        pid: pid,
      }
    }).then(res => {
      //dosome
      console.log(res);
      this.setData({
        lowerSelectArray: res.data.data,
      })
    })
  },
  getLowerDate: function(e) {
    console.log(e.detail);
    this.setData({
      lowerSelectValue: e.detail
    })
  },

  codeTap(e) {
    console.log(e.detail.value);
    this.setData({
      extension_code: e.detail.value
    })
  },
  personTap(e) {
    console.log(e.detail.value);
    this.setData({
      personValue: e.detail.value
    })
  },
  phoneTap(e) {
    this.setData({
      phoneValue: e.detail.value
    })
  },
  addressTap(e) {
    this.setData({
      addressValue: e.detail.value
    })
  },
  addressLocation(e) {
    this.setData({
      address: e.detail.value
    })
  },
  telTap(e) {
    this.setData({
      telValue: e.detail.value
    })
  },

  submitBtn() {
    // 如果上面那种图片上传服务器获取地址的方法不行的话可以换promise的方法 用new Promise封装一层 然后用promise.all的方法去一个一个获取结果
    var name = this.data.addressValue;
    var logo = this.data.logoUrl;
    var contacts = this.data.personValue;
    var phone = this.data.phoneValue;
    var longitude = this.data.longitude;
    var latitude = this.data.latitude;
    var province = this.data.province;
    var city = this.data.city;
    var district = this.data.district;
    var address = this.data.address;
    var store_mobile = this.data.telValue;
    var industry_category_oneId = this.data.selectVlaue.id;
    var industry_category_id = this.data.lowerSelectValue.id;
    var business_license = this.data.licenseUrl;
    var id_card_positive = this.data.idPositiveUrl;
    var id_card_back = this.data.idReverseUrl;
    var extension_code = this.data.extension_code;
    var radioVlaue = this.data.radioVlaue;
    var token = this.data.token;

    if (logo == "") {
      wx.showModal({
        title: '提示',
        content: 'logo不能为空',
      })
    } else if (contacts == "") {
      wx.showModal({
        title: '提示',
        content: '门店联系人不能为空',
      })
    } else if (phone == "") {
      wx.showModal({
        title: '提示',
        content: '手机号码不能为空',
      })
    } else if (!/^1[34578]\d{9}$/.test(phone)) {
      wx.showModal({
        title: '提示',
        content: '手机号输入错误，请重新输入',
      })
    } else if (address == "") {
      wx.showModal({
        title: '提示',
        content: '详细地址不能为空',
      })
    } else if (name == "") {
      wx.showModal({
        title: '提示',
        content: '门店名称不能为空',
      })
    } else if (store_mobile == "") {
      wx.showModal({
        title: '提示',
        content: '门店电话不能为空',
      })
    } else if (!/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/.test(store_mobile)) {
      wx.showModal({
        title: '提示',
        content: '门店电话输入错误，请重新输入',
      })
    } else if (this.data.selectVlaue == "") {
      wx.showModal({
        title: '提示',
        content: '请选择所属行业一级分类',
      })
    } else if (this.data.lowerSelectValue == "") {
      wx.showModal({
        title: '提示',
        content: '请选择所属行业二级分类',
      })
    } else if (business_license == "") {
      wx.showModal({
        title: '提示',
        content: '营业执照不能为空',
      })
    } else if (id_card_positive == "") {
      wx.showModal({
        title: '提示',
        content: '身份证正面不能为空',
      })
    } else if (id_card_back == "") {
      wx.showModal({
        title: '提示',
        content: '身份证反面不能为空',
      })
    } else if (!radioVlaue) {
      wx.showModal({
        title: '',
        content: '请同意《平台入驻协议》再提交审核',
      })
    } else {
      wx.showLoading({
        title: "加载中",
        mask: true
      });
      wx.request({
        url: baseURL + "/api/store/settled_in",
        header: {
          'content-type': 'application/json', // 默认值
          token: app.globalData.token
        },
        method:"post",
        data: {
          name: name,
          logo: logo,
          contacts: contacts,
          phone: phone,
          longitude: longitude,
          latitude: latitude,
          province: province,
          city: city,
          district: district,
          address: address,
          store_mobile: store_mobile,
          industry_category_id: industry_category_id,
          business_license: business_license,
          id_card_positive: id_card_positive,
          id_card_back: id_card_back,
          extension_code: extension_code,
        },
        success(res){
          wx.hideLoading();
          console.log(res);
          if (res.data.error_code == 0) {
            if (res.data.data.pay == 1) {
              console.log(2222)
              wx.requestPayment({
                timeStamp: res.data.data.wx_pay.timeStamp,
                nonceStr: res.data.data.wx_pay.nonceStr,
                package: res.data.data.wx_pay.package,
                paySign: res.data.data.wx_pay.paySign,
                signType: "MD5",
                success(res) {


                  wx.showToast({
                    title: '提交成功',
                    icon: 'success',
                    duration: 1500,
                    mask: true
                  })
                  setTimeout(function () {
                    wx.reLaunch({
                      url: '../visitormy/visitormy'
                    })
                  }, 1500)

                  // wx.showModal({
                  //   title: '提示',
                  //   content: '已经提交审核，请点击确定按钮返回个人中心首页',
                  //   showCancel: false,
                  //   success(res) {
                  //     if (res.confirm) {
                  //       wx.reLaunch({
                  //         url: '../visitormy/visitormy',
                  //       })
                  //     }
                  //   }
                  // })

                },
                fail(res) {
                  wx.hideLoading();
                  console.log(res)
                },
                complete(res) {
                  console.log(res)
                }
              })
            } else {

              wx.showToast({
                title: '提交成功',
                icon: 'success',
                duration: 1500,
                mask: true
              })
              setTimeout(function () {
                wx.reLaunch({
                  url: '../visitormy/visitormy'
                })
              }, 1500)

              // wx.showModal({
              //   title: '提示',
              //   content: '已提交审核，请点击确定按钮返回个人中心首页',
              //   showCancel: false,
              //   success(res) {
              //     if (res.confirm) {
              //       wx.reLaunch({
              //         url: '../loadingIndex/loadingIndex',
              //       })
              //     }
              //   }
              // })
            }
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 1500,
              mask: true
            })
            // wx.showModal({
            //   title: '提示',
            //   content: res.data.msg,
            // })
          }
        }
      })
    }

  },
  radioChange(e) {
    console.log(e.detail.value);
    this.setData({
      radioVlaue: e.detail.value
    })
  },
  showXieYi(e) {
    this.setData({
      xieyi: true
    })
  },
  queren() {
    this.setData({
      xieyi: false
    })
  }
})