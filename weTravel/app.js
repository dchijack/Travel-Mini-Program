//app.js
const API = require('/utils/base')

App({

  onLaunch: function () {
    API.login();
    // 获取系统状态栏信息
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        this.globalData.CustomBar = e.platform == 'android' ? e.statusBarHeight + 50 : e.statusBarHeight + 45;
      }
    })
  },

  onShow: function () {
    this.globalData.user = API.getUser();
    this.globalData.skin = wx.getStorageSync('skin') ? wx.getStorageSync('skin') : 'bg-gray';
    this.globalData.color = wx.getStorageSync('color') ? wx.getStorageSync('color') : 'gray';
  },

  globalData: {
    user: '',
    skin: '',
    color: '',
    StatusBar: '',
    CustomBar: ''
  }

})