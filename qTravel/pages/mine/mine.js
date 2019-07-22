// pages/mine/mine.js
const API = require('../../utils/api')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getSiteInfo();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },


  getSiteInfo: function () {

    API.getSiteInfo().then(res => {
      this.setData({
        siteInfo: res
      })
    })
  },


  getUserInfoFun: function (e) {
    console.log(e);
    if (e.detail.errMsg == "getUserInfo:ok") {
      this.getProfile();
      wx.setStorageSync('user', e.detail)
      this.setData({
        user: true,
      })
    }
    else {
      return
    }


  },

  mineHandler:function(e){
  let url=e.currentTarget.dataset.url;
  wx.navigateTo({
    url: url,
  })
  },

  getProfile: function (e) {
    console.log(e);
    API.getProfile().then(res => {
      console.log(res)
      this.setData({
        user: res
      })
    })
      .catch(err => {
        console.log(err)
        wx.hideLoading()
      })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let user = app.globalData.user
    if (!user) {
      user = '';
    }
    this.setData({
      user: user,
    })
  },

  clear:function(){

    wx.clearStorageSync();
    wx.showToast({
      title: '清除完毕',
    })
    wx.switchTab({
      url: '/pages/mine/mine',
    })

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})