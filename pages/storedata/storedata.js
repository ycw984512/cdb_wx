// pages/setinfo/setinfo.js
import {
  request
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
    token: null,
    xieyi: false,
    ptxx: null,
    reject_reason: "",
    startDate: "",
    endDate: "",
    introduce: "",
    exhibition: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
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
        startDate: res.data.data.data.start_hours,
        endDate: res.data.data.data.end_hours,
        introduce: res.data.data.data.introduce,
        exhibition: res.data.data.data.exhibition,
        longitude: res.data.data.data.longitude,
        latitude: res.data.data.data.latitude,
        province: res.data.data.data.province,
        city: res.data.data.data.city,
        district: res.data.data.data.district
      })

      var that = this;

 
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


    })

  },
  chooseLogo() {
    var that = this;
    wx.chooseImage({
      count:1,
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

  chooseExhibition() {
    var that = this;
    wx.chooseImage({
      count: 6,
      sizeType: ['original', 'compressed'], //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        // 等有了真实的上传图片的地址再测试，把下面的this.setData注释掉 这部分解开
        var token = app.globalData.token;
        console.log(res);
        res.tempFilePaths.forEach((item, index) => {
          wx.uploadFile({
            url: app.globalData.imgUploadUrl + '/api/upload/img',
            filePath: item,
            name: 'file', //按个人情况修改，文件对应的 key,开发者在服务器端通过这个 key 可以获取到文件二进制内容，(后台接口规定的关于图片的请求参数)
            header: {
              "Content-Type": "multipart/form-data", //记得设置,
              token: token,
            },
            success(res) {
              const data = res.data;
              const exhibition = that.data.exhibition;
              exhibition.push(JSON.parse(res.data).data)
              that.setData({
                exhibition: exhibition,
              })

            }
          })
        })
      }
    })
  },
  repeatChoose(e) {
    var index = e.currentTarget.dataset.index;
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
            const exhibition = that.data.exhibition;
            exhibition.splice(index, 1, JSON.parse(res.data).data)
            that.setData({
              exhibition: exhibition,
            })

          }
        })
      }
    })

  },
  removeImg(e) {
    var index = e.currentTarget.dataset.index;
    const exhibition = this.data.exhibition;
    exhibition.splice(index, 1)
    this.setData({
      exhibition: exhibition,
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
  bindStartDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      startDate: e.detail.value
    })
  },
  bindEndDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      endDate: e.detail.value
    })
  },
  describeTap(e) {
    this.setData({
      introduce: e.detail.value
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
    var radioVlaue = this.data.radioVlaue;
    var token = this.data.token;
    var start_hours = this.data.startDate;
    var end_hours = this.data.endDate;
    var exhibition = this.data.exhibition;
    var introduce = this.data.introduce;


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
    } else if (start_hours == "") {
      wx.showModal({
        title: '提示',
        content: '营业开始时间不能为空',
      })
    } else if (end_hours == "") {
      wx.showModal({
        title: '提示',
        content: '营业结束时间不能为空',
      })
    } else if (introduce == "") {
      wx.showModal({
        title: '提示',
        content: '门店简介不能为空',
      })
    } else if (exhibition.length <= 0) {
      wx.showModal({
        title: '提示',
        content: '商家店铺图的图片不能小于1张',
      })
    } else if (exhibition.length > 6) {
      wx.showModal({
        title: '提示',
        content: '商家店铺图的图片不能超过6张',
      })
    }
    // else if (!radioVlaue) {
    //   wx.showModal({
    //     title: '',
    //     content: '请同意《平台入驻协议》再提交审核',
    //   })
    // } 
    else {
      request({
        url: "/api/store/update",
        header: {
          'content-type': 'application/json', // 默认值
          token: app.globalData.token
        },
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
          start_hours: start_hours,
          end_hours: end_hours,
          introduce: introduce,
          exhibition: exhibition,
        }
      }).then(res => {
        console.log(res);
        if (res.data.error_code == 0) {


          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 1500,
            mask: true
          })
          setTimeout(function () {
            wx.switchTab({
              url: '../home/home'
            })
          }, 1500)

          // wx.showModal({
          //   title: '提示',
          //   content: "修改成功",
          //   showCancel: false,
          //   success(res) {
          //     if (res.confirm) {
          //       wx.switchTab({
          //         url: '../home/home'
          //       })
          //     }
          //   }
          // })
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
  },

    /**
* 数组元素交换位置
* @param {array} arr 数组
* @param {number} index1 添加项目的位置
* @param {number} index2 删除项目的位置
* index1和index2分别是两个数组的索引值，即是两个要交换元素位置的索引值，如1，5就是数组中下标为1和5的两个元素交换位置
*/
swapArray(arr, index1, index2) {
    arr[index1] = arr.splice(index2, 1, arr[index1])[0];
    return arr;
  }
,
    //右移 将当前数组index索引与右边一个元素互换位置
zIndexUp(arr, index, length) {
    if (index + 1 != length) {
      this.swapArray(arr, index, index + 1);
    } else {
     wx.showToast({
       title: "已经在最右边了，无法右移",
       image: '/static/images/chahao1.png',
       duration: 1500,
       mask: true
     })
    }
  }
  ,
    //左移 将当前数组index索引与左边一个元素互换位置

zIndexDown(arr, index, length) {
    if (index != 0) {
      this.swapArray(arr, index, index - 1);
    } else {
      wx.showToast({
        title: "已经在最左边了，无法左移",
        image: '/static/images/chahao1.png',
        duration: 1500,
        mask: true
      })
    }
  },
  leftImg(e){
    var exhibition = this.data.exhibition;
    var index = e.currentTarget.dataset.index;
    var length = exhibition.length;
    this.zIndexDown(exhibition, index, length)
    console.log(exhibition);
    this.setData({
      exhibition: exhibition
    })
  },
  rightImg(e) {
    var exhibition = this.data.exhibition;
    var index = e.currentTarget.dataset.index;
    var length = exhibition.length;
    this.zIndexUp(exhibition, index, length)
    this.setData({
      exhibition: exhibition
    })
  },
})