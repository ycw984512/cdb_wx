// pages/changepassword/changepassword.js
import { request } from "../../utils/request.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    oldWord:"",
    newWord: "",
    sureWord: ""

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  oldWordTap(e) {
    this.setData({
      oldWord: e.detail.value
    })
   
  }
  ,
  newWordTap(e) {
    this.setData({
      newWord: e.detail.value
    })
  
  }
  ,
  sureWordTap(e){
    this.setData({
      sureWord: e.detail.value
    })
  },
  submitBtn(e) {
    var oldWord = this.data.oldWord;
    var newWord = this.data.newWord;
    var sureWord = this.data.sureWord;
    request({
      url: "/mock/5cf0c9643a6d9356cd506250/example/mock",
      data: { oldWord: oldWord, newWord: newWord, sureWord: sureWord}
    }).then(res => {
      //dosome

      console.log(res);

    })
  }
  ,
  
})