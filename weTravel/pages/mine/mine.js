/**
 * Author : 丸子团队（波波、Chi、ONLINE.信）
 * Github 地址: https://github.com/dchijack/Travel-Mini-Program
 * GiTee 地址： https://gitee.com/izol/Travel-Mini-Program
 */
// pages/mine/mine.js
const API = require('../../utils/api')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    
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
    let user = app.globalData.user
    if (!user) {
      user = '';
    }
    this.setData({
      user: user,
    })
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

  getProfile: function (e) {
    console.log(e);
    wx.showLoading({
      title: '正在登录...',
    })
    API.getProfile().then(res => {
      console.log(res)
      this.setData({
        user: res
      })
      wx.hideLoading()
    })
    .catch(err => {
      console.log(err)
      wx.hideLoading()
    })
  },

  subscribeMessage: function(template,status) {
    let args = {}
    args.openid = this.data.user.openId
    args.template = template
    args.status = status
    args.pages = getCurrentPages()[0].route
    args.platform = wx.getSystemInfoSync().platform
    args.program = 'WeChat'
    API.subscribeMessage(args).then(res => {
      console.log(res)
      wx.showToast({
        title: res.message,
        icon: 'success',
        duration: 1000
      })
    })
    .catch(err => {
      console.log(err)
      wx.showToast({
        title: err.message,
        icon: 'success',
        duration: 1000
      })
    })
  },

  bindHandler: function(e) {
    let url=e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url,
    })
  },

  bindSubscribe: function() {
    let that = this
    let templates = API.template().subscribe
	  wx.requestSubscribeMessage({
      tmplIds: templates,
      success(res) {
        if (res.errMsg == "requestSubscribeMessage:ok") {
          for (let i = 0; i < templates.length; i++) {
            let template = templates[i]
            that.subscribeMessage(template, "accept")
          }
        }
      },
      fail:function(res) {
        console.log(res)
      }
	  })
  },

  loginOut: function() {
    API.Loginout()
    wx.clearStorageSync();
    wx.showToast({
      title: '清除完毕',
    })
  }
})