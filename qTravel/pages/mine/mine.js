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
    qq.showLoading({
      title: '正在登录...',
    })
    API.getProfile().then(res => {
      console.log(res)
      this.setData({
        user: res
      })
      qq.hideLoading()
    })
    .catch(err => {
      console.log(err)
      qq.hideLoading()
    })
  },

  bindHandler: function(e) {
    let url=e.currentTarget.dataset.url;
    qq.navigateTo({
      url: url,
    })
  },

  loginOut: function() {
    API.Loginout()
    qq.clearStorageSync();
    qq.showToast({
      title: '清除完毕',
    })
  }
})